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

        addTestData() {
            this.players.push(...[
                {name: "Hurtado Felipe", elo: 2900, points: 0, status: "active"},
                {name: "Magnus Carlsen", elo: 2850, points: 0, status: "active"},
                {name: "Hikaru Nakamura", elo: 2780, points: 0, status: "active"},
                {name: "Ding Liren", elo: 2810, points: 0, status: "active"},
                {name: "Alireza Firouzja", elo: 2761, points: 0, status: "active"},
                {name: "Ian Nepomniachtchi", elo: 2795, points: 0, status: "active"},
                {name: "Fabiano Caruana", elo: 2785, points: 0, status: "active"},
                {name: "Levon Aronian", elo: 2752, points: 0, status: "active"},
                {name: "Anish Giri", elo: 2750, points: 0, status: "active"},
                {name: "Wesley So", elo: 2768, points: 0, status: "active"},
                {name: "Richard Rapport", elo: 2745, points: 0, status: "active"},
                {name: "Maxime Vachier-Lagrave", elo: 2756, points: 0, status: "active"},
                {name: "Sergey Karjakin", elo: 2740, points: 0, status: "active"},
                {name: "Shakhriyar Mamedyarov", elo: 2738, points: 0, status: "active"},
                {name: "Teimour Radjabov", elo: 2731, points: 0, status: "active"},
                {name: "Jan-Krzysztof Duda", elo: 2728, points: 0, status: "active"},
                {name: "Vidit Gujrathi", elo: 2719, points: 0, status: "active"},
                {name: "Sam Shankland", elo: 2704, points: 0, status: "active"},
                {name: "Pentala Harikrishna", elo: 2698, points: 0, status: "active"},
                {name: "Alexander Grischuk", elo: 2705, points: 0, status: "active"},
                {name: "Daniil Dubov", elo: 2702, points: 0, status: "active"}
            ]);
        }
    }
});