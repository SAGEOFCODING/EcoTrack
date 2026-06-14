/**
 * EcoTrack — Home Page
 */
var EcoTrack = window.EcoTrack || {};

EcoTrack.Pages = EcoTrack.Pages || {};

EcoTrack.Pages.Home = {
    render() {
        return `
            <section class="hero-section" id="hero-section">
                <div class="hero-particles" id="hero-particles"></div>
                <div class="container">
                    <div class="hero-content">
                        <div class="hero-badge">
                            <span class="hero-badge-dot"></span>
                            Carbon Footprint Awareness Platform
                        </div>
                        <h1 class="hero-title">
                            Know Your<br>
                            <span class="highlight">Carbon Impact</span>
                        </h1>
                        <p class="hero-subtitle">
                            Track your daily footprint and take meaningful action toward a greener future. 
                            Empowering you to reduce your carbon impact with data-driven insights and personalized action plans.
                        </p>
                        <div class="hero-actions">
                            <a href="#calculator" class="btn btn-primary btn-lg" id="hero-cta-calculate">
                                🧮 Calculate Your Footprint
                            </a>
                            <a href="#education" class="btn btn-secondary btn-lg" id="hero-cta-learn">
                                📚 Learn More
                            </a>
                        </div>
                        <div class="hero-stats">
                            <div class="hero-stat">
                                <div class="hero-stat-value gradient-text" id="stat-co2">2.4M+</div>
                                <div class="hero-stat-label">Tonnes CO₂ Tracked</div>
                            </div>
                            <div class="hero-stat">
                                <div class="hero-stat-value gradient-text" id="stat-users">50K+</div>
                                <div class="hero-stat-label">Active Users</div>
                            </div>
                            <div class="hero-stat">
                                <div class="hero-stat-value gradient-text" id="stat-reduction">12%</div>
                                <div class="hero-stat-label">Avg Reduction</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="features-section section" id="features-section">
                <div class="container">
                    <div class="section-header">
                        <span class="section-label">Features</span>
                        <h2>Everything You Need to<br><span class="gradient-text">Go Green</span></h2>
                        <p>Comprehensive tools and insights to understand, track, and reduce your environmental impact.</p>
                    </div>
                    <div class="grid grid-3">
                        ${EcoTrack.Cards.feature('🧮', 'Carbon Calculator', 'Interactive multi-step assessment covering transport, food, energy, and shopping. Get your precise annual carbon footprint in minutes.', '')}
                        ${EcoTrack.Cards.feature('🎯', 'Smart Action Plans', 'Personalized recommendations powered by our smart engine. Prioritized by impact, tailored to your lifestyle, with estimated savings.', 'icon-secondary')}
                        ${EcoTrack.Cards.feature('📊', 'Impact Dashboard', 'Beautiful visualizations of your footprint breakdown, comparisons to averages, and progress tracking over time.', 'icon-warning')}
                        ${EcoTrack.Cards.feature('🌍', 'Carbon Offsets', 'Explore verified carbon offset projects worldwide — from reforestation to direct air capture technology.', 'icon-purple')}
                        ${EcoTrack.Cards.feature('📱', 'Eco-Score Rating', 'Rate everyday activities on an A-F scale. Compare alternatives side-by-side with our "This vs. That" tool.', '')}
                        ${EcoTrack.Cards.feature('📚', 'Educational Hub', 'Curated facts, tips, and guides about carbon emissions. Learn how your daily choices affect the planet.', 'icon-secondary')}
                    </div>
                </div>
            </section>

            <section class="how-section section" id="how-section">
                <div class="container">
                    <div class="section-header">
                        <span class="section-label">How It Works</span>
                        <h2>Four Steps to a <span class="gradient-text">Greener You</span></h2>
                        <p>Our data-driven approach makes it easy to understand and reduce your carbon footprint.</p>
                    </div>
                    <div class="how-steps">
                        <div class="how-step animate-fade-in-up delay-1">
                            <div class="how-step-number">🧮</div>
                            <h4>Calculate</h4>
                            <p>Answer simple questions about your lifestyle across 4 categories</p>
                        </div>
                        <div class="how-connector"></div>
                        <div class="how-step animate-fade-in-up delay-2">
                            <div class="how-step-number">📊</div>
                            <h4>Analyze</h4>
                            <p>See your detailed breakdown and how you compare to averages</p>
                        </div>
                        <div class="how-connector"></div>
                        <div class="how-step animate-fade-in-up delay-3">
                            <div class="how-step-number">🎯</div>
                            <h4>Act</h4>
                            <p>Get personalized recommendations sorted by impact</p>
                        </div>
                        <div class="how-connector"></div>
                        <div class="how-step animate-fade-in-up delay-4">
                            <div class="how-step-number">📈</div>
                            <h4>Track</h4>
                            <p>Monitor your progress over time and celebrate wins</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="cta-section section" id="cta-section">
                <div class="container">
                    <div class="cta-card">
                        <h2>Ready to Make a Difference?</h2>
                        <p>It takes just 5 minutes to calculate your footprint and get personalized recommendations.</p>
                        <a href="#calculator" class="btn btn-lg" style="background: var(--bg-primary); color: var(--accent-primary);" id="cta-start">
                            Start Your Assessment →
                        </a>
                    </div>
                </div>
            </section>
        `;
    },

    init() {
        this._createParticles();
        this._animateStats();
    },

    _createParticles() {
        const container = document.getElementById('hero-particles');
        if (!container) return;

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                width: ${2 + Math.random() * 4}px;
                height: ${2 + Math.random() * 4}px;
                opacity: ${0.1 + Math.random() * 0.3};
                animation-delay: ${Math.random() * 6}s;
                animation-duration: ${4 + Math.random() * 6}s;
            `;
            container.appendChild(particle);
        }
    },

    _animateStats() {
        const stats = [
            { id: 'stat-co2', target: 2.4, suffix: 'M+', prefix: '' },
            { id: 'stat-users', target: 50, suffix: 'K+', prefix: '' },
            { id: 'stat-reduction', target: 12, suffix: '%', prefix: '' }
        ];

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    stats.forEach(stat => {
                        this._countUp(stat.id, stat.target, stat.suffix, stat.prefix);
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });

        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) observer.observe(heroStats);
    },

    _countUp(elementId, target, suffix = '', prefix = '') {
        const el = document.getElementById(elementId);
        if (!el) return;

        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const isDecimal = target % 1 !== 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
        }, duration / steps);
    }
};

window.EcoTrack = EcoTrack;
