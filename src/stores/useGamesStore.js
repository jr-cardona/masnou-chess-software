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
        processResult(board, winner, loser) {
            const historyStore = useHistoryStore();

            historyStore.saveState();
            const whiteName = this.activeGames[board].white.name;
            const blackName = this.activeGames[board].black.name;

            if (winner === null && loser === null) {
                historyStore.addMatchResultEvent(board, whiteName, blackName, '½-½');
                return this.draw(board, whiteName, blackName);
            }

            let whiteWon = false;
            if (winner.name === whiteName) {
                whiteWon = true;
            }
            const result = whiteWon ? '1 - 0' : '0 - 1';
            historyStore.addMatchResultEvent(board, whiteName, blackName, result);
            this.handleWin(board, winner, loser, whiteWon);
        },

        handleWin(board, winner, loser, whiteWon) {
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
                this.getOpponent(board, null, null);
                return;
            }
            queueStore.enqueue(loserPlayer);
            this.getOpponent(board, winnerPlayer, this.shouldWinnerPlayWhite(whiteWon));
        },

        draw(board, whiteName, blackName) {
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
                    this.getOpponent(board, null, null);
                    break;
                case 'whiteOut':
                    queueStore.enqueue(whitePlayer, 'whiteOutInDraw');
                    blackPlayer.consecutiveWins = 0;
                    this.getOpponent(board, blackPlayer, this.shouldWinnerPlayWhite(false));
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

        getOpponent(board, winner, shouldWinnerPlayWhite) {
            const queueStore = useQueueStore();
            const tournamentStore = useTournamentStore();
            const playersStore = usePlayersStore();

            playersStore.players.sort((a, b) => b.points - a.points || b.wins - a.wins);

            if (tournamentStore.timer <= 0) {
                this.deleteBoard(board);
                if (this.activeGames.length === 0) {
                    tournamentStore.endTournament();
                }
                return;
            }

            if (!winner) {
                if (this.shouldRemoveBoardDueToBalance()) {
                    this.deleteBoard(board);
                    return;
                }
                this.pair(board, queueStore.dequeue(board), queueStore.dequeue(board));
                return;
            }

            if (this.shouldRemoveBoardDueToBalance()) {
                queueStore.enqueueAtStart(winner);
                this.deleteBoard(board);
                return;
            }

            if (shouldWinnerPlayWhite) {
                this.pair(board, winner, queueStore.dequeue(board));
                return;
            }
            this.pair(board, queueStore.dequeue(board), winner);
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

        deleteBoard(index) {
            const historyStore = useHistoryStore();

            historyStore.deleteBoardEvent(index);
            this.activeGames.splice(index, 1);
        },

        shouldRemoveBoardDueToBalance() {
            const queueStore = useQueueStore();
            const activePlayers = usePlayersStore().players.filter(p => p.status !== 'paused').length;
            const idealQueueSize = activePlayers - (Math.round(activePlayers / 3) * 2);
            return queueStore.queue.length < idealQueueSize && this.activeGames.length > 1;
        }
    }
});