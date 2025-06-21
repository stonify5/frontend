window.StonifyApp = {
  services: {},
  game: {},
  ui: {},
  spectator: null,
  config: window.AppConfig,

  async init() {
    try {
      console.log("Stonify5 App initializing...");

      await window.I18n.init();
      this.initServices();
      this.initPage();
      this.setupGlobalEvents();

      console.log("Stonify5 App initialized");
    } catch (error) {
      console.error("App initialization failed:", error);
    }
  },

  initServices() {
    this.services.storage = new StorageService();
    this.services.audio = new AudioService();
    this.services.websocket = new WebSocketService();
  },

  initPage() {
    const page = document.body.dataset.page;

    switch (page) {
      case "game":
        this.initGamePage();
        break;
      case "spectator":
        this.initSpectatorPage();
        break;
      default:
        this.initHomePage();
    }
  },

  initGamePage() {
    this.ui.modal = new Modal();
    this.ui.header = new Header();
    this.ui.status = new Status();

    const canvas = document.getElementById("gameBoard");
    this.game.board = new GameBoard(canvas);
    this.game.player = new Player();
    this.game.timer = new Timer();
    this.game.victory = new Victory();

    this.connectGameEvents();
    this.checkNickname();
    this.services.websocket.connect("/game");
  },

  initSpectatorPage() {
    this.ui.header = new Header();

    const canvas = document.getElementById("gameBoard");
    this.game.board = new GameBoard(canvas);
    this.spectator = new Spectator();

    this.services.websocket.connect("/spectator");
  },

  initHomePage() {
    this.ui.header = new Header();
    console.log("Home page initialized");
  },

  checkNickname() {
    const stored = this.services.storage.getNickname();
    if (!stored || !window.Utils.validateNickname(stored)) {
      setTimeout(() => {
        this.ui.modal.showNicknameModal();
      }, 500);
    } else {
      this.game.player.setNickname(stored);
    }
  },

  connectGameEvents() {
    this.game.board.onCellClick = (position) => {
      if (this.game.player.isMyTurn && this.game.player.isGameActive) {
        if (this.game.board.placeStone(position, this.game.player.color)) {
          this.services.audio.playStone();
          this.game.player.makeMove(position);
        }
      }
    };

    this.services.websocket.on("connected", () => {
      this.ui.header.showConnectionStatus("connected");
      this.ui.status.show(window.I18n.t("game.waiting"));

      const nickname = this.services.storage.getNickname();
      if (nickname) {
        this.services.websocket.send(nickname);
        this.game.player.setNickname(nickname);
      } else {
        this.ui.modal.showNicknameModal();
      }
    });

    this.services.websocket.on("message", (data) => {
      this.handleGameMessage(data);
    });

    this.services.websocket.on("disconnected", () => {
      this.ui.status.showConnectionError();
      this.ui.header.showConnectionStatus("connecting");
    });

    this.services.websocket.on("error", () => {
      this.ui.status.showConnectionError();
    });

    this.game.timer.onTick = (timeRemaining) => {
      this.ui.status.showTurnStatus(this.game.player.isMyTurn, timeRemaining);
    };

    this.game.timer.onTimeUp = () => {
      this.ui.status.show(window.I18n.t("game.loseTimeout"), "error");
    };
  },

  handleGameMessage(data) {
    if (data.YourColor) {
      this.game.player.setColor(data.YourColor);
      this.game.player.setGameActive(true);
      this.ui.status.showPlayerColor(data.YourColor);
      this.services.audio.playEnter();

      if (data.Nickname) {
        this.game.player.setOpponent(data.Nickname);
        this.ui.header.setGameInfo(data.YourColor, data.Nickname);
      }

      this.game.timer.start(data.YourColor === "black");
    }

    if (data.data !== undefined) {
      const opponentColor = this.game.player.opponentColor;
      if (this.game.board.placeStone(data.data, opponentColor)) {
        this.services.audio.playStone();
        this.game.player.setMyTurn(true);
        this.game.timer.switchTurn(true);

        const result = this.game.victory.checkWin(
          this.game.board.cells,
          data.data,
          opponentColor
        );

        if (result.win) {
          this.game.victory.highlightWinningLine(this.game.board, result.line);
        }
      }
    }

    if (data.numUsers !== undefined) {
      this.ui.header.updateUserCount(data.numUsers);
    }

    if (data.nickname) {
      this.game.player.setOpponent(data.nickname);
      this.ui.header.setOpponentNickname(data.nickname);
    }

    if (data.message !== undefined) {
      // 게임 종료 상태를 WebSocket 서비스에 알림
      if (this.services.websocket) {
        this.services.websocket.gameEnded = true;
        console.log("Game ended, set websocket gameEnded = true");
      }

      this.ui.status.showGameResult(data.message);
      this.game.player.setGameActive(false);
      this.game.timer.stop();
    }
  },

  setupGlobalEvents() {
    window.addEventListener("languageChanged", (event) => {
      this.updateUILanguage(event.detail.locale);
    });

    window.addEventListener(
      "resize",
      window.Utils.debounce(() => {
        if (this.game.board) {
          this.game.board.resize();
        }
      }, 250)
    );

    window.addEventListener("beforeunload", () => {
      if (this.services.websocket) {
        this.services.websocket.disconnect();
      }
    });

    window.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (this.game.timer) {
          this.game.timer.pause();
        }
      } else {
        if (this.game.timer) {
          this.game.timer.resume();
        }
      }
    });
  },

  updateUILanguage(locale) {
    window.I18n.updateUI();

    if (this.ui.header) {
      this.ui.header.updateUserCount(this.ui.header.lastUserCount);
    }

    if (this.game.player && this.game.player.opponentNickname) {
      this.ui.header.setGameInfo(
        this.game.player.color,
        this.game.player.opponentNickname
      );
    }
  },
};
