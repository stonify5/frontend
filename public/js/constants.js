window.CONSTANTS = {
  BOARD_SIZE: 15,
  TOTAL_CELLS: 225,
  WINNING_COUNT: 5,
  TIMEOUT_DURATION: 60000,
  // RECONNECT_INTERVAL: 5000,        // 더 이상 사용하지 않음 - 새로고침으로 대체
  // MAX_RECONNECT_ATTEMPTS: 5,       // 더 이상 사용하지 않음 - 새로고침으로 대체
  MAX_NICKNAME_LENGTH: 10,

  COLORS: {
    BLACK: "black",
    WHITE: "white",
    EMPTY: "",
  },

  STONE_COLORS: {
    0: "",
    1: "black",
    2: "white",
  },

  GAME_STATUS: {
    WIN: 0,
    LOSS: 1,
    USER2_TIMEOUT: 2,
    USER1_TIMEOUT: 3,
    ERROR_READING: 4,
  },

  MESSAGES: {
    CONNECTING: "서버 연결중",
    WAITING: "유저 매칭중",
    GAME_START: "게임 시작",
    YOUR_TURN: "당신의 차례입니다",
    OPPONENT_TURN: "상대방의 차례입니다",
    DISCONNECTED: "서버와 연결이 끊어졌습니다",
  },

  AUDIO_FILES: {
    STONE: "/assets/sounds/stone.mp3",
    ENTER: "/assets/sounds/enter.mp3",
  },
};
