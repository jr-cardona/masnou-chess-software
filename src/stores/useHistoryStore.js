import { defineStore } from 'pinia';
import { usePlayersStore } from './usePlayersStore';
import { useQueueStore } from './useQueueStore';
import { useGamesStore } from './useGamesStore';
import {useTournamentStore} from "./useTournamentStore";

export const useHistoryStore = defineStore('historyStore', {
    state: () => ({
        history: []
    }),
    actions: {
        saveState() {
            const playersStore = usePlayersStore();
            const queueStore = useQueueStore();
            const gamesStore = useGamesStore();
            const tournamentStore = useTournamentStore();

            const stateSnapshot = {
                players: JSON.parse(JSON.stringify(playersStore.players)),
                queue: JSON.parse(JSON.stringify(queueStore.queue)),
                activeGames: JSON.parse(JSON.stringify(gamesStore.activeGames)),
                status: tournamentStore.status
            };

            this.history.push(stateSnapshot);
            if (this.history.length > 100) this.history.shift();
        },

        undo() {
            if (this.history.length === 0) return;

            const prevState = this.history.pop();
            const playersStore = usePlayersStore();
            const queueStore = useQueueStore();
            const gamesStore = useGamesStore();
            const tournamentStore = useTournamentStore();

            playersStore.players = prevState.players;
            queueStore.queue = prevState.queue;
            gamesStore.activeGames = prevState.activeGames;
            tournamentStore.status = prevState.status;
        },
    }
});
