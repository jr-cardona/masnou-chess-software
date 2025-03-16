import {defineStore} from 'pinia';
import {usePlayersStore} from './usePlayersStore';
import {useQueueStore} from './useQueueStore';
import {useGamesStore} from './useGamesStore';
import {useTournamentStore} from './useTournamentStore';

const restoreTournamentState = (prevState) => {
    const playersStore = usePlayersStore();
    const queueStore = useQueueStore();
    const gamesStore = useGamesStore();
    const tournamentStore = useTournamentStore();
    const historyStore = useHistoryStore();

    playersStore.players = prevState.players;
    queueStore.queue = prevState.queue;
    gamesStore.activeGames = prevState.activeGames;
    tournamentStore.status = prevState.status;
    historyStore.events = prevState.events;
    if (prevState.timer !== undefined) {
        tournamentStore.setTimer(prevState.timer);
    }
};

export const useHistoryStore = defineStore('historyStore', {
    state: () => ({
        history: [],
        events: [],
    }),
    actions: {
        saveManualState() {
            const snapshot = this.getSnapshot({timer: useTournamentStore().timer});
            window.electron.ipcRenderer.send('save-tournament', snapshot);
        },

        saveState(extra = {}) {
            const snapshot = this.getSnapshot(extra);
            this.history.push(snapshot);
            if (this.history.length > 25) this.history.shift();
        },

        getSnapshot(extra = {}) {
            const playersStore = usePlayersStore();
            const queueStore = useQueueStore();
            const gamesStore = useGamesStore();
            const tournamentStore = useTournamentStore();

            return {
                players: JSON.parse(JSON.stringify(playersStore.players)),
                queue: JSON.parse(JSON.stringify(queueStore.queue)),
                activeGames: JSON.parse(JSON.stringify(gamesStore.activeGames)),
                events: JSON.parse(JSON.stringify(this.events)),
                status: tournamentStore.status,
                ...extra
            };
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

            restoreTournamentState(prevState);
        },
    }
});

export const loadTournament = async () => {
    const tournamentState = await window.electron.ipcRenderer.invoke('load-tournament');
    const tournamentStore = useTournamentStore();

    if (tournamentState) {
        restoreTournamentState(tournamentState);
        tournamentStore.startTimer();
    }
};
