window.AppConfig = {
    BACKEND_URL: 'server.stonify5.com',
    BACKEND_WS_URL: 'wss://server.stonify5.com',
    isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    
    getWebSocketUrl(path) {
        const protocol = this.isDevelopment ? 'ws:' : 'wss:';
        const host = this.isDevelopment ? 'localhost:8080' : 'server.stonify5.com';
        return `${protocol}//${host}${path}`;
    },
    
    getApiUrl(path) {
        const protocol = this.isDevelopment ? 'http:' : 'https:';
        const host = this.isDevelopment ? 'localhost:8080' : 'server.stonify5.com';
        return `${protocol}//${host}${path}`;
    }
};
