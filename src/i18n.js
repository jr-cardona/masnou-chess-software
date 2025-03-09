import { createI18n } from 'vue-i18n';

const messages = {
    us: {
        areYouSure: "Are you sure?",
        thisWillEndTournament: "This action will end the tournament",
        confirm: "Yes, finish",
        cancel: "Cancel",
        tournamentFinished: "Tournament finished",
        active: "Active",
        addPlayer: "Add Player",
        addTestData: "Add test data",
        alwaysBlack: "Always black",
        alwaysWhite: "Always white",
        appearance: "Appearance",
        back: "Back",
        black: "Black",
        blackWins: "Black Wins",
        board: "Board|Boards",
        bothSitOut: "Both sit out",
        byELO: "By ELO",
        changesColor: "Changes color",
        chooses: "Winner Chooses",
        draw: "Draw",
        drawScenario: "Draw Scenario",
        enableBoard: "Enable new board",
        enterPlayerNames: "Enter player names (one per line)",
        finalRanking: "Final Ranking",
        finish: "Finish",
        game: "Game|Games",
        generalSettings: "Rules",
        higherScoreSitsOut: "Higher Score Sits Out",
        initialPairing: "Initial Pairing",
        initialQueueOrder: "Initial Queue Order",
        invalidTime: "Invalid tournament duration",
        language: "Language",
        maxBoards: "# Boards",
        maxWins: "Max Consecutive Wins Before Queue",
        minBoardsRequired: "Boards required must be at least 3",
        name: "Name|Names",
        next: "Next",
        noMatchesAvailable: "No matches available",
        noPlayersAvailable: "No players available",
        notEnoughPlayers: "Not enough players to start a tournament",
        optional: "Optional",
        pause: "Pause",
        paused: "Paused",
        pausePlayer: "Pause Player",
        player: "Player|Players",
        playerNameRequired: "Name is required",
        playerNameTooLong: "Player name too long",
        playing: "Playing",
        point: "Point|Points",
        position: "Position",
        queued: "Queued",
        queuePlayers: "Queue Players",
        random: "Random",
        randomPairing: "Random Pairing",
        removePlayer: "Remove player",
        repeatsColor: "Repeats color",
        reset: "Reset",
        resume: "Resume",
        resumePlayer: "Resume Player",
        save: "Save",
        scoreboard: "Scoreboard",
        selectLanguage: "Select a language",
        start: "Start",
        startInQueue: "Start in queue?",
        status: "Status",
        theme: "Theme",
        time: "Time",
        tournamentDuration: "Tournament Duration",
        tournamentInCourse: "Tournament in course",
        tournamentName: "Tournament Name",
        tournamentSettings: "Tournament Settings",
        unlimited: "Unlimited (until defeated)",
        white: "White",
        whiteSitsOut: "White sits out",
        whiteWins: "White Wins",
        winnerColor: "Winner Color Pieces",
        wins: "Wins",
        yes: "Yes",
    },
    es: {
        areYouSure: "¿Estás seguro?",
        thisWillEndTournament: "Esta acción finalizará el torneo",
        confirm: "Sí, finalizar",
        cancel: "Cancelar",
        tournamentFinished: "Torneo finalizado",
        active: "Activo",
        addPlayer: "Añadir jugador",
        addTestData: "Añadir datos de prueba",
        alwaysBlack: "Siempre negras",
        alwaysWhite: "Siempre blancas",
        appearance: "Apariencia",
        back: "Atrás",
        black: "Negras",
        blackWins: "Ganan negras",
        board: "Tablero|Tableros",
        bothSitOut: "Ambos se retiran",
        byELO: "Por ELO",
        changesColor: "Cambia de color",
        chooses: "Ganador decide",
        draw: "Tablas",
        drawScenario: "En caso de tablas, se retira(n):",
        enableBoard: "Habilitar nueva mesa",
        enterPlayerNames: "Ingresa nombres de jugadores (uno por línea)",
        finalRanking: "Clasificación final",
        finish: "Finalizar",
        game: "Partida|Partidas",
        generalSettings: "Ajustes",
        higherScoreSitsOut: "Jugador con mayor puntuación",
        initialPairing: "Emparejamiento inicial",
        initialQueueOrder: "Orden de cola inicial",
        invalidTime: "Duración del torneo inválida",
        language: "Idioma",
        maxBoards: "# Tableros",
        maxWins: "Máximas victorias consecutivas",
        minBoardsRequired: "Se requieren al menos 3 tableros",
        name: "Nombre|Nombres",
        next: "Siguiente",
        noMatchesAvailable: "No hay partidas disponibles",
        noPlayersAvailable: "No hay jugadores disponibles",
        notEnoughPlayers: "No hay suficientes jugadores para iniciar un torneo",
        optional: "Opcional",
        pause: "Pausar",
        paused: "Pausado",
        pausePlayer: "Pausar jugador",
        player: "Jugador|Jugadores",
        playerNameRequired: "El nombre es obligatorio",
        playerNameTooLong: "El nombre del jugador es demasiado largo",
        playing: "Jugando",
        point: "Punto|Puntos",
        position: "Posición",
        queued: "En cola",
        queuePlayers: "Jugadores en cola",
        random: "Aleatorio",
        randomPairing: "Emparejamiento aleatorio",
        removePlayer: "Eliminar jugador",
        repeatsColor: "Repite color",
        reset: "Restaurar",
        resume: "Reanudar",
        resumePlayer: "Reanudar jugador",
        save: "Guardar",
        scoreboard: "Tabla de puntuaciones",
        selectLanguage: "Seleccione un idioma",
        start: "Iniciar",
        startInQueue: "¿Empieza en cola?",
        status: "Estado",
        theme: "Tema",
        time: "Tiempo",
        tournamentDuration: "Duración del torneo",
        tournamentInCourse: "Torneo en curso",
        tournamentName: "Nombre del torneo",
        tournamentSettings: "Configuraciones del torneo",
        unlimited: "Ilimitado (hasta ser derrotado)",
        white: "Blancas",
        whiteSitsOut: "Blancas se retiran",
        whiteWins: "Ganan blancas",
        winnerColor: "Color de piezas del ganador",
        wins: "Victorias",
        yes: "Sí",
    },
    pt: {
        areYouSure: "Tem certeza?",
        thisWillEndTournament: "Esta ação finalizará o torneio",
        confirm: "Sim, finalizar",
        cancel: "Cancelar",
        tournamentFinished: "Torneio finalizado",
        active: "Ativo",
        addPlayer: "Adicionar jogador",
        addTestData: "Adicionar dados de teste",
        alwaysBlack: "Sempre negras",
        alwaysWhite: "Sempre brancas",
        appearance: "Aparência",
        back: "Voltar",
        black: "Pretas",
        blackWins: "Vitória das Pretas",
        board: "Tabuleiro|Tabuleiros",
        bothSitOut: "Ambos ficam de fora",
        byELO: "Por ELO",
        changesColor: "Muda de cor",
        chooses: "Vencedor escolhe",
        draw: "Empate",
        drawScenario: "Cenário de empate",
        enableBoard: "Ativar novo tabuleiro",
        enterPlayerNames: "Insira os nomes dos jogadores (um por linha)",
        finalRanking: "Classificação final",
        finish: "Finalizar",
        game: "Jogo|Jogos",
        generalSettings: "Configurações gerais",
        higherScoreSitsOut: "Pontuação mais alta fica de fora",
        initialPairing: "Emparelhamento inicial",
        initialQueueOrder: "Ordem inicial da fila",
        invalidTime: "A duração do torneio é inválida",
        language: "Idioma",
        maxBoards: "# Tabuleiros",
        maxWins: "Máximas vitórias consecutivas",
        minBoardsRequired: "Mínimo de 3 tabuleiros necessários",
        name: "Nome|Nomes",
        next: "Próximo",
        noMatchesAvailable: "Nenhum jogo disponível",
        noPlayersAvailable: "Nenhum jogador disponível",
        notEnoughPlayers: "Não há jogadores suficientes para iniciar um torneio",
        optional: "Opcional",
        pause: "Pausar",
        paused: "Pausado",
        pausePlayer: "Pausar jogador",
        player: "Jogador|Jogadores",
        playerNameRequired: "O nome é obrigatório",
        playerNameTooLong: "Nome do jogador muito longo",
        playing: "Jogando",
        point: "Ponto|Pontos",
        position: "Posição",
        queued: "Na fila",
        queuePlayers: "Jogadores na fila",
        random: "Aleatório",
        randomPairing: "Emparelhamento aleatório",
        removePlayer: "Remover jogador",
        repeatsColor: "Repete cor",
        reset: "Redefinir",
        resume: "Retomar",
        resumePlayer: "Retomar jogador",
        save: "Salvar",
        scoreboard: "Placar",
        selectLanguage: "Selecione um idioma",
        start: "Iniciar",
        startInQueue: "Começar na fila?",
        status: "Status",
        theme: "Tema",
        time: "Tempo",
        tournamentDuration: "Duração do torneio",
        tournamentInCourse: "Torneio em andamento",
        tournamentName: "Nome do torneio",
        tournamentSettings: "Configurações do torneio",
        unlimited: "Ilimitado (até ser derrotado)",
        white: "Brancas",
        whiteSitsOut: "Brancas ficam de fora",
        whiteWins: "Vitória das Brancas",
        winnerColor: "Cor das peças do vencedor",
        wins: "Vitórias",
        yes: "Sim",
    },
    cn: {
        areYouSure: "你确定吗？",
        thisWillEndTournament: "此操作将结束比赛",
        confirm: "是的，结束",
        cancel: "取消",
        tournamentFinished: "比赛已结束",
        active: "活跃",
        addPlayer: "添加玩家",
        addTestData: "添加测试数据",
        alwaysBlack: "始终执黑",
        alwaysWhite: "始终执白",
        appearance: "外观",
        back: "返回",
        black: "黑方",
        blackWins: "黑方胜",
        board: "棋盘",
        bothSitOut: "双方轮空",
        byELO: "按ELO",
        changesColor: "更换颜色",
        chooses: "胜者选择",
        draw: "和棋",
        drawScenario: "和棋情境",
        enableBoard: "启用新棋盘",
        enterPlayerNames: "输入玩家名称（每行一个）",
        finalRanking: "最终排名",
        finish: "结束",
        game: "对局",
        generalSettings: "常规设置",
        higherScoreSitsOut: "高分者轮空",
        initialPairing: "初始配对",
        initialQueueOrder: "初始队列顺序",
        invalidTime: "比赛时长无效",
        language: "语言",
        maxBoards: "棋盘数量",
        maxWins: "最多连胜",
        minBoardsRequired: "至少需要3个棋盘",
        name: "姓名",
        next: "下一个",
        noMatchesAvailable: "无比赛可用",
        noPlayersAvailable: "无玩家可用",
        notEnoughPlayers: "无足够玩家开始比赛",
        optional: "可选",
        pause: "暂停",
        paused: "已暂停",
        pausePlayer: "暂停玩家",
        player: "玩家",
        playerNameRequired: "姓名是必填项",
        playerNameTooLong: "玩家姓名过长",
        playing: "进行中",
        point: "分数",
        position: "位置",
        queued: "排队中",
        queuePlayers: "排队玩家",
        random: "随机",
        randomPairing: "随机配对",
        removePlayer: "移除玩家",
        repeatsColor: "重复颜色",
        reset: "重置",
        resume: "继续",
        resumePlayer: "继续玩家",
        save: "保存",
        scoreboard: "记分板",
        selectLanguage: "选择语言",
        start: "开始",
        startInQueue: "在队列中开始？",
        status: "状态",
        theme: "主题",
        time: "时间",
        tournamentDuration: "比赛时长",
        tournamentInCourse: "比赛进行中",
        tournamentName: "比赛名称",
        tournamentSettings: "比赛设置",
        unlimited: "无限制（直到失败）",
        white: "白方",
        whiteSitsOut: "白方轮空",
        whiteWins: "白方胜",
        winnerColor: "胜方颜色",
        wins: "胜利",
        yes: "是",
    },
};

const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem('language') || 'us',
    fallbackLocale: 'us',
    messages,
});

export default i18n;