if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.StonifyApp.init();
    });
} else {
    window.StonifyApp.init();
}

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});
