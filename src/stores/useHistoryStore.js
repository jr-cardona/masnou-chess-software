import {defineStore} from 'pinia';
import {usePlayersStore} from './usePlayersStore';
import {useQueueStore} from './useQueueStore';
import {useGamesStore} from './useGamesStore';
import {useTournamentStore} from './useTournamentStore';

export const useHistoryStore = defineStore('historyStore', {
    state: () => ({
        history: [],
        events: [],
    }),
    actions: {
        saveState(extra = {}) {
            const playersStore = usePlayersStore();
            const queueStore = useQueueStore();
            const gamesStore = useGamesStore();
            const tournamentStore = useTournamentStore();

            const stateSnapshot = {
                players: JSON.parse(JSON.stringify(playersStore.players)),
                queue: JSON.parse(JSON.stringify(queueStore.queue)),
                activeGames: JSON.parse(JSON.stringify(gamesStore.activeGames)),
                events: JSON.parse(JSON.stringify(this.events)),
                status: tournamentStore.status,
                ...extra
            };

            this.history.push(stateSnapshot);
            if (this.history.length > 100) this.history.shift();
        },

        addEvent(key, params = {}) {
            const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);

            if (this.events.length > 0 && this.events[0].timestamp === timestamp) {
                this.events[0].events.unshift({key, params});
            } else {
                this.events.unshift({
                    timestamp,
                    events: [{key, params}]
                });
            }
        },

        addMatchResultEvent(board, whiteName, blackName, result) {
            this.addEvent('match_result', {board: board + 1, whiteName, blackName, result});
        },

        addPlayerQueuedEvent(playerName, reason) {
            this.addEvent('player_queued', {player: playerName, reason});
        },

        addPlayerQueuedAtStartEvent(playerName) {
            this.addEvent('player_queued_at_start', {player: playerName});
        },

        addPlayerDequeuedEvent(playerName, boardIndex) {
            this.addEvent('player_dequeued', {player: playerName, boardIndex: boardIndex + 1});
        },

        addPairingEvent(board, whiteName, blackName) {
            this.addEvent('pairing', {board: board + 1, whiteName, blackName});
        },

        addBoardEvent(board) {
            this.addEvent('board_added', {board: board + 1});
        },

        deleteBoardEvent(board) {
            this.addEvent('board_deleted', {board: board + 1});
        },

        addPausePlayerEvent(playerName) {
            this.addEvent('player_paused', {player: playerName});
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
            this.events = prevState.events;
            if (prevState.timer !== undefined) {
                tournamentStore.setTimer(prevState.timer);
            }
        },
    }
});
