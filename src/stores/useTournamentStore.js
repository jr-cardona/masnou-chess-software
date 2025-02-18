import {defineStore} from 'pinia';
import {usePlayersStore} from './usePlayersStore';
import {useQueueStore} from './useQueueStore';
import {useGamesStore} from './useGamesStore';
import {useHistoryStore} from './useHistoryStore';

export const useTournamentStore = defineStore('tournamentStore', {
    state: () => ({
        timer: 0,
        status: 'idle',
    }),
    actions: {
        startPairing() {
            const playersStore = usePlayersStore();
            const totalPlayers = playersStore.players.length;

            if (totalPlayers < 6 || this.status === 'inCourse') {
                return;
            }

            useHistoryStore().saveState();
            const queueStore = useQueueStore();
            this.calculateInitialQueue(queueStore, playersStore, totalPlayers)
            const playersNotInQueue = playersStore.players.filter(
                player => !queueStore.queue.includes(player.name)
            );
            this.assignGames(playersNotInQueue);
            this.status = 'paired';
        },

        calculateInitialQueue(queueStore, playersStore, totalPlayers) {
            const expectedQueueLength = totalPlayers - ((Math.round(totalPlayers / 3)) * 2);

            if (queueStore.queue.length < expectedQueueLength) {
                const missingInQueue = expectedQueueLength - queueStore.queue.length;
                const queueSet = new Set(queueStore.queue);
                const availablePlayers = playersStore.players.filter(player => !queueSet.has(player.name));
                availablePlayers.slice(-missingInQueue).forEach(player => queueStore.enqueue(player.name));
            }
        },

        assignGames(playersNotInQueue) {
            const gamesStore = useGamesStore();
            const midIndex = Math.ceil(playersNotInQueue.length / 2);
            const firstHalf = playersNotInQueue.slice(0, midIndex);
            const secondHalf = playersNotInQueue.slice(midIndex);

            firstHalf.forEach((player, index) => {
                if (secondHalf[index]) {
                    gamesStore.activeGames[index] = {white: player.name, black: secondHalf[index].name};
                }
            });
        },

        startTournament() {
            if (this.status !== 'paired') return;
            useHistoryStore().saveState({timer: this.timer});
            this.status = 'inCourse';
        },

        pauseTournament() {
            if (this.status !== 'inCourse') return;
            useHistoryStore().saveState({timer: this.timer});
            this.status = 'stopped';
        },

        resumeTournament() {
            if (this.status !== 'stopped') return;
            useHistoryStore().saveState({timer: this.timer});
            this.status = 'inCourse';
        },

        endTournament() {
            if (this.status !== 'inCourse') return;
            this.status = 'finished';
        },

        decreaseTimer() {
            if (this.timer > 0) {
                this.timer--;
            }
        },
    },
});
