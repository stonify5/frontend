class Header {
    constructor() {
        this.userCountEl = document.getElementById('userCount');
        this.opponentInfoEl = document.getElementById('opponentInfo');
        this.languageSelectorEl = document.getElementById('languageSelector');
        this.lastUserCount = 0;
        this.init();
    }
    
    init() {
        this.updateUserCount(0);
        this.updateOpponentInfo('');
        this.bindEvents();
    }
    
    updateUserCount(count) {
        this.lastUserCount = count;
        if (this.userCountEl) {
            this.userCountEl.textContent = window.I18n.t('ui.userCount', { count: count });
        }
    }
    
    updateOpponentInfo(info) {
        if (this.opponentInfoEl) {
            this.opponentInfoEl.textContent = info;
            this.opponentInfoEl.style.display = info ? 'block' : 'none';
        }
    }
    
    bindEvents() {
        window.addEventListener('languageChanged', () => {
            this.updateUserCount(this.lastUserCount);
        });
    }
    
    setOpponentNickname(nickname) {
        const player = window.StonifyApp.game.player;
        if (player && player.nickname) {
            const vsText = `${player.nickname} ${window.I18n.t('game.vs')} ${nickname}`;
            this.updateOpponentInfo(vsText);
        }
    }
    
    setGameInfo(playerColor, opponentNickname) {
        const colorText = playerColor === 'black' ? 
            window.I18n.t('game.black') : 
            window.I18n.t('game.white');
        
        const player = window.StonifyApp.game.player;
        if (player && player.nickname) {
            const info = `${player.nickname} (${colorText}) ${window.I18n.t('game.vs')} ${opponentNickname}`;
            this.updateOpponentInfo(info);
        }
    }
    
    clearGameInfo() {
        this.updateOpponentInfo('');
    }
    
    showConnectionStatus(status) {
        if (this.userCountEl) {
            const statusMessages = {
                connecting: window.I18n.t('game.connecting'),
                waiting: window.I18n.t('game.waiting'),
                connected: window.I18n.t('ui.userCount', { count: this.lastUserCount })
            };
            
            const statusText = statusMessages[status];
            if (statusText) {
                this.userCountEl.textContent = statusText;
            }
        }
    }
}
