(function () {
    // Theme Initialization
    try {
        const enableThemeToggle = (window.__ENV__ && window.__ENV__.ENABLE_THEME_TOGGLE) !== 'false';

        // If toggle is disabled, ignore localStorage and purely rely on system preference (or default)
        // If toggle is enabled, use localStorage if available, otherwise system preference
        let theme;
        if (enableThemeToggle) {
            const storedTheme = localStorage.getItem('theme');
            theme = storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : null;
        }

        const detectedTheme = theme ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

        window.__THEME__ = detectedTheme;

        if (detectedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    } catch (e) {
        window.__THEME__ = 'light';
        document.documentElement.classList.remove('dark');
    }

    // Language Initialization
    try {
        // Read from window.__ENV__ which is populated in index.html
        const envSupportedLangs = (window.__ENV__ && window.__ENV__.SUPPORTED_LANGUAGES) || '__VITE_SUPPORTED_LANGUAGES__';
        const envDefaultLang = (window.__ENV__ && window.__ENV__.DEFAULT_LANGUAGE) || '__VITE_DEFAULT_LANGUAGE__';

        const SUPPORTED_LANGUAGES = envSupportedLangs.startsWith('__VITE_')
            ? ['en']
            : envSupportedLangs.split(',').map(lang => lang.trim());

        const DEFAULT_LANGUAGE = envDefaultLang.startsWith('__VITE_')
            ? 'en'
            : envDefaultLang.trim();

        const pathname = window.location.pathname;
        const pathSegments = pathname.replace(/^\//, '').split('/');
        const firstSegment = pathSegments[0];

        let detectedLanguage = DEFAULT_LANGUAGE;
        if (firstSegment && SUPPORTED_LANGUAGES.includes(firstSegment)) {
            detectedLanguage = firstSegment;
        }

        window.__LANGUAGE__ = detectedLanguage;
        document.documentElement.lang = detectedLanguage;

        // Check if language toggle/persistence is enabled
        const enableLanguageToggle = (window.__ENV__ && window.__ENV__.ENABLE_LANGUAGE_TOGGLE) !== 'false';
        if (enableLanguageToggle) {
            localStorage.setItem('language', detectedLanguage);
        }
    } catch (e) {
        window.__LANGUAGE__ = 'en';
        document.documentElement.lang = 'en';
    }
})();
