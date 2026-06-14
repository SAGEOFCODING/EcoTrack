/**
 * EcoTrack — Education Page
 */
const EcoTrack = window.EcoTrack || {};
EcoTrack.Pages = EcoTrack.Pages || {};

EcoTrack.Pages.Education = {
    currentFact: 0,

    facts: [
        { title: 'The Average Person Generates 4.8 Tonnes of CO₂ Per Year', text: 'That\'s the global average. In the US, it\'s a staggering 16 tonnes — over 3x the world average.', category: 'Global Impact' },
        { title: 'Food Production Causes 26% of Global Emissions', text: 'From farm to fork, our food system generates over a quarter of all greenhouse gases, with livestock alone responsible for 14.5%.', category: 'Food' },
        { title: 'A Single Transatlantic Flight = 1 Year of Driving', text: 'One round-trip flight from New York to London produces about 2.2 tonnes of CO₂ — equivalent to driving 12,000 km in a car.', category: 'Transport' },
        { title: 'The Internet Produces 3.7% of Global Emissions', text: 'Data centers, network infrastructure, and devices collectively emit as much CO₂ as the entire airline industry.', category: 'Digital' },
        { title: 'Switching to Plant-Based Saves 1.6 Tonnes/Year', text: 'A vegan diet produces 50-70% fewer food-related emissions than a typical Western diet with meat.', category: 'Food' },
        { title: 'Buildings Account for 39% of Energy-Related CO₂', text: 'Heating, cooling, and powering our buildings is the single largest source of energy-related emissions globally.', category: 'Energy' },
        { title: 'Fast Fashion: 10% of Global Carbon Emissions', text: 'The fashion industry produces more emissions than international flights and maritime shipping combined.', category: 'Lifestyle' },
        { title: 'Trees Absorb ~22 kg of CO₂ Per Year', text: 'A mature tree absorbs about 22 kg of CO₂ annually. Planting 50 trees offsets roughly 1 tonne per year.', category: 'Nature' }
    ],

    tips: [
        { icon: '🚲', category: 'Transport', title: 'Bike Short Distances', text: 'Trips under 5 km are perfect for cycling. You\'ll save money, get exercise, and produce zero emissions.' },
        { icon: '🥗', category: 'Food', title: 'Meatless Mondays', text: 'Just one meat-free day per week can reduce your food footprint by 15%. Start with dishes you already love.' },
        { icon: '💡', category: 'Energy', title: 'Switch to LED Bulbs', text: 'LEDs use 75% less energy and last 25x longer. The switch pays for itself in just a few months.' },
        { icon: '🧊', category: 'Energy', title: 'Lower Your Thermostat', text: 'Each degree you lower your heating saves about 320 kg CO₂ and $150 per year.' },
        { icon: '👕', category: 'Lifestyle', title: 'Choose Quality Over Quantity', text: 'Buying fewer, higher-quality items reduces manufacturing emissions and saves money long-term.' },
        { icon: '📦', category: 'Lifestyle', title: 'Consolidate Deliveries', text: 'Batch your online orders. Standard shipping is more efficient than express because trucks can be fully loaded.' },
        { icon: '🚿', category: 'Energy', title: 'Shorter Showers', text: 'Cutting your shower from 8 to 4 minutes halves the energy used for water heating.' },
        { icon: '🔌', category: 'Energy', title: 'Unplug Standby Devices', text: 'Phantom power from devices on standby can account for 10% of your electricity bill.' },
        { icon: '🌱', category: 'Food', title: 'Grow Your Own Herbs', text: 'Even a windowsill herb garden reduces packaging waste and transport emissions from store-bought herbs.' },
        { icon: '☕', category: 'Food', title: 'Try Oat Milk', text: 'Switching from dairy to oat milk reduces emissions by 60%. It froths great for coffee too!' },
        { icon: '🚗', category: 'Transport', title: 'Maintain Tire Pressure', text: 'Properly inflated tires improve fuel efficiency by up to 3%, saving both emissions and money.' },
        { icon: '♻️', category: 'Lifestyle', title: 'Repair Before Replace', text: 'Many items can be fixed for a fraction of the replacement cost. Check for local repair cafes.' }
    ],

    render() {
        return `
            <div class="education-page">
                <div class="container">
                    <div class="education-header">
                        <span class="section-label">Learn</span>
                        <h2>Climate <span class="gradient-text">Knowledge Hub</span></h2>
                        <p>Facts, tips, and insights to help you understand your carbon impact and make informed choices.</p>
                    </div>

                    <div class="fact-carousel" id="fact-carousel">
                        <div class="card fact-card" id="fact-display">
                            <span class="fact-label">${this.facts[0].category}</span>
                            <h3 id="fact-title">${this.facts[0].title}</h3>
                            <p id="fact-text">${this.facts[0].text}</p>
                        </div>
                        <div class="fact-nav" id="fact-nav">
                            ${this.facts.map((_, i) => `
                                <button class="fact-dot ${i === 0 ? 'active' : ''}" data-fact="${i}" aria-label="Fact ${i + 1}"></button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="section-header mt-8" style="text-align: left;">
                        <span class="section-label">Tips & Guides</span>
                        <h3>Practical Ways to <span class="gradient-text">Reduce Your Impact</span></h3>
                    </div>

                    <div class="ecoscore-categories mb-6" id="education-filters">
                        <button class="tag active" data-filter="all">🌍 All Tips</button>
                        <button class="tag" data-filter="Transport">🚗 Transport</button>
                        <button class="tag" data-filter="Food">🍽️ Food</button>
                        <button class="tag" data-filter="Energy">⚡ Energy</button>
                        <button class="tag" data-filter="Lifestyle">🛒 Lifestyle</button>
                    </div>

                    <div class="tips-grid" id="tips-grid">
                        ${this.tips.map(tip => EcoTrack.Cards.tip(tip.icon, tip.category, tip.title, tip.text)).join('')}
                    </div>

                    <div class="card mt-12" style="padding: var(--space-8); text-align: center;">
                        <h3 style="margin-bottom: var(--space-3);">📊 Understanding Carbon Units</h3>
                        <p style="max-width: 600px; margin: 0 auto var(--space-6);">Carbon emissions are measured in CO₂ equivalents (CO₂e), which include all greenhouse gases converted to their CO₂ warming potential.</p>
                        <div class="grid grid-4 gap-4">
                            <div class="card card-flat" style="padding: var(--space-4); text-align: center;">
                                <div style="font-size: 2rem; margin-bottom: var(--space-2);">1 kg</div>
                                <div class="stat-label">= 1 balloon of CO₂</div>
                            </div>
                            <div class="card card-flat" style="padding: var(--space-4); text-align: center;">
                                <div style="font-size: 2rem; margin-bottom: var(--space-2);">1 tonne</div>
                                <div class="stat-label">= Hot air balloon</div>
                            </div>
                            <div class="card card-flat" style="padding: var(--space-4); text-align: center;">
                                <div style="font-size: 2rem; margin-bottom: var(--space-2);">4.8 t</div>
                                <div class="stat-label">= Global average/yr</div>
                            </div>
                            <div class="card card-flat" style="padding: var(--space-4); text-align: center;">
                                <div style="font-size: 2rem; margin-bottom: var(--space-2);">2.9 t</div>
                                <div class="stat-label">= 2030 Paris target</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        this._bindFactCarousel();
        this._bindFilters();
        this._autoRotateFacts();
    },

    _bindFactCarousel() {
        document.querySelectorAll('#fact-nav .fact-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                this.currentFact = parseInt(dot.dataset.fact);
                this._updateFact();
            });
        });
    },

    _updateFact() {
        const fact = this.facts[this.currentFact];
        const title = document.getElementById('fact-title');
        const text = document.getElementById('fact-text');
        const label = document.querySelector('.fact-label');

        if (title) title.textContent = fact.title;
        if (text) text.textContent = fact.text;
        if (label) label.textContent = fact.category;

        document.querySelectorAll('#fact-nav .fact-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentFact);
        });
    },

    _autoRotateFacts() {
        this._factInterval = setInterval(() => {
            this.currentFact = (this.currentFact + 1) % this.facts.length;
            this._updateFact();
        }, 6000);
    },

    _bindFilters() {
        document.querySelectorAll('#education-filters .tag').forEach(tag => {
            tag.addEventListener('click', () => {
                document.querySelectorAll('#education-filters .tag').forEach(t => t.classList.remove('active'));
                tag.classList.add('active');

                const filter = tag.dataset.filter;
                const filtered = filter === 'all'
                    ? this.tips
                    : this.tips.filter(t => t.category === filter);

                const grid = document.getElementById('tips-grid');
                if (grid) {
                    grid.innerHTML = filtered.map(tip =>
                        EcoTrack.Cards.tip(tip.icon, tip.category, tip.title, tip.text)
                    ).join('');
                }
            });
        });
    },

    destroy() {
        if (this._factInterval) {
            clearInterval(this._factInterval);
        }
    }
};

window.EcoTrack = EcoTrack;
