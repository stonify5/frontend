class Player {
    constructor() {
        this.nickname = '';
        this.color = '';
        this.opponentNickname = '';
        this.opponentColor = '';
        this.isMyTurn = false;
        this.isGameActive = false;
    }
    
    setNickname(nickname) {
        this.nickname = nickname;
    }
    
    setColor(color) {
        this.color = color;
        this.opponentColor = color === 'black' ? 'white' : 'black';
        this.isMyTurn = color === 'black';
    }
    
    setOpponent(nickname) {
        this.opponentNickname = nickname;
    }
    
    setMyTurn(isMyTurn) {
        this.isMyTurn = isMyTurn;
    }
    
    setGameActive(active) {
        this.isGameActive = active;
    }
    
    makeMove(position) {
        if (!this.isMyTurn || !this.isGameActive) return false;
        
        window.StonifyApp.services.websocket.send(position.toString());
        this.isMyTurn = false;
        return true;
    }
    
    reset() {
        this.color = '';
        this.opponentNickname = '';
        this.opponentColor = '';
        this.isMyTurn = false;
        this.isGameActive = false;
    }
    
    getDisplayName() {
        return this.nickname || 'Player';
    }
    
    getOpponentDisplayName() {
        return this.opponentNickname || 'Opponent';
    }
    
    getColorText() {
        return this.color === 'black' ? window.I18n.t('game.black') : window.I18n.t('game.white');
    }
    
    getOpponentColorText() {
        return this.opponentColor === 'black' ? window.I18n.t('game.black') : window.I18n.t('game.white');
    }
    
    getVsText() {
        return `${this.getDisplayName()} ${window.I18n.t('game.vs')} ${this.getOpponentDisplayName()}`;
    }
}
