import {defineStore} from 'pinia';
import {useGamesStore} from "./useGamesStore";
import {useQueueStore} from "./useQueueStore";
import {useHistoryStore} from "./useHistoryStore";

export const usePlayersStore = defineStore('playersStore', {
    state: () => ({
        players: [],
    }),
    actions: {
        addPlayer(name, elo = 1200) {
            if (this.players.some(player => player.name === name)) {
                return;
            }
            useHistoryStore().saveState();
            const gamesStore = useGamesStore();
            this.players.push({name, points: 0, elo, status: 'active'});
            if (gamesStore.status === 'inCourse') {
                const queueStore = useQueueStore();
                queueStore.queueStore.enqueue(name);
            }
        },
        removePlayer(name) {
            useHistoryStore().saveState();
            this.players = this.players.filter(player => player.name !== name);
        },
        pausePlayer(name) {
            const player = this.players.find(p => p.name === name);
            if (player) {
                useHistoryStore().saveState();
                const queueStore = useQueueStore();
                queueStore.removeFromQueue(name);
                player.status = 'paused';
            }
        },
        resumePlayer(name) {
            const player = this.players.find(p => p.name === name);
            if (player) {
                useHistoryStore().saveState();
                const queueStore = useQueueStore();
                // @ToDo this might generate a bug if the player is already in a game
                queueStore.queueStore.enqueue(name);
                player.status = 'active';
            }
        }
    }
});