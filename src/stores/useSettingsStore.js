import {defineStore} from 'pinia';

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        settings: {
            language: 'en',
            tournamentName: '',
            maxBoards: '',
            initialPairing: 'random',
            queueOrder: 'random',
            winnerColor: 'chooses',
            maxWins: 'unlimited',
            drawScenario: 'whiteOut',
        },
        showModal: false,
    }),
    actions: {
        setSettings() {
            localStorage.setItem('tournament.settings', JSON.stringify(this.settings));
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
