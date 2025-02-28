import {defineStore} from 'pinia';
import {useQueueStore} from './useQueueStore';
import {useHistoryStore} from './useHistoryStore';
import {useTournamentStore} from './useTournamentStore';
import {useGamesStore} from "./useGamesStore";

export const usePlayersStore = defineStore('playersStore', {
    state: () => ({
        players: [],
    }),
    actions: {
        addPlayer(name) {
            if (this.players.some(player => player.name === name)) {
                return;
            }
            useHistoryStore().saveState();
            const newPlayer = {name: name, points: 0, wins: 0, status: 'active'};
            this.players.push(newPlayer);
            this.players.sort((a, b) => b.points - a.points);
            const tournamentStore = useTournamentStore();
            if (tournamentStore.status === 'inCourse' || tournamentStore.status === 'paired') {
                const queueStore = useQueueStore();
                queueStore.enqueue(newPlayer);
            }
        },

        removePlayer(player) {
            useHistoryStore().saveState();
            this.players = this.players.filter(p => p.name !== player.name);
            const queueStore = useQueueStore();
            queueStore.removeFromQueue(player);
        },

        pausePlayer(player) {
            if (!player) return;

            const queueStore = useQueueStore();
            const gameStore = useGamesStore();
            useHistoryStore().saveState();

            if (player.status === 'playing') {
                gameStore.removePlayerFromGame(player);
            } else {
                queueStore.removeFromQueue(player);
            }
            player.status = 'paused';
        },

        resumePlayer(player) {
            const queueStore = useQueueStore();
            useHistoryStore().saveState();
            queueStore.enqueue(player);
        },

        addTestData() {
            this.players.push(...[
                {name: "Hurtado Felipe", elo: 2900, points: 0, wins: 0, status: "active"},
                {name: "Magnus Carlsen", elo: 2850, points: 0, wins: 0, status: "active"},
                {name: "Hikaru Nakamura", elo: 2780, points: 0, wins: 0, status: "active"},
                {name: "Ding Liren", elo: 2810, points: 0, wins: 0, status: "active"},
                {name: "Alireza Firouzja", elo: 2761, points: 0, wins: 0, status: "active"},
                {name: "Ian Nepomniachtchi", elo: 2795, points: 0, wins: 0, status: "active"},
                {name: "Fabiano Caruana", elo: 2785, points: 0, wins: 0, status: "active"},
                {name: "Levon Aronian", elo: 2752, points: 0, wins: 0, status: "active"},
                {name: "Anish Giri", elo: 2750, points: 0, wins: 0, status: "active"},
                {name: "Wesley So", elo: 2768, points: 0, wins: 0, status: "active"},
                {name: "Richard Rapport", elo: 2745, points: 0, wins: 0, status: "active"},
                {name: "Maxime Vachier-Lagrave", elo: 2756, points: 0, wins: 0, status: "active"},
                {name: "Sergey Karjakin", elo: 2740, points: 0, wins: 0, status: "active"},
                {name: "Shakhriyar Mamedyarov", elo: 2738, points: 0, wins: 0, status: "active"},
                {name: "Teimour Radjabov", elo: 2731, points: 0, wins: 0, status: "active"},
                {name: "Jan-Krzysztof Duda", elo: 2728, points: 0, wins: 0, status: "active"},
                {name: "Vidit Gujrathi", elo: 2719, points: 0, wins: 0, status: "active"},
                {name: "Sam Shankland", elo: 2704, points: 0, wins: 0, status: "active"},
                {name: "Pentala Harikrishna", elo: 2698, points: 0, wins: 0, status: "active"},
                {name: "Alexander Grischuk", elo: 2705, points: 0, wins: 0, status: "active"},
                {name: "Daniil Dubov", elo: 2702, points: 0, wins: 0, status: "active"}
            ]);
        }
    }
});