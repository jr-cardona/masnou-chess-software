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
            const {white, black} = this.activeGames[board];

            if (winner === null && loser === null) {
                return this.draw(board, white, black);
            }

            this.handleWin(board, winner, loser, white);

        },

        handleWin(board, winner, loser, white) {
            const playersStore = usePlayersStore();
            const queueStore = useQueueStore();
            const winnerPlayer = playersStore.players.find(p => p.name === winner.name);
            const loserPlayer = playersStore.players.find(p => p.name === loser.name);
            winnerPlayer.points += 1;
            winnerPlayer.wins += 1;
            winnerPlayer.consecutiveWins += 1;
            loserPlayer.consecutiveWins = 0;
            queueStore.enqueue(loser);
            this.getOpponent(board, winner, this.shouldWinnerPlayWhite(winner === white));
        },

        draw(board, white, black) {
            const queueStore = useQueueStore();
            const settingsStore = useSettingsStore();
            const playersStore = usePlayersStore();

            const whitePlayer = playersStore.players.find(p => p.name === white.name);
            const blackPlayer = playersStore.players.find(p => p.name === black.name);
            whitePlayer.points += 0.5;
            blackPlayer.points += 0.5;
            whitePlayer.consecutiveWins = 0;
            blackPlayer.consecutiveWins = 0;

            switch (settingsStore.settings.drawScenario) {
                case 'bothOut':
                    queueStore.enqueue(black);
                    queueStore.enqueue(white);
                    this.getOpponent(board, null, null);
                    break;
                case 'whiteOut':
                    queueStore.enqueue(white);
                    this.getOpponent(board, black, this.shouldWinnerPlayWhite(false));
                    break;
            }
        },

        shouldWinnerPlayWhite(winnerWasWhite) {
            const winnerColorSetting = useSettingsStore().settings.winnerColor;
            switch (winnerColorSetting) {
                case 'alwaysWhite':
                    return true;
                case 'alwaysBlack':
                    return false;
                case 'repeat':
                    return winnerWasWhite;
                case 'changes':
                    return !winnerWasWhite;
                default:
                    return winnerWasWhite;
            }
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
            const white = queueStore.dequeue();
            const black = queueStore.dequeue();
            white.status = 'playing';
            black.status = 'playing';
            this.activeGames.push({white, black});
        },

        removePlayerFromGame(player) {
            const queueStore = useQueueStore();

            const boardIndex = this.activeGames.findIndex(
                g => g.white.name === player.name || g.black.name === player.name
            );

            if (boardIndex === -1) return;

            const game = this.activeGames[boardIndex];
            if (this.shouldRemoveBoardDueToBalance()) {
                const opponent = game.white.name === player.name ? game.black : game.white;
                queueStore.enqueueAtStart(opponent);
                this.activeGames.splice(boardIndex, 1);
                return;
            }

            const nextPlayer = queueStore.dequeue();

            if (game.white.name === player.name) {
                game.white = nextPlayer;
            }
            if (game.black.name === player.name) {
                game.black = nextPlayer;
            }
        },

        shouldRemoveBoardDueToBalance() {
            const queueStore = useQueueStore();
            const activePlayers = usePlayersStore().players.filter(p => p.status !== 'paused').length;
            const idealQueueSize = activePlayers - (Math.round(activePlayers / 3) * 2);
            return queueStore.queue.length < idealQueueSize && this.activeGames.length > 1;
        }
    }
});