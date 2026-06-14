/**
 * EcoTrack — Main Application Router
 * SPA hash-based routing with page transitions
 */
var EcoTrack = window.EcoTrack || {};

EcoTrack.App = {
    currentPage: null,
    pages: {
        home: EcoTrack.Pages.Home,
        calculator: EcoTrack.Pages.Calculator,
        dashboard: EcoTrack.Pages.Dashboard,
        actions: EcoTrack.Pages.Actions,
        ecoscore: EcoTrack.Pages.EcoScore,
        offset: EcoTrack.Pages.Offset,
        education: EcoTrack.Pages.Education
    },

    async init() {
        console.log('🌿 EcoTrack initializing...');

        // Initialize navbar
        EcoTrack.Navbar.init();

        // Initialize charts defaults
        EcoTrack.Charts.init();

        // Initialize Firebase
        await EcoTrack.FirebaseConfig.init();

        // Initialize auth
        await EcoTrack.AuthService.init();

        // Set up routing
        window.addEventListener('hashchange', () => this._onRouteChange());

        // Initial route
        this._onRouteChange();

        // Hide loader
        setTimeout(() => {
            const loader = document.getElementById('page-loader');
            if (loader) {
                loader.classList.add('hidden');
                setTimeout(() => loader.remove(), 500);
            }
        }, 600);

        console.log('✅ EcoTrack ready!');
    },

    _onRouteChange() {
        const hash = window.location.hash.slice(1) || 'home';
        const pageName = hash.split('?')[0]; // Remove query params

        if (this.pages[pageName]) {
            this._navigate(pageName);
        } else {
            // Default to home for unknown routes
            window.location.hash = '#home';
        }
    },

    _navigate(pageName) {
        if (this.currentPage === pageName) return;

        // Destroy previous page if it has a destroy method
        const prevPage = this.pages[this.currentPage];
        if (prevPage?.destroy) prevPage.destroy();

        // Destroy all charts
        EcoTrack.Charts.destroyAll();

        const contentEl = document.getElementById('app-content');
        if (!contentEl) return;

        // Update active nav
        EcoTrack.Navbar.setActive(pageName);

        // Render new page with transition
        contentEl.classList.remove('page-enter');
        
        const page = this.pages[pageName];
        if (page) {
            contentEl.innerHTML = page.render();
            
            // Trigger enter animation
            requestAnimationFrame(() => {
                contentEl.classList.add('page-enter');
            });

            // Initialize page-specific logic
            if (page.init) {
                // Use setTimeout to ensure DOM is ready
                setTimeout(() => page.init(), 50);
            }
        }

        this.currentPage = pageName;

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Update page title
        const titles = {
            home: 'EcoTrack — Carbon Footprint Awareness Platform',
            calculator: 'Carbon Calculator — EcoTrack',
            dashboard: 'Impact Dashboard — EcoTrack',
            actions: 'Action Plans — EcoTrack',
            ecoscore: 'Eco-Score — EcoTrack',
            offset: 'Carbon Offsets — EcoTrack',
            education: 'Learn — EcoTrack'
        };
        document.title = titles[pageName] || titles.home;
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    EcoTrack.App.init();
});

window.EcoTrack = EcoTrack;
