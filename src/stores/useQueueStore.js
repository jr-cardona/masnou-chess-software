import {defineStore} from 'pinia';

export const useQueueStore = defineStore('queueStore', {
    state: () => ({
        queue: [],
    }),
    actions: {
        enqueue(player) {
            player.status = 'queued';
            player.consecutiveWins = 0;
            this.queue.push(player);
        },

        enqueueAtStart(player) {
            player.status = 'queued';
            this.queue.unshift(player);
        },

        dequeue() {
            const player = this.queue.shift();
            player.status = 'playing';
            return player;
        },

        removeFromQueue(player) {
            this.queue = this.queue.filter(p => p.name !== player.name);
        },
    }
});