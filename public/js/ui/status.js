class Status {
  constructor() {
    this.statusEl = document.getElementById("gameStatus");
    this.init();
  }

  init() {
    this.show(window.I18n.t("game.connecting"));
  }

  show(message, type = "info") {
    if (this.statusEl) {
      this.statusEl.textContent = message;
      this.statusEl.className = `status-${type}`;
    }
  }

  showGameResult(resultCode) {
    const messages = {
      [window.CONSTANTS.GAME_STATUS.WIN]: {
        text: window.I18n.t("game.win"),
        type: "success",
      },
      [window.CONSTANTS.GAME_STATUS.LOSS]: {
        text: window.I18n.t("game.lose"),
        type: "error",
      },
      [window.CONSTANTS.GAME_STATUS.USER2_TIMEOUT]: {
        text: window.I18n.t("game.winTimeout"),
        type: "success",
      },
      [window.CONSTANTS.GAME_STATUS.USER1_TIMEOUT]: {
        text: window.I18n.t("game.loseTimeout"),
        type: "error",
      },
      [window.CONSTANTS.GAME_STATUS.ERROR_READING]: {
        text: window.I18n.t("game.winDisconnect"),
        type: "success",
      },
    };

    const result = messages[resultCode];
    if (result) {
      this.show(result.text, result.type);

      setTimeout(() => {
        if (window.StonifyApp.ui.modal) {
          window.StonifyApp.ui.modal.showAlert(
            window.I18n.t("game.gameEnd"),
            result.text,
            () => window.location.reload(),
            false // shouldReload를 false로 설정하여 콜백으로만 처리
          );
        }
      }, 1000);
    }
  }

  showTurnStatus(isMyTurn, timeRemaining = null) {
    if (isMyTurn) {
      let message = window.I18n.t("game.yourTurn");
      if (timeRemaining !== null) {
        message += ` (${window.Utils.formatTime(timeRemaining)})`;
      }
      this.show(message, timeRemaining <= 10 ? "warning" : "info");
    } else {
      this.show(window.I18n.t("game.opponentTurn"), "info");
    }
  }

  showPlayerColor(color) {
    const colorText =
      color === "black"
        ? window.I18n.t("game.black")
        : window.I18n.t("game.white");
    this.show(`${window.I18n.t("game.gameStart")} - ${colorText}`, "success");
  }

  hide() {
    if (this.statusEl) {
      this.statusEl.style.display = "none";
    }
  }

  showConnectionError() {
    this.show(window.I18n.t("error.connection"), "error");
  }

  showReconnecting() {
    this.show(window.I18n.t("error.reconnecting"), "warning");
  }
}
