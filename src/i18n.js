import { createI18n } from 'vue-i18n';

const messages = {
    en: {
        tournamentSettings: "Tournament Settings",
        selectLanguage: "Step 1: Please select a language",
        generalSettings: "Step 2: Rules and General Settings",
        maxBoards: "# Boards",
        tournamentName: "Tournament Name",
        initialPairing: "Initial Pairing",
        initialQueueOrder: "Initial Queue Order",
        winnerColor: "Winner color pieces",
        maxWins: "Max Consecutive Wins Before Queue",
        drawScenario: "Draw Scenario",
        next: "Next",
        finish: "Finish",
        random: "Random",
        byELO: "By ELO",
        repeatsColor: "Repeats Color",
        changesColor: "Changes Color",
        chooses: "Winner chooses",
        unlimited: "Unlimited (until defeated)",
        whiteSitsOut: "White Sits Out",
        higherScoreSitsOut: "Higher Score Sits Out",
        bothSitOut: "Both Sit Out",
        back: "Back",
    },
    es: {
        tournamentSettings: "Configuraciones del torneo",
        selectLanguage: "Paso 1: Seleccionar idioma",
        generalSettings: "Paso 2: Reglas del torneo",
        maxBoards: "# Tableros",
        tournamentName: "Nombre del torneo",
        initialPairing: "Emparejamiento inicial",
        initialQueueOrder: "Orden de cola inicial",
        winnerColor: "Color de piezas del ganador",
        maxWins: "Máximas victorias consecutivas",
        drawScenario: "Escenario en caso de tablas",
        next: "Siguiente",
        finish: "Finalizar",
        random: "Aleatorio",
        byELO: "Por ELO",
        repeatsColor: "Repite color",
        changesColor: "Cambia color",
        chooses: "Ganador decide",
        unlimited: "Ilimitadas (hasta ser derrotado)",
        whiteSitsOut: "Blancas se retiran",
        higherScoreSitsOut: "Jugador con mayor puntuación se retira",
        bothSitOut: "Ambos se retiran",
        back: "Atrás",
    }
};

const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem('language') || 'en',
    fallbackLocale: 'en',
    messages
});

export default i18n;
