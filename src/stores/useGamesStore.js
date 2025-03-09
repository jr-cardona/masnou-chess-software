import {defineStore} from 'pinia';
import {useHistoryStore} from "./useHistoryStore";
import {usePlayersStore} from "./usePlayersStore";
import {useQueueStore} from "./useQueueStore";
import {useTournamentStore} from "./useTournamentStore";
import {useSettingsStore} from "./useSettingsStore";

export const useGamesStore = defineStore('gamesStore', {
    state: () => ({
        activeGames: [],
    }),
    actions: {
        processResult(board, winner, loser) {
            useHistoryStore().saveState();
            const whiteName = this.activeGames[board].white.name;
            const blackName = this.activeGames[board].black.name;

            if (winner === null && loser === null) {
                return this.draw(board, whiteName, blackName);
            }

            this.handleWin(board, winner, loser, whiteName);
        },

        handleWin(board, winner, loser, whiteName) {
            const playersStore = usePlayersStore();
            const queueStore = useQueueStore();
            const settingsStore = useSettingsStore();

            const playersMap = new Map(playersStore.players.map(p => [p.name, p]));
            const winnerPlayer = playersMap.get(winner.name);
            const loserPlayer = playersMap.get(loser.name);
            winnerPlayer.points += 1;
            winnerPlayer.wins += 1;
            winnerPlayer.consecutiveWins += 1;

            const winLimit = settingsStore.settings.maxWins;

            if (winLimit !== 'unlimited' && winnerPlayer.consecutiveWins >= parseInt(winLimit, 10)) {
                queueStore.enqueue(winnerPlayer);
                queueStore.enqueue(loserPlayer);
                this.getOpponent(board, null, null);
                return;
            }
            queueStore.enqueue(loserPlayer);
            this.getOpponent(board, winnerPlayer, this.shouldWinnerPlayWhite(winnerPlayer.name === whiteName));
        },

        draw(board, whiteName, blackName) {
            const queueStore = useQueueStore();
            const settingsStore = useSettingsStore();
            const playersStore = usePlayersStore();

            const playersMap = new Map(playersStore.players.map(p => [p.name, p]));
            const whitePlayer = playersMap.get(whiteName);
            const blackPlayer = playersMap.get(blackName);
            whitePlayer.points += 0.5;
            blackPlayer.points += 0.5;

            switch (settingsStore.settings.drawScenario) {
                case 'bothOut':
                    queueStore.enqueue(blackPlayer);
                    queueStore.enqueue(whitePlayer);
                    this.getOpponent(board, null, null);
                    break;
                case 'whiteOut':
                    queueStore.enqueue(whitePlayer);
                    blackPlayer.consecutiveWins = 0;
                    this.getOpponent(board, blackPlayer, this.shouldWinnerPlayWhite(false));
                    break;
            }
        },

        shouldWinnerPlayWhite(winnerWasWhite) {
            const winnerColorSetting = useSettingsStore().settings.winnerColor;
            const winnerColorRules = {
                alwaysWhite: true,
                alwaysBlack: false,
                repeat: winnerWasWhite,
                changes: !winnerWasWhite
            };
            return winnerColorRules[winnerColorSetting] ?? winnerWasWhite;
        },

        getOpponent(board, winner, shouldWinnerPlayWhite) {
            const queueStore = useQueueStore();
            const tournamentStore = useTournamentStore();
            const playersStore = usePlayersStore();

            playersStore.players.sort((a, b) => b.points - a.points || b.wins - a.wins);

            if (tournamentStore.timer <= 0) {
                this.activeGames.splice(board, 1);
                if (this.activeGames.length === 0) {
                    tournamentStore.endTournament();
                }
                return;
            }

            if (!winner) {
                if (this.shouldRemoveBoardDueToBalance()) {
                    this.activeGames.splice(board, 1);
                    return;
                }
                this.activeGames[board] = {white: queueStore.dequeue(), black: queueStore.dequeue()};
                return;
            }

            if (this.shouldRemoveBoardDueToBalance()) {
                queueStore.enqueueAtStart(winner);
                this.activeGames.splice(board, 1);
                return;
            }

            this.activeGames[board] = shouldWinnerPlayWhite
                ? {white: winner, black: queueStore.dequeue()}
                : {white: queueStore.dequeue(), black: winner};
        },

        addBoard() {
            const queueStore = useQueueStore();
            useHistoryStore().saveState();
            this.activeGames.push({white: queueStore.dequeue(), black: queueStore.dequeue()});
        },

        removePlayerFromGame(removedPlayer) {
            const queueStore = useQueueStore();

            const boardIndex = this.activeGames.findIndex(
                g => g.white.name === removedPlayer.name || g.black.name === removedPlayer.name
            );

            if (boardIndex === -1) return;

            const game = this.activeGames[boardIndex];
            if (this.shouldRemoveBoardDueToBalance()) {
                const opponent = game.white.name === removedPlayer.name ? game.black : game.white;
                queueStore.enqueueAtStart(opponent);
                this.activeGames.splice(boardIndex, 1);
                return;
            }

            game[game.white.name === removedPlayer.name ? 'white' : 'black'] = queueStore.dequeue();
        },

        shouldRemoveBoardDueToBalance() {
            const queueStore = useQueueStore();
            const activePlayers = usePlayersStore().players.filter(p => p.status !== 'paused').length;
            const idealQueueSize = activePlayers - (Math.round(activePlayers / 3) * 2);
            return queueStore.queue.length < idealQueueSize && this.activeGames.length > 1;
        }
    }
});