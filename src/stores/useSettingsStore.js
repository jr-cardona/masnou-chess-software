import {defineStore} from 'pinia';
import {useTournamentStore} from './useTournamentStore';

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        settings: {
            tournamentName: '',
            maxBoards: '',
            winnerColor: 'changes',
            maxWins: 'unlimited',
            drawScenario: 'whiteOut',
            hours: 0,
            minutes: 0,
        },
        showModal: false,
    }),
    actions: {
        setSettings() {
            const tournamentStore = useTournamentStore();
            if (tournamentStore.status === 'idle') {
                tournamentStore.setTimer(this.calculateSeconds());
            }
            localStorage.setItem('tournament.settings', JSON.stringify(this.settings));
            this.showModal = false;
        },

        loadSettings() {
            const tournamentStore = useTournamentStore();
            const savedSettings = JSON.parse(localStorage.getItem('tournament.settings'));
            if (savedSettings) {
                this.settings = {...this.settings, ...savedSettings};
                tournamentStore.setTimer(this.calculateSeconds());
            }
        },

        resetSettings() {
            this.$reset();
            this.showModal = true;
            localStorage.removeItem('tournament.settings');
        },

        calculateSeconds() {
            return (this.settings.hours * 3600) + (this.settings.minutes * 60);
        }
    },
});
