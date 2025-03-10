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
            const newPlayer = {name: name, points: 0, wins: 0, consecutiveWins: 0, status: 'active'};
            this.players.push(newPlayer);
            const tournamentStore = useTournamentStore();
            if (tournamentStore.status === 'inCourse' || tournamentStore.status === 'paired') {
                const queueStore = useQueueStore();
                queueStore.enqueue(newPlayer, 'tournamentInCourse');
            }
        },

        removePlayer(player) {
            useHistoryStore().saveState();
            this.players = this.players.filter(p => p.name !== player.name);
        },

        pausePlayer(player) {
            const queueStore = useQueueStore();
            const historyStore = useHistoryStore();
            historyStore.saveState();
            historyStore.addPausePlayerEvent(player.name);

            switch (player.status) {
                case 'playing':
                    const gameStore = useGamesStore();
                    const boardIndex = gameStore.activeGames.findIndex(
                        g => g.white.name === player.name || g.black.name === player.name
                    );

                    if (boardIndex === -1) return;

                    const game = gameStore.activeGames[boardIndex];
                    if (gameStore.shouldRemoveBoardDueToBalance()) {
                        const opponent = game.white.name === player.name ? game.black : game.white;
                        queueStore.enqueueAtStart(opponent);
                        gameStore.deleteBoard(boardIndex);
                    } else {
                        game[game.white.name === player.name ? 'white' : 'black'] = queueStore.dequeue(boardIndex);
                    }
                    break;
                case 'queued':
                    queueStore.queue = queueStore.queue.filter(p => p.name !== player.name);
                    break;
            }
            player.status = 'paused';
        },

        resumePlayer(player) {
            const queueStore = useQueueStore();
            useHistoryStore().saveState();
            queueStore.enqueue(player, 'resume');
        },

        addTestData() {
            useHistoryStore().saveState();
            this.players.push(...[
                {name: "Hurtado Felipe", elo: 2900, points: 0, wins: 0, consecutiveWins: 0, status: "active"},
                {name: "Magnus Carlsen", elo: 2850, points: 0, wins: 0, consecutiveWins: 0, status: "active"},
                {name: "Hikaru Nakamura", elo: 2780, points: 0, wins: 0, consecutiveWins: 0, status: "active"},
                {name: "Ding Liren", elo: 2810, points: 0, wins: 0, consecutiveWins: 0, status: "active"},
                {name: "Alireza Firouzja", elo: 2761, points: 0, wins: 0, consecutiveWins: 0, status: "active"},
                {name: "Ian Nepomniachtchi", elo: 2795, points: 0, wins: 0, consecutiveWins: 0, status: "active"},
                {name: "Fabiano Caruana", elo: 2785, points: 0, wins: 0, consecutiveWins: 0, status: "active"},
                {name: "Levon Aronian", elo: 2752, points: 0, wins: 0, consecutiveWins: 0, status: "active"},
                {name: "Anish Giri", elo: 2750, points: 0, wins: 0, consecutiveWins: 0, status: "active"},
                {name: "Wesley So", elo: 2768, points: 0, wins: 0, consecutiveWins: 0, status: "active"},
                {name: "Richard Rapport", elo: 2745, points: 0, wins: 0, consecutiveWins: 0, status: "active"},
                {name: "Maxime Vachier-Lagrave", elo: 2756, points: 0, wins: 0, consecutiveWins: 0, status: "active"},
                {name: "Sergey Karjakin", elo: 2740, points: 0, wins: 0, consecutiveWins: 0, status: "active"},
                {name: "Shakhriyar Mamedyarov", elo: 2738, points: 0, wins: 0, consecutiveWins: 0, status: "active"},
                {name: "Teimour Radjabov", elo: 2731, points: 0, wins: 0, consecutiveWins: 0, status: "active"},
                {name: "Jan-Krzysztof Duda", elo: 2728, points: 0, wins: 0, consecutiveWins: 0, status: "active"},
                {name: "Vidit Gujrathi", elo: 2719, points: 0, wins: 0, consecutiveWins: 0, status: "active"},
                {name: "Sam Shankland", elo: 2704, points: 0, wins: 0, consecutiveWins: 0, status: "active"},
                {name: "Pentala Harikrishna", elo: 2698, points: 0, wins: 0, consecutiveWins: 0, status: "active"},
                {name: "Alexander Grischuk", elo: 2705, points: 0, wins: 0, consecutiveWins: 0, status: "active"},
                {name: "Daniil Dubov", elo: 2702, points: 0, wins: 0, consecutiveWins: 0, status: "active"}
            ]);
        }
    }
});