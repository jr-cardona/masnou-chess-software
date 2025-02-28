import {defineStore} from 'pinia';
import {usePlayersStore} from './usePlayersStore';
import {useQueueStore} from './useQueueStore';
import {useGamesStore} from './useGamesStore';
import {useHistoryStore} from './useHistoryStore';
import {useSettingsStore} from "./useSettingsStore";

export const useTournamentStore = defineStore('tournamentStore', {
    state: () => ({
        timer: 0,
        status: 'idle',
    }),
    actions: {
        startPairing() {
            const playersStore = usePlayersStore();
            const queueStore = useQueueStore();
            const gamesStore = useGamesStore();
            const settingsStore = useSettingsStore();

            const totalPlayers = playersStore.players.length;
            const maxBoards = settingsStore.settings.maxBoards;
            const maxPlayersInGames = maxBoards * 2;

            if (totalPlayers < 6 || this.status === 'inCourse') {
                return {success: false, reason: 'notEnoughPlayers'};
            }

            useHistoryStore().saveState();
            this.shuffleArray(playersStore.players);
            const queueSize = totalPlayers - ((Math.round(totalPlayers / 3)) * 2);
            const playersSize = Math.min(totalPlayers - queueSize, maxPlayersInGames);
            const playersInGames = playersStore.players.slice(0, playersSize);
            const playersInQueue = playersStore.players.slice(playersSize);
            for (let i = 0; i < playersInGames.length; i += 2) {
                if (playersInGames[i + 1]) {
                    gamesStore.activeGames[i / 2] = {
                        white: playersInGames[i],
                        black: playersInGames[i + 1]
                    };
                    playersInGames[i].status = 'playing';
                    playersInGames[i + 1].status = 'playing';
                }
            }
            for (let i = 0; i < playersInQueue.length; i++) {
                queueStore.enqueue(playersInQueue[i]);
            }

            this.status = 'paired';
            return {success: true};
        },

        shuffleArray(array) {
            return array.sort(() => Math.random() - 0.5);
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
