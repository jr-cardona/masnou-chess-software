import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        language: '',
        tournamentName: '',
        initialPairing: '',
        queueOrder: '',
        winnerStays: '',
        maxWins: '',
        drawRule: '',
        maxBoards: null
    }),
    actions: {
        setSettings(newSettings) {
            this.$patch(newSettings);
            localStorage.setItem('tournamentSettings', JSON.stringify(newSettings));
        },
        loadSettings() {
            const savedSettings = localStorage.getItem('tournamentSettings');
            if (savedSettings) {
                this.$patch(JSON.parse(savedSettings));
            }
        }
    }
});
