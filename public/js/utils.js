window.Utils = {
    getRandomId() {
        return Math.random().toString(36).substr(2, 9);
    },
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
    isValidPosition(position) {
        return position >= 0 && position < window.CONSTANTS.TOTAL_CELLS;
    },
    
    positionToCoords(position) {
        return {
            x: position % window.CONSTANTS.BOARD_SIZE,
            y: Math.floor(position / window.CONSTANTS.BOARD_SIZE)
        };
    },
    
    coordsToPosition(x, y) {
        return y * window.CONSTANTS.BOARD_SIZE + x;
    },
    
    isValidCoords(x, y) {
        return x >= 0 && x < window.CONSTANTS.BOARD_SIZE && y >= 0 && y < window.CONSTANTS.BOARD_SIZE;
    },
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    validateNickname(nickname) {
        if (!nickname || nickname.trim().length === 0) return false;
        if (nickname.length > window.CONSTANTS.MAX_NICKNAME_LENGTH) return false;
        return true;
    },
    
    sanitizeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};
