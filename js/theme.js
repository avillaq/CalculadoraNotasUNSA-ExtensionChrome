(() => {
    const storageKey = 'theme-preference';
    const root = document.documentElement;
    const toggleButton = document.querySelector('#theme-toggle');
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const getStoredTheme = () => {
        const value = localStorage.getItem(storageKey);
        if (value === 'light' || value === 'dark') {
            return value;
        }
        return null;
    };

    const getSystemTheme = () => (mediaQuery.matches ? 'dark' : 'light');

    const updateToggle = (activeTheme) => {
        if (!toggleButton) {
            return;
        }
        const isDark = activeTheme === 'dark';
        const label = isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';
        toggleButton.setAttribute('aria-label', label);
        toggleButton.setAttribute('title', label);
        toggleButton.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    };

    const applyTheme = (theme) => {
        if (theme) {
            root.setAttribute('data-theme', theme);
        } else {
            root.removeAttribute('data-theme');
        }
        updateToggle(theme ?? getSystemTheme());
    };

    applyTheme(getStoredTheme());

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            const currentTheme = getStoredTheme() ?? getSystemTheme();
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem(storageKey, nextTheme);
            applyTheme(nextTheme);
        });
    }

    mediaQuery.addEventListener('change', () => {
        if (!getStoredTheme()) {
            applyTheme(null);
        }
    });
})();
