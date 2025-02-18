import {defineStore} from 'pinia';
import {useQueueStore} from './useQueueStore';
import {useHistoryStore} from './useHistoryStore';
import {useTournamentStore} from './useTournamentStore';

export const usePlayersStore = defineStore('playersStore', {
    state: () => ({
        players: [],
    }),
    actions: {
        addPlayer(name, elo, startInQueue) {
            if (this.players.some(player => player.name === name)) {
                return;
            }
            useHistoryStore().saveState();
            this.players.push({name, points: 0, elo, status: 'active'});
            this.players.sort((a, b) => b.points - a.points || b.elo - a.elo);
            const tournamentStore = useTournamentStore();
            if (tournamentStore.status === 'inCourse' || tournamentStore.status === 'paired' || startInQueue) {
                const queueStore = useQueueStore();
                queueStore.enqueue(name);
            }
        },

        removePlayer(name) {
            useHistoryStore().saveState();
            this.players = this.players.filter(player => player.name !== name);
            const queueStore = useQueueStore();
            queueStore.removeFromQueue(name);
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
                queueStore.enqueue(name);
                player.status = 'active';
            }
        },
    }
});