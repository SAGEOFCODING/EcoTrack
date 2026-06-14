/**
 * EcoTrack — Navbar Component
 */
var EcoTrack = window.EcoTrack || {};

EcoTrack.Navbar = {
    init() {
        const toggle = document.getElementById('nav-toggle');
        const menu = document.getElementById('nav-menu');
        const navbar = document.getElementById('main-nav');

        // Mobile menu toggle
        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                const isActive = toggle.classList.toggle('active');
                menu.classList.toggle('active');
                toggle.setAttribute('aria-expanded', isActive);
            });

            // Close menu when clicking a link
            menu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    toggle.classList.remove('active');
                    menu.classList.remove('active');
                    toggle.setAttribute('aria-expanded', 'false');
                });
            });
        }

        // Scroll effect
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            lastScroll = currentScroll;
        }, { passive: true });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (menu && menu.classList.contains('active') && 
                !menu.contains(e.target) && !toggle.contains(e.target)) {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    },

    setActive(page) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });
    }
};

window.EcoTrack = EcoTrack;
