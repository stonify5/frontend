class Spectator {
  constructor() {
    this.currentRoom = null;
    this.userNamesEl = document.getElementById("userNames");
    this.nextButtonEl = document.getElementById("nextButton");
    this.init();
  }

  init() {
    this.showStatus(window.I18n.t("spectator.waiting"));
    this.bindEvents();
  }

  bindEvents() {
    if (this.nextButtonEl) {
      this.nextButtonEl.addEventListener("click", () => {
        this.requestNextRoom();
      });
    }

    window.StonifyApp.services.websocket.on("message", (data) => {
      this.handleMessage(data);
    });
  }

  handleMessage(data) {
    if (data.board) {
      this.updateBoard(data.board);
    }

    if (data.data !== undefined && data.color !== undefined) {
      this.handleMove(data.data, data.color);
    }

    if (data.user1 && data.user2) {
      this.updateUserNames(data.user1, data.user2);
    }

    if (data.message) {
      this.showStatus(data.message);
    }
  }

  updateBoard(boardArray) {
    const board = window.StonifyApp.game.board;
    if (board) {
      const cells = boardArray.map((stoneType) => {
        const color = window.CONSTANTS.STONE_COLORS[stoneType];
        return {
          state: color !== "",
          color: color,
        };
      });

      board.cells = cells;

      // 마지막에 놓인 돌 찾기 (가장 높은 인덱스의 돌)
      board.lastStonePosition = -1;
      for (let i = boardArray.length - 1; i >= 0; i--) {
        if (boardArray[i] !== 0) {
          board.lastStonePosition = i;
          break;
        }
      }

      board.draw();
    }
  }

  handleMove(position, stoneType) {
    const board = window.StonifyApp.game.board;
    const color = window.CONSTANTS.STONE_COLORS[stoneType];

    if (board && color) {
      board.placeStone(position, color);
      window.StonifyApp.services.audio.playStone();
    }
  }

  updateUserNames(user1, user2) {
    if (this.userNamesEl) {
      this.userNamesEl.textContent = `${user1} ${window.I18n.t(
        "game.vs"
      )} ${user2}`;
      this.userNamesEl.style.display = "block";
    }
  }

  showStatus(message) {
    if (this.userNamesEl) {
      this.userNamesEl.textContent = message;
      this.userNamesEl.style.display = "block";
    }
  }

  requestNextRoom() {
    window.StonifyApp.services.websocket.send("next");
    this.clearBoard();
    this.showStatus(window.I18n.t("spectator.waiting"));
  }

  clearBoard() {
    const board = window.StonifyApp.game.board;
    if (board) {
      board.reset();
    }
  }

  showNoGames() {
    this.showStatus(window.I18n.t("spectator.noGames"));
  }

  cleanup() {
    this.clearBoard();
    this.showStatus("");
  }
}
