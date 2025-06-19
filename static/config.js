// Configuration file for the frontend application
window.appConfig = {
  // Backend server configuration
  backend: {
    // For local development
    development: {
      host: "localhost:8080",
      protocol: "ws",
    },
    // For production deployment
    production: {
      host: "server.stonify5.com",
      protocol: "wss", // Use secure WebSocket in production
    },
  },

  // Determine environment
  getEnvironment: function () {
    // Check for local development environments
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.startsWith("192.168.") ||
      window.location.hostname.startsWith("10.") ||
      window.location.hostname.startsWith("172.") ||
      window.location.port === "80" // Docker compose local development
    ) {
      return "development";
    }
    return "production";
  },

  // Get WebSocket URL
  getWebSocketUrl: function (endpoint) {
    const env = this.getEnvironment();
    const config = this.backend[env];
    return `${config.protocol}://${config.host}${endpoint}`;
  },
};
