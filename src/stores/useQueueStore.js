import {defineStore} from 'pinia';

export const useQueueStore = defineStore('queueStore', {
    state: () => ({
        queue: [],
    }),
    actions: {
        enqueue(name) {
            this.queue.push(name);
        },

        dequeue() {
            return this.queue.shift();
        },

        removeFromQueue(name) {
            this.queue = this.queue.filter(playerName => playerName !== name);
        },
    }
});