import {defineStore} from 'pinia';
import {useTournamentStore} from './useTournamentStore';

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        settings: {
            tournamentName: '',
            maxBoards: '',
            initialPairing: 'random',
            queueOrder: 'random',
            winnerColor: 'changes',
            maxWins: 'unlimited',
            drawScenario: 'whiteOut',
            hours: 0,
            minutes: 0,
            seconds: 0,
        },
        showModal: true,
    }),
    actions: {
        setSettings(timer) {
            const tournamentStore = useTournamentStore();
            if (tournamentStore.status === 'idle') {
                localStorage.setItem('tournament.settings', JSON.stringify(this.settings));
                tournamentStore.timer = timer;
            }
            this.showModal = false;
        },
        loadSettings() {
            const savedSettings = JSON.parse(localStorage.getItem('tournament.settings'));
            if (savedSettings) {
                this.settings = {...this.settings, ...savedSettings};
            }
        },
        resetSettings() {
            this.$reset();
            localStorage.removeItem('tournament.settings');
        }
    },
});
