window.I18n = {
    currentLocale: 'ko',
    fallbackLocale: 'en',
    
    async init() {
        this.currentLocale = this.detectLocale();
        document.documentElement.lang = this.currentLocale;
        this.updateUI();
        this.setupLanguageButtons();
    },
    
    detectLocale() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        const storedLang = localStorage.getItem('locale');
        const browserLang = navigator.language.slice(0, 2);
        const supportedLocales = ['ko', 'en', 'ja'];
        
        for (const lang of [urlLang, storedLang, browserLang, 'ko']) {
            if (lang && supportedLocales.includes(lang)) {
                return lang;
            }
        }
        return 'ko';
    },
    
    t(key, params = {}) {
        const keys = key.split('.');
        let message = window.LOCALES[this.currentLocale];
        
        for (const k of keys) {
            message = message?.[k];
        }
        
        if (!message) {
            message = window.LOCALES[this.fallbackLocale];
            for (const k of keys) {
                message = message?.[k];
            }
        }
        
        if (!message) return key;
        
        return message.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
            const value = params[paramKey];
            return value !== undefined ? value : match;
        });
    },
    
    setLanguage(locale) {
        this.currentLocale = locale;
        localStorage.setItem('locale', locale);
        document.documentElement.lang = locale;
        this.updateUI();
        this.updateLanguageButtons();
        
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { locale }
        }));
    },
    
    updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            element.textContent = this.t(key);
        });
        
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.dataset.i18nPlaceholder;
            element.placeholder = this.t(key);
        });
        
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.dataset.i18nTitle;
            element.title = this.t(key);
        });
    },
    
    setupLanguageButtons() {
        document.querySelectorAll('[data-lang]').forEach(button => {
            button.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.setLanguage(lang);
            });
        });
        this.updateLanguageButtons();
    },
    
    updateLanguageButtons() {
        document.querySelectorAll('[data-lang]').forEach(button => {
            button.classList.toggle('active', button.dataset.lang === this.currentLocale);
        });
    }
};
