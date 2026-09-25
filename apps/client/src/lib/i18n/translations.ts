export type Locale = "en" | "pt-BR";

export const SUPPORTED_LOCALES: Locale[] = ["en", "pt-BR"];
export const DEFAULT_LOCALE: Locale = "en";

export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}

/**
 * UI copy dictionaries. English is the source of truth: values here are the
 * exact strings that used to be hardcoded in the components, so existing
 * behavior (and existing tests, which assert on the English text) does not
 * change for locale "en". "pt-BR" mirrors the same key shape.
 */
const en: TranslationDictionary = {
  common: {
    bombPill: "One comeback bomb at down {deficit}+",
    classicDuelBoard: "Classic duel board",
    twoPlayersBadge: "2 players",
    sharedField: "Shared 16x16 field",
    firstTo26: "First to 26 mines",
    backToLobby: "Back To Lobby",
    connected: "Connected",
    disconnected: "Disconnected",
    connecting: "Connecting",
    you: "You",
    opponent: "Opponent",
    online: "online",
    offline: "offline",
    blueLabel: "BLUE",
    redLabel: "RED",
    roomLabel: "Room {roomCode}",
    captainSweeper: "Captain Sweeper",
    displayNameLabel: "Display name",
    displayNamePlaceholder: "Enter your display name"
  },
  roomLobby: {
    eyebrow: "MSN-style competitive minesweeper",
    title: "Minesweeper Flags",
    description:
      "Pick hidden squares on a shared 16x16 field. Mines are claimed for points, safe squares reveal clues, and the first player to 26 flags wins.",
    getReady: "Get Ready",
    hostDirectMatch: "Host Direct Match",
    hostDirectMatchDesc: "Create a browser-to-browser match and share one direct link.",
    joinDirectMatch: "Join Direct Match",
    joinDirectMatchDesc: "Open the host's shared link to load the direct match automatically.",
    guestJoinCopy: "Guests join from the host's direct link. Open that shared link in this browser to connect.",
    createAMatch: "Create a Match",
    slotsCount: "{active}/{max} rooms",
    refreshSlotCount: "Refresh slot count",
    allSlotsInUse: "All room slots are in use.",
    hostRoomShare: "Host a room and share a private invite link.",
    createRoom: "Create Room",
    joinByToken: "Join by Token",
    joinByTokenDesc: "Paste the invite token from another player.",
    inviteTokenLabel: "Invite token",
    pasteInviteToken: "Paste invite token",
    joinMatch: "Join Match",
    noAccountNeeded: "No account needed. Open two tabs or invite a friend.",
    directMatchesStayInBrowser:
      "Direct matches stay in the browser. Hosts share one link and guests join from that link.",
    pasteInviteTokenToUnlock: "Paste an invite token to unlock Join Match.",
    inviteLooksValid: "Invite looks valid. Press Join Match."
  },
  lobbyPreview: {
    flagsCount: "{count} flags"
  },
  player: {
    flags: "Flags",
    bomb: "Bomb",
    ready: "Ready",
    used: "Used",
    status: "Status"
  },
  chat: {
    sending: "Sending...",
    chatOffline: "Chat offline. You can keep typing.",
    pressEnterToSend: "Press Enter to send.",
    messenger: "Messenger",
    typeMessage: "Type a message...",
    send: "Send",
    noMessagesYet: "No messages yet.",
    startConversation: "Start the conversation."
  },
  match: {
    youRole: "YOU",
    opponentRole: "OPPONENT",
    bombArmedPickCenterAria: "Bomb armed. Pick the center of a 5x5 blast.",
    bombReadyClickToArmAria: "Bomb ready. Click to arm a 5x5 blast.",
    opponentBombStatus: "Opponent bomb status.",
    yourBombSpent: "Your bomb is spent.",
    opponentBombSpent: "Opponent bomb is spent.",
    bombUnusedTrailing: "Bomb unused. It becomes available while trailing by {deficit} or more on your turn.",
    bombReadyClickToArmTitle: "Bomb ready: click to arm a 5x5 blast.",
    bombOneUseTitle: "Bomb: one use only, and only while trailing by {deficit} or more.",
    winner: "Winner",
    defeated: "Defeated",
    draw: "Draw",
    bombArmedPickCenterShort: "Bomb armed.\nPick center.",
    yourTurnBombReady: "It's your turn!\nBomb ready.",
    yourTurnBombUnlocksAt: "It's your turn!\nBomb unlocks at down {deficit}.",
    yourTurnMakeMove: "It's your turn!\nMake a move.",
    waitYourTurn: "Wait your turn.",
    playerIsMoving: "{name} is moving.",
    playerIsWaiting: "{name} is waiting.",
    matchOver: "MATCH OVER",
    moveLabel: "{tone} MOVE",
    resign: "RESIGN",
    resignConfirm: "Resign this match?",
    waitingForSecondPlayer: "Waiting for the second player to join chat.",
    opponentStatusLine: "{name} is {status}."
  },
  rematch: {
    waitingForOtherPlayer: "Waiting for the other player to confirm the rematch.",
    otherPlayerRequested: "The other player requested a rematch. Confirm to start the next round.",
    readyToQueue: "Ready to queue another round in the same room?",
    cancelRematch: "Cancel Rematch",
    acceptRematch: "Accept Rematch",
    requestRematch: "Request Rematch",
    matchOver: "Match over.",
    matchTied: "Match tied."
  },
  board: {
    cellTitle: "Row {row}, Column {column}",
    opponentLastMoveCellTitle: "Row {row}, Column {column} — opponent's last move"
  },
  room: {
    starting: "Starting",
    creatingDirectLink: "Creating Direct Link",
    waitingForGuest: "Waiting For Guest",
    connectingToGuest: "Connecting To Guest",
    connecting: "Connecting",
    setupFailed: "Setup Failed",
    closed: "Closed",
    directMatchReady: "Direct Match Ready",
    directMatchFailed: "Direct Match Failed",
    directMatchClosed: "Direct Match Closed",
    preparingDirectMatch: "Preparing Direct Match",
    expiredLinkSummary: "This direct link expired before setup finished. Start a new direct match from the lobby.",
    creatingDirectLinkNow: "Creating your direct link now.",
    waitingForGuestToOpen: "Waiting for a guest to open the direct link.",
    guestFoundFinishing: "Guest found. Finishing the browser-to-browser connection.",
    guestConnectedLoading: "Guest connected. Loading the match.",
    setupFailedStart: "Direct match setup failed. Start a new one from the lobby.",
    matchClosedStart: "This direct match closed. Start a new one from the lobby.",
    preparingYourDirectMatch: "Preparing your direct match.",
    expiredCannotRecover:
      "Expired setup links cannot be recovered. Live direct matches use separate reconnect recovery after both players connect.",
    guestJoinedApplying: "A guest joined. The app is applying the connection automatically.",
    setupFinalizedWaiting: "Setup is finalized. Waiting for the direct channel to finish opening.",
    roomMatchChatContinue:
      "Room, match, chat, and rematch continue through the normal game client flow once the channel opens.",
    useLobbyFreshLink: "Use the lobby to create a fresh direct link if you still want to play.",
    keepTabOpenGuestOpens: "Keep this tab open while your guest opens the shared link and joins from their browser.",
    roomUnavailable: "Room unavailable",
    notAttachedPrefix: "This browser is not currently attached to room ",
    notAttachedSuffix: ".",
    anotherTabClaimed:
      "Another tab has claimed control. Close other tabs for this room, or reconnect to reclaim control.",
    recoveryDataCleared: "Recovery data was cleared. You can start a fresh direct match from the lobby.",
    p2pReconnecting: "Direct Match is reconnecting. If recovery does not finish, start a new match from the lobby.",
    createOrJoinFirst: "Create or join the room from the home page first.",
    reconnectButton: "Reconnect",
    goToLobby: "Go To Lobby",
    directBrowserMatch: "Direct browser match",
    shareOneLinkDesc: "Share one direct link with your guest. The app finishes setup automatically as soon as they join.",
    browserToBrowser: "Browser to browser",
    automatedSignaling: "Automated signaling",
    hostSetup: "Host Setup",
    setupStatus: "Setup status",
    roomReference: "Room reference",
    keepTabOpenOwnsAuthority:
      "Keep this tab open. Live direct matches now recover after refresh, but this host tab still owns the match authority.",
    shareDirectLink: "Share Direct Link",
    sendOneShortLink: "Send one short link to your guest.",
    directJoinLink: "Direct join link",
    copyDirectLink: "Copy Direct Link",
    guestOnlyNeedsLink: "Your guest only needs this link plus a display name to join.",
    creatingShareableLinkNow: "Creating the shareable direct link now.",
    signalingSession: "Signaling session",
    startingLower: "starting",
    directLinkCopiedNotice: "Direct link copied.",
    roomIsReadyPrefix: "Room ",
    roomIsReadySuffix: " is ready. Share the private invite link and the match will begin as soon as player two joins.",
    roomReady: "Room Ready",
    shareThisRoom: "Share This Room",
    copyPrivateInvite: "Copy the private invite link. It already includes the token.",
    copyInviteLink: "Copy Invite Link",
    inviteLinkUnavailable: "Invite Link Unavailable",
    copyInviteTokenTitle: "Copy Invite Token",
    guestConnectedLabel: "Guest connected.",
    manualFallback: "Manual fallback.",
    unavailable: "Unavailable",
    inviteTokenUnavailable: "Invite Token Unavailable",
    waitingForPlayerTwo: "Waiting for player two.",
    inviteLinkUnavailableDevice: "Invite link unavailable on this device.",
    hostLine: "Host: {name}.",
    guestJoinedAs: "Guest joined as {name}.",
    guestSlotOpen: "Guest slot is open.",
    inviteLinkCopiedNotice: "Invite link copied.",
    inviteTokenCopiedNotice: "Invite token copied.",
    copyFailedManual: "Copy failed. Copy it manually from the screen."
  },
  invite: {
    privateInvite: "Private invite",
    matchAlreadyClaimed: "Match already claimed",
    inviteUnavailable: "Invite unavailable",
    anotherPlayerFilled:
      "Another player already filled this room. Ask the host for a fresh room if you still want to play.",
    privateInviteExpired: "This private invite link has expired or is no longer valid.",
    inviteMalformed: "This invite link is malformed or incomplete.",
    inviteLinksOnlyPath:
      "Invite links are the only public join path now. Room codes are shown only after you enter the room.",
    privateRoomInvitation: "Private room invitation",
    joinMinesweeperFlags: "Join Minesweeper Flags",
    inviteLinkLoaded: "Invite link loaded",
    guestSeat: "Guest seat",
    someoneSharedMatch:
      "Someone shared a private match with you. Pick a display name and claim the open guest seat with this invite link.",
    incomingMatch: "Incoming match",
    privateInviteLinkPill: "Private invite link",
    joinThisRoom: "Join This Room",
    accessModel: "Access model",
    tokenBasedInvite: "Token-based invite",
    joinGame: "Join Game",
    linkIsCredential: "This link is the room's join credential.",
    matchStartsAsSoon:
      "The match starts as soon as both players are connected. Room codes are shown after entry as a reference, not as a public join key.",
    privateInviteLoaded: "A private invite link is loaded for this tab.",
    pickDisplayNameJoinGame: "Pick a display name to unlock Join Game.",
    readyToJoinPressJoinGame: "Ready to join. Press Join Game."
  }
};

const ptBR: TranslationDictionary = {
  common: {
    bombPill: "Uma bomba de recuperação com {deficit}+ de desvantagem",
    classicDuelBoard: "Tabuleiro clássico de duplas",
    twoPlayersBadge: "2 jogadores",
    sharedField: "Campo compartilhado 16x16",
    firstTo26: "Primeiro a 26 minas",
    backToLobby: "Voltar Ao Lobby",
    connected: "Conectado",
    disconnected: "Desconectado",
    connecting: "Conectando",
    you: "Você",
    opponent: "Adversário",
    online: "online",
    offline: "offline",
    blueLabel: "AZUL",
    redLabel: "VERMELHO",
    roomLabel: "Sala {roomCode}",
    captainSweeper: "Capitão Minador",
    displayNameLabel: "Nome de exibição",
    displayNamePlaceholder: "Digite seu nome de exibição"
  },
  roomLobby: {
    eyebrow: "Campo minado competitivo estilo MSN",
    title: "Minesweeper Flags",
    description:
      "Marque quadrados escondidos em um campo compartilhado 16x16. Minas marcadas valem pontos, quadrados seguros revelam pistas, e o primeiro jogador a marcar 26 bandeiras vence.",
    getReady: "Prepare-se",
    hostDirectMatch: "Hospedar Partida Direta",
    hostDirectMatchDesc: "Crie uma partida navegador a navegador e compartilhe um único link direto.",
    joinDirectMatch: "Entrar em Partida Direta",
    joinDirectMatchDesc: "Abra o link compartilhado pelo anfitrião para carregar a partida direta automaticamente.",
    guestJoinCopy: "Convidados entram pelo link direto do anfitrião. Abra esse link neste navegador para conectar.",
    createAMatch: "Criar uma Partida",
    slotsCount: "{active}/{max} salas",
    refreshSlotCount: "Atualizar contagem de vagas",
    allSlotsInUse: "Todas as vagas de sala estão em uso.",
    hostRoomShare: "Crie uma sala e compartilhe um link de convite privado.",
    createRoom: "Criar Sala",
    joinByToken: "Entrar com Token",
    joinByTokenDesc: "Cole o token de convite de outro jogador.",
    inviteTokenLabel: "Token de convite",
    pasteInviteToken: "Cole o token de convite",
    joinMatch: "Entrar na Partida",
    noAccountNeeded: "Não precisa de conta. Abra duas abas ou convide um amigo.",
    directMatchesStayInBrowser:
      "Partidas diretas ficam no navegador. Anfitriões compartilham um link e convidados entram por esse link.",
    pasteInviteTokenToUnlock: "Cole um token de convite para liberar Entrar na Partida.",
    inviteLooksValid: "Convite parece válido. Aperte Entrar na Partida."
  },
  lobbyPreview: {
    flagsCount: "{count} bandeiras"
  },
  player: {
    flags: "Bandeiras",
    bomb: "Bomba",
    ready: "Pronta",
    used: "Usada",
    status: "Status"
  },
  chat: {
    sending: "Enviando...",
    chatOffline: "Chat offline. Você ainda pode digitar.",
    pressEnterToSend: "Aperte Enter para enviar.",
    messenger: "Mensageiro",
    typeMessage: "Digite uma mensagem...",
    send: "Enviar",
    noMessagesYet: "Nenhuma mensagem ainda.",
    startConversation: "Comece a conversa."
  },
  match: {
    youRole: "VOCÊ",
    opponentRole: "ADVERSÁRIO",
    bombArmedPickCenterAria: "Bomba armada. Escolha o centro de uma explosão 5x5.",
    bombReadyClickToArmAria: "Bomba pronta. Clique para armar uma explosão 5x5.",
    opponentBombStatus: "Status da bomba do adversário.",
    yourBombSpent: "Sua bomba já foi usada.",
    opponentBombSpent: "A bomba do adversário já foi usada.",
    bombUnusedTrailing: "Bomba não usada. Ela fica disponível ao ficar {deficit}+ atrás no seu turno.",
    bombReadyClickToArmTitle: "Bomba pronta: clique para armar uma explosão 5x5.",
    bombOneUseTitle: "Bomba: uso único, apenas ao ficar {deficit}+ atrás.",
    winner: "Vencedor",
    defeated: "Derrotado",
    draw: "Empate",
    bombArmedPickCenterShort: "Bomba armada.\nEscolha o centro.",
    yourTurnBombReady: "É o seu turno!\nBomba pronta.",
    yourTurnBombUnlocksAt: "É o seu turno!\nBomba libera com {deficit} de desvantagem.",
    yourTurnMakeMove: "É o seu turno!\nFaça uma jogada.",
    waitYourTurn: "Aguarde seu turno.",
    playerIsMoving: "{name} está jogando.",
    playerIsWaiting: "{name} está aguardando.",
    matchOver: "PARTIDA ENCERRADA",
    moveLabel: "VEZ DO {tone}",
    resign: "DESISTIR",
    resignConfirm: "Desistir desta partida?",
    waitingForSecondPlayer: "Aguardando o segundo jogador entrar no chat.",
    opponentStatusLine: "{name} está {status}."
  },
  rematch: {
    waitingForOtherPlayer: "Aguardando o outro jogador confirmar a revanche.",
    otherPlayerRequested: "O outro jogador pediu uma revanche. Confirme para começar a próxima rodada.",
    readyToQueue: "Pronto para mais uma rodada na mesma sala?",
    cancelRematch: "Cancelar Revanche",
    acceptRematch: "Aceitar Revanche",
    requestRematch: "Pedir Revanche",
    matchOver: "Partida encerrada.",
    matchTied: "Partida empatada."
  },
  board: {
    cellTitle: "Linha {row}, Coluna {column}",
    opponentLastMoveCellTitle: "Linha {row}, Coluna {column} — última jogada do adversário"
  },
  room: {
    starting: "Iniciando",
    creatingDirectLink: "Criando Link Direto",
    waitingForGuest: "Aguardando Convidado",
    connectingToGuest: "Conectando ao Convidado",
    connecting: "Conectando",
    setupFailed: "Configuração Falhou",
    closed: "Encerrado",
    directMatchReady: "Partida Direta Pronta",
    directMatchFailed: "Partida Direta Falhou",
    directMatchClosed: "Partida Direta Encerrada",
    preparingDirectMatch: "Preparando Partida Direta",
    expiredLinkSummary: "Este link direto expirou antes da configuração terminar. Comece uma nova partida direta a partir do lobby.",
    creatingDirectLinkNow: "Criando seu link direto agora.",
    waitingForGuestToOpen: "Aguardando um convidado abrir o link direto.",
    guestFoundFinishing: "Convidado encontrado. Finalizando a conexão navegador a navegador.",
    guestConnectedLoading: "Convidado conectado. Carregando a partida.",
    setupFailedStart: "A configuração da partida direta falhou. Comece uma nova a partir do lobby.",
    matchClosedStart: "Esta partida direta foi encerrada. Comece uma nova a partir do lobby.",
    preparingYourDirectMatch: "Preparando sua partida direta.",
    expiredCannotRecover:
      "Links de configuração expirados não podem ser recuperados. Partidas diretas ao vivo usam uma recuperação de reconexão separada depois que os dois jogadores se conectam.",
    guestJoinedApplying: "Um convidado entrou. O app está aplicando a conexão automaticamente.",
    setupFinalizedWaiting: "Configuração finalizada. Aguardando o canal direto terminar de abrir.",
    roomMatchChatContinue:
      "Sala, partida, chat e revanche continuam pelo fluxo normal do cliente do jogo assim que o canal abrir.",
    useLobbyFreshLink: "Use o lobby para criar um novo link direto se ainda quiser jogar.",
    keepTabOpenGuestOpens: "Mantenha esta aba aberta enquanto seu convidado abre o link compartilhado e entra pelo navegador dele.",
    roomUnavailable: "Sala indisponível",
    notAttachedPrefix: "Este navegador não está conectado à sala ",
    notAttachedSuffix: " no momento.",
    anotherTabClaimed:
      "Outra aba assumiu o controle. Feche as outras abas desta sala, ou reconecte para retomar o controle.",
    recoveryDataCleared: "Os dados de recuperação foram apagados. Você pode começar uma nova partida direta a partir do lobby.",
    p2pReconnecting: "A Partida Direta está reconectando. Se a recuperação não terminar, comece uma nova partida a partir do lobby.",
    createOrJoinFirst: "Crie ou entre em uma sala pela página inicial primeiro.",
    reconnectButton: "Reconectar",
    goToLobby: "Ir Para o Lobby",
    directBrowserMatch: "Partida direta pelo navegador",
    shareOneLinkDesc: "Compartilhe um link direto com seu convidado. O app termina a configuração automaticamente assim que ele entrar.",
    browserToBrowser: "Navegador a navegador",
    automatedSignaling: "Sinalização automática",
    hostSetup: "Configuração do Anfitrião",
    setupStatus: "Status da configuração",
    roomReference: "Referência da sala",
    keepTabOpenOwnsAuthority:
      "Mantenha esta aba aberta. Partidas diretas ao vivo agora se recuperam após atualizar a página, mas esta aba de anfitrião ainda controla a partida.",
    shareDirectLink: "Compartilhar Link Direto",
    sendOneShortLink: "Envie um link curto ao seu convidado.",
    directJoinLink: "Link direto de entrada",
    copyDirectLink: "Copiar Link Direto",
    guestOnlyNeedsLink: "Seu convidado só precisa deste link e de um nome de exibição para entrar.",
    creatingShareableLinkNow: "Criando o link direto compartilhável agora.",
    signalingSession: "Sessão de sinalização",
    startingLower: "iniciando",
    directLinkCopiedNotice: "Link direto copiado.",
    roomIsReadyPrefix: "A sala ",
    roomIsReadySuffix: " está pronta. Compartilhe o link de convite privado e a partida começa assim que o segundo jogador entrar.",
    roomReady: "Sala Pronta",
    shareThisRoom: "Compartilhar Esta Sala",
    copyPrivateInvite: "Copie o link de convite privado. Ele já inclui o token.",
    copyInviteLink: "Copiar Link de Convite",
    inviteLinkUnavailable: "Link de Convite Indisponível",
    copyInviteTokenTitle: "Copiar Token de Convite",
    guestConnectedLabel: "Convidado conectado.",
    manualFallback: "Alternativa manual.",
    unavailable: "Indisponível",
    inviteTokenUnavailable: "Token de Convite Indisponível",
    waitingForPlayerTwo: "Aguardando o segundo jogador.",
    inviteLinkUnavailableDevice: "Link de convite indisponível neste dispositivo.",
    hostLine: "Anfitrião: {name}.",
    guestJoinedAs: "Convidado entrou como {name}.",
    guestSlotOpen: "Vaga de convidado disponível.",
    inviteLinkCopiedNotice: "Link de convite copiado.",
    inviteTokenCopiedNotice: "Token de convite copiado.",
    copyFailedManual: "Falha ao copiar. Copie manualmente da tela."
  },
  invite: {
    privateInvite: "Convite privado",
    matchAlreadyClaimed: "Partida já ocupada",
    inviteUnavailable: "Convite indisponível",
    anotherPlayerFilled:
      "Outro jogador já ocupou esta sala. Peça ao anfitrião uma sala nova se ainda quiser jogar.",
    privateInviteExpired: "Este link de convite privado expirou ou não é mais válido.",
    inviteMalformed: "Este link de convite está incompleto ou malformado.",
    inviteLinksOnlyPath:
      "Links de convite são agora o único caminho público de entrada. Os códigos de sala só aparecem depois que você entra na sala.",
    privateRoomInvitation: "Convite de sala privada",
    joinMinesweeperFlags: "Entrar no Minesweeper Flags",
    inviteLinkLoaded: "Link de convite carregado",
    guestSeat: "Vaga de convidado",
    someoneSharedMatch:
      "Alguém compartilhou uma partida privada com você. Escolha um nome de exibição e ocupe a vaga de convidado com este link de convite.",
    incomingMatch: "Partida recebida",
    privateInviteLinkPill: "Link de convite privado",
    joinThisRoom: "Entrar Nesta Sala",
    accessModel: "Modelo de acesso",
    tokenBasedInvite: "Convite baseado em token",
    joinGame: "Entrar no Jogo",
    linkIsCredential: "Este link é a credencial de entrada da sala.",
    matchStartsAsSoon:
      "A partida começa assim que os dois jogadores estiverem conectados. Os códigos de sala aparecem após a entrada apenas como referência, não como chave pública de entrada.",
    privateInviteLoaded: "Um link de convite privado está carregado nesta aba.",
    pickDisplayNameJoinGame: "Escolha um nome de exibição para liberar Entrar no Jogo.",
    readyToJoinPressJoinGame: "Pronto para entrar. Aperte Entrar no Jogo."
  }
};

export const translations: Record<Locale, TranslationDictionary> = {
  en,
  "pt-BR": ptBR
};

/**
 * Messages the server / realtime runtime sends as plain English strings
 * (see apps/server/src/modules/rooms/room.service.ts and
 * apps/client/src/app/providers/game-client.controller.ts). The client
 * matches on the exact English text in a few places (RoomPage.tsx,
 * InvitePage.tsx), so those comparisons must keep using the original
 * English string. This map only translates the text shown to the user,
 * never the value used for matching.
 */
export const serverMessageTranslations: Record<string, string> = {
  "That invite link is no longer valid.": "Esse link de convite não é mais válido.",
  "That room is already full.": "Essa sala já está cheia.",
  "Chat is reconnecting. Try again once the room reconnects.":
    "O chat está reconectando. Tente novamente assim que a sala reconectar.",
  "Connection lost. Reconnecting before your next action.":
    "Conexão perdida. Reconectando antes da sua próxima ação.",
  "No local session is stored for that room.": "Nenhuma sessão local salva para essa sala.",
  "Join a room before sending actions.": "Entre em uma sala antes de enviar ações.",
  "Join a room before chatting.": "Entre em uma sala antes de usar o chat.",
  "Type a message before sending.": "Digite uma mensagem antes de enviar.",
  "Chat could not be sent. Try again.": "Não foi possível enviar a mensagem. Tente novamente.",
  "This room is active in another tab or window. Use that tab, or reconnect here.":
    "Esta sala está ativa em outra aba ou janela. Use aquela aba, ou reconecte por aqui.",
  "The server sent an unreadable event.": "O servidor enviou um evento ilegível.",
  "Your saved room session is no longer valid. Join the room again.":
    "Sua sessão salva da sala não é mais válida. Entre na sala novamente.",
  "Transport is not connected.": "A conexão não está estabelecida."
};
