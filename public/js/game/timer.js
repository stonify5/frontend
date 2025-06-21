class Timer {
    constructor() {
        this.currentTime = window.CONSTANTS.TIMEOUT_DURATION / 1000;
        this.isRunning = false;
        this.isMyTurn = false;
        this.interval = null;
        this.onTimeUp = null;
        this.onTick = null;
    }
    
    start(isMyTurn = true) {
        this.isMyTurn = isMyTurn;
        this.isRunning = true;
        this.currentTime = window.CONSTANTS.TIMEOUT_DURATION / 1000;
        
        if (this.interval) {
            clearInterval(this.interval);
        }
        
        this.interval = setInterval(() => {
            if (this.isMyTurn && this.isRunning) {
                this.currentTime--;
                
                if (this.onTick) {
                    this.onTick(this.currentTime);
                }
                
                if (this.currentTime <= 0) {
                    this.stop();
                    if (this.onTimeUp) {
                        this.onTimeUp();
                    }
                }
            } else {
                this.currentTime = window.CONSTANTS.TIMEOUT_DURATION / 1000;
            }
        }, 1000);
    }
    
    stop() {
        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    
    pause() {
        this.isRunning = false;
    }
    
    resume() {
        this.isRunning = true;
    }
    
    reset() {
        this.stop();
        this.currentTime = window.CONSTANTS.TIMEOUT_DURATION / 1000;
        this.isMyTurn = false;
    }
    
    switchTurn(isMyTurn) {
        this.isMyTurn = isMyTurn;
        if (isMyTurn) {
            this.currentTime = window.CONSTANTS.TIMEOUT_DURATION / 1000;
        }
    }
    
    getTimeString() {
        return window.Utils.formatTime(this.currentTime);
    }
    
    getRemainingTime() {
        return this.currentTime;
    }
    
    isTimeRunningOut() {
        return this.currentTime <= 10;
    }
}
