class Modal {
  constructor() {
    this.currentModal = null;
    this.bindEvents();
  }

  show(id) {
    this.hide();
    const modal = document.getElementById(id);
    if (modal) {
      modal.style.display = "flex";
      this.currentModal = modal;
      this.focusFirstInput();
    }
  }

  hide() {
    if (this.currentModal) {
      this.currentModal.style.display = "none";
      this.currentModal = null;
    }
  }

  bindEvents() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.currentModal) {
        // 알럿 모달이 아닌 경우에만 ESC로 닫기
        if (!document.getElementById("alertModal")) {
          console.log("ESC pressed, hiding modal");
          this.hide();
        }
      }
    });

    document.addEventListener("click", (e) => {
      // 알럿 모달이 아닌 일반 모달의 배경 클릭 시에만 닫기
      if (
        e.target.classList.contains("modal") &&
        !e.target.classList.contains("alert-modal")
      ) {
        console.log("Modal background clicked, hiding modal");
        this.hide();
      }
    });
  }

  focusFirstInput() {
    if (this.currentModal) {
      const input = this.currentModal.querySelector(
        'input[type="text"], input[type="email"], textarea'
      );
      if (input) {
        setTimeout(() => input.focus(), 100);
      }
    }
  }

  showNicknameModal() {
    this.show("nicknameModal");
    this.setupNicknameModal();
  }

  setupNicknameModal() {
    const input = document.getElementById("nicknameInput");
    const button = document.getElementById("nicknameSubmit");

    if (input && button) {
      const stored = window.StonifyApp.services.storage.getNickname();
      if (stored) {
        input.value = stored;
      }

      const submit = () => {
        const nickname = input.value.trim();
        if (window.Utils.validateNickname(nickname)) {
          window.StonifyApp.services.storage.setNickname(nickname);
          window.StonifyApp.services.websocket.send(nickname);
          this.hide();
        } else {
          this.showError(window.I18n.t("nickname.required"));
        }
      };

      button.onclick = submit;
      input.onkeydown = (e) => {
        if (e.key === "Enter") submit();
      };
    }
  }

  showError(message) {
    const errorEl = document.createElement("div");
    errorEl.className = "error-message";
    errorEl.textContent = message;

    if (this.currentModal) {
      const existing = this.currentModal.querySelector(".error-message");
      if (existing) existing.remove();

      this.currentModal.querySelector(".modal-content").appendChild(errorEl);
      setTimeout(() => errorEl.remove(), 3000);
    }
  }

  showAlert(title, message, callback = null, shouldReload = false) {
    console.log("showAlert called with:", {
      title,
      message,
      hasCallback: !!callback,
      shouldReload,
    });

    // 기존 알럿 모달이 있으면 제거
    const existingAlert = document.getElementById("alertModal");
    if (existingAlert) {
      console.log("Removing existing alert modal");
      existingAlert.remove();
    }

    const alertHtml = `
            <div class="modal alert-modal" id="alertModal" style="display: flex;">
                <div class="modal-content">
                    <h2>${window.Utils.sanitizeHTML(title)}</h2>
                    <p style="margin-bottom: 1.5rem; color: var(--text-secondary);">${window.Utils.sanitizeHTML(
                      message
                    )}</p>
                    <button class="btn btn-primary" id="alertOk">OK</button>
                </div>
            </div>
        `;

    document.body.insertAdjacentHTML("beforeend", alertHtml);

    const modal = document.getElementById("alertModal");
    const okBtn = document.getElementById("alertOk");

    // 알럿 모달은 배경 클릭이나 ESC로 닫히지 않도록 이벤트 차단
    modal.addEventListener("click", (e) => {
      // 모달 자체를 클릭했을 때만 차단하고, 내부 콘텐츠는 통과
      if (e.target === modal) {
        console.log("Alert modal background clicked - blocked");
        e.stopPropagation();
        e.preventDefault();
      }
    });

    // 모달 콘텐츠 클릭시에도 이벤트 버블링 차단
    const modalContent = modal.querySelector(".modal-content");
    modalContent.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // OK 버튼 클릭 시 동작
    okBtn.onclick = () => {
      console.log("Alert OK button clicked");
      modal.remove();
      if (callback) {
        console.log("Executing callback function");
        callback();
      } else if (shouldReload) {
        console.log("Auto-reloading page");
        window.location.reload();
      } else {
        console.log("No action taken after modal close");
      }
    };

    // Enter 키로도 OK 버튼 동작 (키 이벤트 핸들러 함수)
    const alertKeyHandler = (e) => {
      if (e.key === "Enter" && e.target.closest("#alertModal")) {
        console.log("Enter key pressed in alert modal");
        e.preventDefault();
        e.stopPropagation();
        okBtn.click();
      }
      // ESC 키 차단
      if (e.key === "Escape" && document.getElementById("alertModal")) {
        console.log("ESC key pressed in alert modal - blocked");
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // 모달에만 키 이벤트 적용
    modal.addEventListener("keydown", alertKeyHandler);

    // 모달이 제거될 때 이벤트 리스너도 제거
    const originalRemove = modal.remove.bind(modal);
    modal.remove = function () {
      modal.removeEventListener("keydown", alertKeyHandler);
      originalRemove();
    };

    setTimeout(() => okBtn.focus(), 100);
  }
}
