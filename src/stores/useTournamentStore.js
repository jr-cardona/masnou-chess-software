import {defineStore} from 'pinia';

export const useTournamentStore = defineStore('tournamentStore', {
    state: () => ({
        players: [],
        activeGames: [],
        queue: [],
        timer: 600,
        status: 'toStart',
        history: [],
        winners: [],
    }),
    actions: {
        saveState() {
            const stateCopy = {
                players: this.players,
                activeGames: this.activeGames,
                queue: this.queue,
                isRunning: this.isRunning,
            };
            this.history.push(JSON.stringify(stateCopy));
            if (this.history.length > 100) this.history.shift();
        },
        undo() {
            if (this.history.length > 0) {
                const prevState = JSON.parse(this.history.pop());
                this.players = prevState.players;
                this.activeGames = prevState.activeGames;
                this.queue = prevState.queue;
                this.isRunning = prevState.isRunning;
            }
        },
        addPlayer(name, elo = 0) {
            if (this.players.some(player => player.name === name)) {
                return;
            }
            this.saveState();
            this.players.push({name, points: 0, elo});
            if (this.status === 'inCourse') {
                this.queue.push(name);
            }
        },
        removePlayer(name) {
            this.saveState();
            this.players = this.players.filter(player => player.name !== name);
            this.queue = this.queue.filter(player => player !== name);
        },
        startTournament() {
            const totalPlayers = this.players.length;

            if (totalPlayers < 3 || this.status === 'inCourse') {
                return;
            }

            // Init
            this.saveState();
            this.status = 'inCourse';
            this.timer = 600;
            this.winners = [];

            // # Boards/Players calculation
            const boards = Math.ceil(totalPlayers / 3);

            // Pairing
            let index = 0;
            for (let board = 0; board < boards; board++) {
                if (index + 1 < totalPlayers) {
                    this.activeGames[board] = {
                        white: this.players[index].name,
                        black: this.players[index + 1].name,
                    };
                    index += 2;
                }
            }

            // Rest to the queue
            this.queue = this.players.slice(index).map(player => player.name);
        },
        decreaseTimer() {
            if (this.timer > 0) {
                this.timer--;
            }
        },
        endTournament() {
            this.saveState();
            this.status = 'finished';
            this.activeGames = [];
            this.queue = [];
            this.winners = [...this.players].sort((a, b) => b.points - a.points);
        },
        processResult(board, winnerColor) {
            console.log(board, winnerColor)
            if (!this.activeGames[board]) {
                return;
            }
            this.saveState();
            const {white, black} = this.activeGames[board];
            if (winnerColor === 'draw') {
                this.draw(board, white, black);
            } else if (winnerColor === 'white') {
                this.whiteWins(board, white, black);
            } else {
                this.blackWins(board, white, black);
            }
        },
        whiteWins(board, white, black) {
            this.players.find(player => player.name === white).points += 1;
            this.pair(board, white, black);
        },
        blackWins(board, white, black) {
            this.players.find(player => player.name === black).points += 1;
            this.pair(board, black, white);
        },
        draw(board, white, black) {
            this.players.find(player => player.name === white).points += 0.5;
            this.players.find(player => player.name === black).points += 0.5;
            this.pair(board, black, white);
        },
        pair(board, winner, loser) {
            if (this.status === 'inCourse') {
                this.activeGames[board] = {white: winner, black: this.queue.shift()};
                this.queue.push(loser);
            } else {
                delete this.activeGames[board];
                if (this.activeGames.length === 0) {
                    this.endTournament();
                }
            }
        },
    },
    persist: {
        enabled: true,
        strategies: [
            { key: 'tournament', storage: localStorage, paths: ['players', 'activeGames', 'queue', 'isRunning', 'timer'] }
        ]
    }
});
