import {defineStore} from 'pinia';
import {usePlayersStore} from "./usePlayersStore";
import {useQueueStore} from "./useQueueStore";
import {useGamesStore} from "./useGamesStore";
import {useHistoryStore} from "./useHistoryStore";

export const useTournamentStore = defineStore('tournamentStore', {
    state: () => ({
        timer: 600,
        status: 'idle',
    }),
    actions: {
        startTournament() {
            const playersStore = usePlayersStore();
            const totalPlayers = playersStore.players.length;

            if (totalPlayers < 3 || this.status === 'inCourse') {
                return;
            }

            // Init
            const queueStore = useQueueStore();
            const gamesStore = useGamesStore();
            useHistoryStore().saveState();
            this.status = 'inCourse';
            this.timer = 600;

            // # Boards/Players calculation
            const boards = Math.round(totalPlayers / 3);

            // Pairing
            let index = 0;
            for (let board = 0; board < boards; board++) {
                if (index + 1 < totalPlayers) {
                    gamesStore.activeGames[board] = {
                        white: playersStore.players[index].name,
                        black: playersStore.players[index + 1].name,
                    };
                    index += 2;
                }
            }

            // The rest to the queue
            queueStore.queue = playersStore.players.slice(index).map(player => player.name);
        },
        decreaseTimer() {
            if (this.timer > 0) {
                this.timer--;
            }
        },
        endTournament() {
            const gamesStore = useGamesStore();
            const queueStore = useQueueStore();
            useHistoryStore().saveState();
            this.status = 'finished';
            gamesStore.activeGames = [];
            queueStore.queue = [];
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {key: 'tournament', storage: localStorage, paths: ['players', 'activeGames', 'queue', 'isRunning', 'timer']}
        ]
    }
});
