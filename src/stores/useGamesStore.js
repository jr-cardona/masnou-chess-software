import {defineStore} from 'pinia';
import {useHistoryStore} from "./useHistoryStore";
import {usePlayersStore} from "./usePlayersStore";
import {useQueueStore} from "./useQueueStore";
import {useTournamentStore} from "./useTournamentStore";

export const useGamesStore = defineStore('gamesStore', {
    state: () => ({
        activeGames: [],
    }),
    actions: {
        processResult(board, winnerColor) {
            if (!this.activeGames[board]) {
                return;
            }
            useHistoryStore().saveState();
            const {white: whiteName, black: blackName} = this.activeGames[board];
            if (winnerColor === 'white') {
                this.whiteWins(board, whiteName, blackName);
            } else if (winnerColor === 'black') {
                this.blackWins(board, whiteName, blackName);
            } else {
                this.draw(board, whiteName, blackName);
            }
        },

        whiteWins(board, white, black) {
            const playersStore = usePlayersStore();
            playersStore.players.find(player => player.name === white).points += 1;
            this.repair(board, white, black);
        },

        blackWins(board, white, black) {
            const playersStore = usePlayersStore();
            playersStore.players.find(player => player.name === black).points += 1;
            this.repair(board, black, white);
        },

        draw(board, white, black) {
            const playersStore = usePlayersStore();
            playersStore.players.find(player => player.name === white).points += 0.5;
            playersStore.players.find(player => player.name === black).points += 0.5;
            this.repair(board, black, white);
        },

        repair(board, winner, loser) {
            const playersStore = usePlayersStore()
            const queueStore = useQueueStore();
            const tournamentStore = useTournamentStore();
            playersStore.players.sort((a, b) => b.points - a.points);
            if (tournamentStore.timer > 0) {
                this.activeGames[board] = {white: winner, black: queueStore.dequeue()};
                queueStore.enqueue(loser);
            } else {
                delete this.activeGames[board];
                if (this.activeGames.length === 0) {
                    tournamentStore.endTournament();
                }
            }
        },
    }
});