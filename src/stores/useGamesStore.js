import {defineStore} from 'pinia';
import {useHistoryStore} from './useHistoryStore';
import {usePlayersStore} from './usePlayersStore';
import {useQueueStore} from './useQueueStore';
import {useTournamentStore} from './useTournamentStore';
import {useSettingsStore} from './useSettingsStore';

export const useGamesStore = defineStore('gamesStore', {
    state: () => ({
        activeGames: [],
    }),
    actions: {
        processResult(boardIndex, winner, loser) {
            const historyStore = useHistoryStore();

            historyStore.saveState();
            const whiteName = this.activeGames[boardIndex].white.name;
            const blackName = this.activeGames[boardIndex].black.name;

            if (winner === null && loser === null) {
                historyStore.addMatchResultEvent(boardIndex, whiteName, blackName, '½-½');
                return this.draw(boardIndex, whiteName, blackName);
            }

            let whiteWon = false;
            if (winner.name === whiteName) {
                whiteWon = true;
            }
            const result = whiteWon ? '1 - 0' : '0 - 1';
            historyStore.addMatchResultEvent(boardIndex, whiteName, blackName, result);
            this.handleWin(boardIndex, winner, loser, whiteWon);
        },

        handleWin(boardIndex, winner, loser, whiteWon) {
            const playersStore = usePlayersStore();
            const queueStore = useQueueStore();
            const settingsStore = useSettingsStore();

            const playersMap = new Map(playersStore.players.map(p => [p.name, p]));
            const winnerPlayer = playersMap.get(winner.name);
            const loserPlayer = playersMap.get(loser.name);
            winnerPlayer.points += 1;
            winnerPlayer.wins += 1;
            winnerPlayer.consecutiveWins += 1;

            const winLimit = settingsStore.settings.maxWins;

            if (winLimit !== 'unlimited' && winnerPlayer.consecutiveWins >= parseInt(winLimit, 10)) {
                queueStore.enqueue(winnerPlayer, 'win_limit');
                queueStore.enqueue(loserPlayer);
                this.getOpponent(boardIndex, null, null);
                return;
            }
            queueStore.enqueue(loserPlayer);
            this.getOpponent(boardIndex, winnerPlayer, this.shouldWinnerPlayWhite(whiteWon));
        },

        draw(boardIndex, whiteName, blackName) {
            const queueStore = useQueueStore();
            const settingsStore = useSettingsStore();
            const playersStore = usePlayersStore();

            const playersMap = new Map(playersStore.players.map(p => [p.name, p]));
            const whitePlayer = playersMap.get(whiteName);
            const blackPlayer = playersMap.get(blackName);
            whitePlayer.points += 0.5;
            blackPlayer.points += 0.5;

            switch (settingsStore.settings.drawScenario) {
                case 'bothOut':
                    queueStore.enqueue(blackPlayer, 'bothOutInDraw');
                    queueStore.enqueue(whitePlayer, 'bothOutInDraw');
                    this.getOpponent(boardIndex, null, null);
                    break;
                case 'whiteOut':
                    queueStore.enqueue(whitePlayer, 'whiteOutInDraw');
                    blackPlayer.consecutiveWins = 0;
                    this.getOpponent(boardIndex, blackPlayer, this.shouldWinnerPlayWhite(false));
                    break;
            }
        },

        shouldWinnerPlayWhite(whiteWon) {
            const winnerColorSetting = useSettingsStore().settings.winnerColor;
            const winnerColorRules = {
                alwaysWhite: true,
                alwaysBlack: false,
                repeat: whiteWon,
                changes: !whiteWon
            };
            return winnerColorRules[winnerColorSetting] ?? whiteWon;
        },

        getOpponent(boardIndex, winner, shouldWinnerPlayWhite) {
            const queueStore = useQueueStore();
            const tournamentStore = useTournamentStore();
            const playersStore = usePlayersStore();

            playersStore.players.sort((a, b) => b.points - a.points || b.wins - a.wins);

            if (tournamentStore.timer <= 0) {
                this.deleteBoard(boardIndex);
                if (this.activeGames.length === 0) {
                    tournamentStore.endTournament();
                }
                return;
            }

            if (!winner) {
                if (this.shouldRemoveBoardDueToBalance(boardIndex)) {
                    return;
                }
                this.pair(boardIndex, queueStore.dequeue(boardIndex), queueStore.dequeue(boardIndex));
                return;
            }

            if (this.shouldRemoveBoardDueToBalance(boardIndex, winner)) {
                return;
            }

            if (shouldWinnerPlayWhite) {
                this.pair(boardIndex, winner, queueStore.dequeue(boardIndex));
                return;
            }
            this.pair(boardIndex, queueStore.dequeue(boardIndex), winner);
        },

        pair(board, white, black) {
            const historyStore = useHistoryStore();

            historyStore.addPairingEvent(board, white.name, black.name);
            white.status = 'playing';
            black.status = 'playing';
            this.activeGames[board] = {white, black};
        },

        addBoard() {
            const queueStore = useQueueStore();
            const historyStore = useHistoryStore();

            historyStore.saveState();
            const nextBoardIndex = this.activeGames.length;
            historyStore.addBoardEvent(nextBoardIndex);
            const white = queueStore.dequeue(nextBoardIndex);
            const black = queueStore.dequeue(nextBoardIndex);
            this.pair(nextBoardIndex, white, black);
        },

        removePlayerFromGame(player) {
            const queueStore = useQueueStore();

            const boardIndex = this.activeGames.findIndex(
                g => g.white.name === player.name || g.black.name === player.name
            );

            if (boardIndex === -1) return;

            const game = this.activeGames[boardIndex];
            const opponent = game.white.name === player.name ? game.black : game.white;
            if (!this.shouldRemoveBoardDueToBalance(boardIndex, opponent)) {
                const color = game.white.name === player.name ? 'white' : 'black';
                game[color] = queueStore.dequeue(boardIndex);
            }
        },

        deleteBoard(index) {
            const historyStore = useHistoryStore();

            historyStore.deleteBoardEvent(index);
            this.activeGames.splice(index, 1);
        },

        shouldRemoveBoardDueToBalance(boardIndex, opponent = null) {
            const queueStore = useQueueStore();
            const activePlayers = usePlayersStore().players.filter(p => p.status !== 'paused').length;
            const idealQueueSize = activePlayers - (Math.round(activePlayers / 3) * 2);
            const shouldRemoveBoard = queueStore.queue.length < idealQueueSize && this.activeGames.length > 1;
            if (shouldRemoveBoard) {
                if (opponent) {
                    queueStore.enqueueAtStart(opponent);
                }
                this.deleteBoard(boardIndex);
            }
            return shouldRemoveBoard;
        }
    }
});