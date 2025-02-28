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
        processResult(board, winnerColor) {
            if (!this.activeGames[board]) return;
            useHistoryStore().saveState();
            const {white, black} = this.activeGames[board];
            if (winnerColor === 'white') return this.whiteWins(board, white, black);
            if (winnerColor === 'black') return this.blackWins(board, white, black);
            return this.draw(board, white, black);
        },

        whiteWins(board, white, black) {
            white.points += 1;
            white.wins += 1;
            useQueueStore().enqueue(black);
            this.getOpponent(board, white, this.getNewColor(true));
        },

        blackWins(board, white, black) {
            black.points += 1;
            black.wins += 1;
            useQueueStore().enqueue(white);
            this.getOpponent(board, black, this.getNewColor(false));
        },

        draw(board, white, black) {
            const queueStore = useQueueStore();
            const settingsStore = useSettingsStore();

            white.points += 0.5;
            black.points += 0.5;

            switch (settingsStore.settings.drawScenario) {
                case 'bothOut':
                    queueStore.enqueue(black);
                    queueStore.enqueue(white);
                    this.getOpponent(board, null, null);
                    break;
                case 'whiteOut':
                    queueStore.enqueue(white);
                    this.getOpponent(board, black, this.getNewColor(false));
                    break;
            }
        },

        getNewColor(isWhite) {
            const settingsStore = useSettingsStore();
            return settingsStore.settings.winnerColor === 'changes' ? !isWhite : isWhite;
        },

        getOpponent(board, winner, whiteWinner) {
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
            this.activeGames[board] = whiteWinner
                ? {white: winner, black: queueStore.dequeue()}
                : {white: queueStore.dequeue(), black: winner};
        },

        addBoard() {
            const queueStore = useQueueStore();
            const white = queueStore.dequeue();
            const black = queueStore.dequeue();
            white.status = 'playing';
            black.status = 'playing';
            this.activeGames.push({ white, black });
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