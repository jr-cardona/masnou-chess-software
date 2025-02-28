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
            useQueueStore().enqueue(black);
            this.getOpponent(board, white, this.getNewColor(true));
        },

        blackWins(board, white, black) {
            black.points += 1;
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

            if (tournamentStore.timer <= 0) {
                delete this.activeGames[board];
                if (this.activeGames.length === 0) {
                    tournamentStore.endTournament();
                }
                return;
            }

            if (!winner) {
                this.activeGames[board] = {white: queueStore.dequeue(), black: queueStore.dequeue()};
                return;
            }

            this.activeGames[board] = whiteWinner
                ? {white: winner, black: queueStore.dequeue()}
                : {white: queueStore.dequeue(), black: winner};

            usePlayersStore().players.sort((a, b) => b.points - a.points);
        },

        removePlayerFromGame(player) {
            const queueStore = useQueueStore();

            const game = this.activeGames.find(
                g => g.white.name === player.name || g.black.name === player.name
            );

            if (!game) return;

            const nextPlayer = queueStore.dequeue();

            if (game.white.name === player.name) {
                game.white = nextPlayer;
            }
            if (game.black.name === player.name) {
                game.black = nextPlayer;
            }
        }
    }
});