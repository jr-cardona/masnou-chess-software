import {defineStore} from 'pinia';
import {useHistoryStore} from './useHistoryStore';

export const useQueueStore = defineStore('queueStore', {
    state: () => ({
        queue: [],
    }),
    actions: {
        enqueue(player, reason = 'loss') {
            const historyStore = useHistoryStore();
            player.status = 'queued';
            player.consecutiveWins = 0;
            historyStore.addPlayerQueuedEvent(player.name, reason);
            this.queue.push(player);
        },

        enqueueAtStart(player) {
            const historyStore = useHistoryStore();
            player.status = 'queued';
            historyStore.addPlayerQueuedAtStartEvent(player.name);
            this.queue.unshift(player);
        },

        dequeue(boardIndex) {
            const historyStore = useHistoryStore();
            const player = this.queue.shift();
            player.status = 'playing';
            historyStore.addPlayerDequeuedEvent(player.name, boardIndex);
            return player;
        },

        removeFromQueue(player) {
            this.queue = this.queue.filter(p => p.name !== player.name);
        }
    }
});