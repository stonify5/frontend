class WebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = new Map();
    this.isConnecting = false;
    this.currentPath = "";
    this.gameEnded = false; // 게임 종료 상태 추적
  }

  connect(path) {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN))
      return;

    this.isConnecting = true;
    this.currentPath = path;
    const wsUrl = window.AppConfig.getWebSocketUrl(path);

    console.log(`WebSocket connecting: ${wsUrl}`);

    try {
      this.ws = new WebSocket(wsUrl);
      this.setupEventListeners();
    } catch (error) {
      console.error("WebSocket connection failed:", error);
      this.handleConnectionFailure();
    }
  }

  setupEventListeners() {
    this.ws.onopen = (event) => {
      console.log("WebSocket connected");
      this.isConnecting = false;
      this.emit("connected", event);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "ping") {
          this.send("pong");
          return;
        }

        // 게임 종료 메시지 감지
        if (
          data.type === "gameResult" ||
          data.type === "game_end" ||
          (data.result &&
            (data.result === "win" ||
              data.result === "lose" ||
              data.result === "draw"))
        ) {
          console.log("Game end message detected:", data);
          this.gameEnded = true;
        }

        this.emit("message", data);
      } catch (error) {
        console.error("Message parse error:", error);
      }
    };

    this.ws.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
      console.log("Game ended state:", this.gameEnded);
      this.isConnecting = false;
      this.emit("disconnected", event);

      // 게임이 종료된 상태가 아니고 연결이 끊어진 경우에만 재연결 모달 표시
      if (event.code !== 1000 && !this.gameEnded) {
        console.log(
          "Connection lost (not game end), showing reconnection modal..."
        );
        console.log("WebSocket close event details:", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        });
        this.showReconnectionModal();
      } else if (this.gameEnded) {
        console.log(
          "WebSocket closed due to game end, no reconnection modal needed"
        );
      }
    };

    this.ws.onerror = (event) => {
      console.error("WebSocket error:", event);
      this.emit("error", event);
      this.handleConnectionFailure();
    };
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      if (typeof data === "object") {
        this.ws.send(JSON.stringify(data));
      } else {
        this.ws.send(data);
      }
    }
  }

  handleConnectionFailure() {
    this.isConnecting = false;
    console.log("Connection failed, showing reconnection modal...");
    this.showReconnectionModal();
  }

  showReconnectionModal() {
    console.log("showReconnectionModal called");
    // Modal 클래스가 있는지 확인
    if (
      window.StonifyApp &&
      window.StonifyApp.ui &&
      window.StonifyApp.ui.modal
    ) {
      console.log("Modal service found, showing alert modal");
      const title = window.I18n
        ? window.I18n.t("error.connection")
        : "Connection Lost";
      const message = window.I18n
        ? window.I18n.t("error.reloading")
        : "Connection to server lost. Click OK to reload page.";
      // 새로고침을 위한 콜백과 함께 showAlert 호출
      window.StonifyApp.ui.modal.showAlert(
        title,
        message,
        () => {
          console.log("Alert modal OK button clicked, reloading...");
          window.location.reload();
        },
        false
      );
    } else {
      console.log("Modal service not found, using browser confirm");
      // Modal이 없는 경우 기본 alert 사용
      const message = "Connection to server lost. Click OK to reload page.";
      if (confirm(message)) {
        console.log("Browser confirm OK clicked, reloading...");
        window.location.reload();
      }
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, "User disconnect");
      this.ws = null;
    }
    this.gameEnded = false; // 게임 상태 리셋
  }

  resetGameState() {
    this.gameEnded = false;
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Event ${event} handler error:`, error);
        }
      });
    }
  }
}
