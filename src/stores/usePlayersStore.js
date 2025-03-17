import {defineStore} from 'pinia';
import {useQueueStore} from './useQueueStore';
import {useHistoryStore} from './useHistoryStore';
import {useTournamentStore} from './useTournamentStore';
import {useGamesStore} from './useGamesStore';
import testPlayers from './testPlayers.json';

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
            const newPlayer = {
                name: name,
                points: 0,
                wins: 0,
                draws: 0,
                losses: 0,
                consecutiveWins: 0,
                status: 'active'
            };
            this.players.push(newPlayer);
            const tournamentStore = useTournamentStore();
            if (tournamentStore.status === 'inCourse' || tournamentStore.status === 'paired') {
                const queueStore = useQueueStore();
                queueStore.enqueue(newPlayer, 'tournamentInCourse');
            }
        },

        removePlayer(playerName) {
            const historyStore = useHistoryStore();

            const player = this.players.find(p => p.name === playerName);

            historyStore.saveState();
            this.players = this.players.filter(p => p.name !== player.name);
        },

        pausePlayer(playerName) {
            const historyStore = useHistoryStore();
            const gameStore = useGamesStore();
            const queueStore = useQueueStore();

            const player = this.players.find(p => p.name === playerName);

            historyStore.saveState();
            historyStore.addPausePlayerEvent(player.name);

            switch (player.status) {
                case 'playing':
                    gameStore.removePlayerFromGame(player);
                    break;
                case 'queued':
                    queueStore.removeFromQueue(player);
                    break;
            }
            player.status = 'paused';
        },

        resumePlayer(playerName) {
            const historyStore = useHistoryStore();
            const queueStore = useQueueStore();

            const player = this.players.find(p => p.name === playerName);

            historyStore.saveState();
            queueStore.enqueue(player, 'resume');
        },

        addTestData() {
            useHistoryStore().saveState();
            this.players.push(...testPlayers);
        }
    },
    getters: {
        playersWithStats(state) {
            return state.players.map((player, index) => {
                const gamesPlayed = (player.wins || 0) + (player.draws || 0) + (player.losses || 0);
                const winRate = gamesPlayed === 0 ? "0.00" : ((player.wins || 0) / gamesPlayed * 100).toFixed(2);
                return {
                    ...player,
                    rank: index + 1,
                    gamesPlayed,
                    winRate
                };
            });
        }
    }
});