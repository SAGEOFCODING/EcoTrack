/**
 * EcoTrack — Home Page
 */
var EcoTrack = window.EcoTrack || {};

EcoTrack.Pages = EcoTrack.Pages || {};

EcoTrack.Pages.Home = {
    render() {
        const stats = [
            { id: 'stat-co2', value: '2.4M+', label: 'Tonnes CO₂ Tracked' },
            { id: 'stat-users', value: '50K+', label: 'Active Users' },
            { id: 'stat-reduction', value: '12%', label: 'Avg Reduction' }
        ];

        const steps = [
            { icon: '🧮', title: 'Calculate', desc: 'Answer simple questions about your lifestyle across 4 categories' },
            { icon: '📊', title: 'Analyze', desc: 'See your detailed breakdown and how you compare to averages' },
            { icon: '🎯', title: 'Act', desc: 'Get personalized recommendations sorted by impact' },
            { icon: '📈', title: 'Track', desc: 'Monitor your progress over time and celebrate wins' }
        ];

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
                            ${stats.map(s => `
                                <div class="hero-stat">
                                    <div class="hero-stat-value gradient-text" id="${s.id}">${s.value}</div>
                                    <div class="hero-stat-label">${s.label}</div>
                                </div>
                            `).join('')}
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
                        ${steps.map((step, i) => `
                            <div class="how-step animate-fade-in-up delay-${i + 1}">
                                <div class="how-step-number">${step.icon}</div>
                                <h4>${step.title}</h4>
                                <p>${step.desc}</p>
                            </div>
                            ${i < steps.length - 1 ? '<div class="how-connector"></div>' : ''}
                        `).join('')}
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
        const isDecimal = target % 1 !== 0;
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // easeOutQuart
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            const current = target * easeProgress;

            el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }
};

window.EcoTrack = EcoTrack;
