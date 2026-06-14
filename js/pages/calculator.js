/**
 * EcoTrack — Calculator Page
 * Multi-step carbon footprint calculator
 */
var EcoTrack = window.EcoTrack || {};
EcoTrack.Pages = EcoTrack.Pages || {};

EcoTrack.Pages.Calculator = {
    currentStep: 0,
    totalSteps: 4,
    formData: {
        transport: {},
        food: {},
        energy: {},
        shopping: {}
    },

    steps: [
        { key: 'transport', label: 'Transport', icon: '🚗' },
        { key: 'food', label: 'Food & Diet', icon: '🍽️' },
        { key: 'energy', label: 'Home Energy', icon: '⚡' },
        { key: 'shopping', label: 'Shopping', icon: '🛒' }
    ],

    render() {
        return `
            <div class="calculator-page">
                <div class="container">
                    <div class="section-header" style="text-align:left; margin-bottom: var(--space-8);">
                        <span class="section-label">Carbon Calculator</span>
                        <h2>Calculate Your <span class="gradient-text">Carbon Footprint</span></h2>
                        <p style="margin:0">Answer a few questions about your lifestyle to get your personalized carbon assessment.</p>
                    </div>

                    <div class="step-progress" id="calc-steps">
                        ${this.steps.map((step, i) => `
                            <div class="step-item">
                                <div class="step-circle ${i === 0 ? 'active' : ''}" data-step="${i}">
                                    ${step.icon}
                                    <span class="step-label">${step.label}</span>
                                </div>
                                ${i < this.steps.length - 1 ? '<div class="step-line"></div>' : ''}
                            </div>
                        `).join('')}
                    </div>

                    <div class="calculator-layout">
                        <div class="calculator-main">
                            <div class="card" id="calc-form-card" style="padding: var(--space-8);">
                                <div id="calc-step-content"></div>
                                <div class="calculator-nav">
                                    <button class="btn btn-ghost" id="calc-prev" disabled>← Back</button>
                                    <button class="btn btn-primary" id="calc-next">Next →</button>
                                </div>
                            </div>
                        </div>
                        <div class="calculator-sidebar">
                            <div class="card calc-preview-card">
                                <div class="calc-preview-title">Live CO₂ Preview</div>
                                <div class="calc-preview-gauge">
                                    <canvas id="calc-gauge-canvas" width="160" height="160"></canvas>
                                    <div class="calc-gauge-value">
                                        <span class="calc-gauge-number" id="calc-preview-total">0.0</span>
                                        <span class="calc-gauge-unit">tonnes CO₂/yr</span>
                                    </div>
                                </div>
                                <div class="calc-category-list" id="calc-category-list">
                                    ${this.steps.map(step => `
                                        <div class="calc-category-item">
                                            <span class="calc-category-name">
                                                <span class="calc-category-dot" style="background: ${step.key === 'transport' ? '#00d47e' : step.key === 'food' ? '#00b4d8' : step.key === 'energy' ? '#ffd60a' : '#a78bfa'}"></span>
                                                ${step.label}
                                            </span>
                                            <span class="calc-category-value" id="calc-cat-${step.key}">0 kg</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        this.currentStep = 0;
        this.formData = { transport: {}, food: {}, energy: {}, shopping: {} };
        this._renderStep();
        this._bindNav();
        this._updateGauge();
    },

    _bindNav() {
        document.getElementById('calc-prev')?.addEventListener('click', () => this._prevStep());
        document.getElementById('calc-next')?.addEventListener('click', () => this._nextStep());
    },

    _prevStep() {
        if (this.currentStep > 0) {
            this._saveCurrentStep();
            this.currentStep--;
            this._renderStep();
            this._updateProgress();
        }
    },

    _nextStep() {
        this._saveCurrentStep();
        if (this.currentStep < this.totalSteps - 1) {
            this.currentStep++;
            this._renderStep();
            this._updateProgress();
        } else {
            this._showResults();
        }
    },

    _updateProgress() {
        document.querySelectorAll('.step-circle').forEach((circle, i) => {
            circle.classList.remove('active', 'completed');
            if (i < this.currentStep) circle.classList.add('completed');
            else if (i === this.currentStep) circle.classList.add('active');
        });
        document.querySelectorAll('.step-line').forEach((line, i) => {
            line.classList.toggle('active', i < this.currentStep);
        });

        const prevBtn = document.getElementById('calc-prev');
        const nextBtn = document.getElementById('calc-next');
        if (prevBtn) prevBtn.disabled = this.currentStep === 0;
        if (nextBtn) nextBtn.textContent = this.currentStep === this.totalSteps - 1 ? 'See Results →' : 'Next →';
    },

    _renderStep() {
        const container = document.getElementById('calc-step-content');
        if (!container) return;

        const stepRenderers = [
            () => this._renderTransport(),
            () => this._renderFood(),
            () => this._renderEnergy(),
            () => this._renderShopping()
        ];

        container.innerHTML = `<div class="calculator-step">${stepRenderers[this.currentStep]()}</div>`;
        this._updateProgress();
        this._bindStepInputs();
    },

    _renderTransport() {
        const d = this.formData.transport;
        return `
            <h3 style="margin-bottom: var(--space-6);">🚗 Transport & Travel</h3>
            ${EcoTrack.Forms.radioGroup('How do you primarily commute?', 'primaryCommute', d.primaryCommute || 'car', [
                {value: 'car', label: '🚗 Car'},
                {value: 'publicTransit', label: '🚌 Public Transit'},
                {value: 'bicycle', label: '🚲 Bicycle'},
                {value: 'walk', label: '🚶 Walk'},
                {value: 'remote', label: '🏠 Remote'}
            ])}
            ${EcoTrack.Forms.rangeSlider('Annual driving distance', 'annualKm', 0, 50000, 500, d.annualKm || 10000, 'km')}
            ${EcoTrack.Forms.select('Number of flights per year', 'flightsPerYear', d.flightsPerYear || 0, 
                [0,1,2,3,4,5,6,7,8,9,10].map(n => ({value: n, label: n + (n === 10 ? '+' : '') + ' flights'}))
            )}
            ${EcoTrack.Forms.radioGroup('Vehicle type (if driving)', 'vehicleType', d.vehicleType || 'petrol', [
                {value: 'petrol', label: '⛽ Petrol'},
                {value: 'diesel', label: '🛢️ Diesel'},
                {value: 'hybrid', label: '🔋 Hybrid'},
                {value: 'electric', label: '⚡ Electric'},
                {value: 'none', label: '❌ No Car'}
            ])}
        `;
    },

    _renderFood() {
        const d = this.formData.food;
        return `
            <h3 style="margin-bottom: var(--space-6);">🍽️ Food & Diet</h3>
            ${EcoTrack.Forms.radioGroup('What best describes your diet?', 'dietType', d.dietType || 'mediumMeat', [
                {value: 'highMeat', label: '🥩 Heavy Meat'},
                {value: 'mediumMeat', label: '🍗 Moderate Meat'},
                {value: 'lowMeat', label: '🥓 Light Meat'},
                {value: 'pescatarian', label: '🐟 Pescatarian'},
                {value: 'vegetarian', label: '🥗 Vegetarian'},
                {value: 'vegan', label: '🌱 Vegan'}
            ])}
            ${EcoTrack.Forms.radioGroup('How much food do you waste?', 'foodWaste', d.foodWaste || 'average', [
                {value: 'low', label: '♻️ Minimal (compost)'},
                {value: 'average', label: '📦 Some Waste'},
                {value: 'high', label: '🗑️ Frequent Waste'}
            ])}
            ${EcoTrack.Forms.radioGroup('Do you buy local & seasonal produce?', 'localFood', d.localFood !== undefined ? String(d.localFood) : 'false', [
                {value: 'true', label: '🌾 Yes, mostly local'},
                {value: 'false', label: '🏪 No, mostly supermarket'}
            ])}
        `;
    },

    _renderEnergy() {
        const d = this.formData.energy;
        return `
            <h3 style="margin-bottom: var(--space-6);">⚡ Home Energy</h3>
            ${EcoTrack.Forms.radioGroup('Home size', 'homeSize', d.homeSize || 'medium', [
                {value: 'small', label: '🏢 Apartment'},
                {value: 'medium', label: '🏠 Small House'},
                {value: 'large', label: '🏡 Large House'},
                {value: 'veryLarge', label: '🏰 Very Large'}
            ])}
            ${EcoTrack.Forms.radioGroup('Electricity source', 'electricitySource', d.electricitySource || 'grid_average', [
                {value: 'grid_average', label: '🔌 Grid Average'},
                {value: 'renewable', label: '☀️ Renewable'},
                {value: 'coal', label: '🏭 Coal Heavy'},
                {value: 'gas', label: '🔥 Gas Heavy'}
            ])}
            ${EcoTrack.Forms.radioGroup('Primary heating type', 'heatingType', d.heatingType || 'naturalGas', [
                {value: 'naturalGas', label: '🔥 Natural Gas'},
                {value: 'oil', label: '🛢️ Oil/Fuel'},
                {value: 'electric', label: '⚡ Electric'},
                {value: 'heatPump', label: '🔄 Heat Pump'},
                {value: 'wood', label: '🪵 Wood'}
            ])}
            ${EcoTrack.Forms.checkboxGroup('Energy saving measures', [
                {name: 'thermostatReduced', label: '🌡️ Lowered thermostat 2°C+', checked: !!d.thermostatReduced},
                {name: 'goodInsulation', label: '🏗️ Good insulation', checked: !!d.goodInsulation}
            ])}
        `;
    },

    _renderShopping() {
        const d = this.formData.shopping;
        return `
            <h3 style="margin-bottom: var(--space-6);">🛒 Shopping & Lifestyle</h3>
            ${EcoTrack.Forms.radioGroup('Clothing buying habits', 'clothingHabit', d.clothingHabit || 'sustainable', [
                {value: 'fastFashion', label: '🛍️ Fast Fashion'},
                {value: 'sustainable', label: '🌱 Sustainable Brands'},
                {value: 'secondHand', label: '♻️ Second-Hand'}
            ])}
            ${EcoTrack.Forms.rangeSlider('Clothing items purchased per year', 'clothingItemsPerYear', 0, 60, 1, d.clothingItemsPerYear || 12, 'items')}
            ${EcoTrack.Forms.radioGroup('Electronics upgrade frequency', 'electronicsFrequency', d.electronicsFrequency || 'average', [
                {value: 'frequent', label: '📱 Every 1-2 years'},
                {value: 'average', label: '💻 Every 2-3 years'},
                {value: 'rare', label: '🔧 4+ years (repair)'}
            ])}
            ${EcoTrack.Forms.radioGroup('Overall spending level', 'spendingLevel', d.spendingLevel || 'average', [
                {value: 'low', label: '🧘 Minimalist'},
                {value: 'average', label: '⚖️ Moderate'},
                {value: 'high', label: '🛒 High Consumer'}
            ])}
            ${EcoTrack.Forms.radioGroup('Online delivery frequency', 'deliveryFrequency', d.deliveryFrequency || 'monthly', [
                {value: 'rare', label: '📬 Rarely'},
                {value: 'monthly', label: '📦 Monthly'},
                {value: 'weekly', label: '🚚 Weekly'},
                {value: 'daily', label: '📫 Daily'}
            ])}
        `;
    },

    _bindStepInputs() {
        // Range sliders
        const kmSlider = document.getElementById('calc-annual-km');
        if (kmSlider) {
            kmSlider.addEventListener('input', (e) => {
                document.getElementById('km-display').textContent = parseInt(e.target.value).toLocaleString() + ' km';
                this._liveUpdate();
            });
        }

        const clothingSlider = document.getElementById('calc-clothing-items');
        if (clothingSlider) {
            clothingSlider.addEventListener('input', (e) => {
                document.getElementById('clothing-display').textContent = e.target.value + ' items';
                this._liveUpdate();
            });
        }

        // All other inputs for live update
        document.querySelectorAll('#calc-step-content input, #calc-step-content select').forEach(input => {
            input.addEventListener('change', () => this._liveUpdate());
        });
    },

    _saveCurrentStep() {
        const step = this.steps[this.currentStep];
        const data = {};
        const container = document.getElementById('calc-step-content');
        if (!container) return;

        container.querySelectorAll('input[type="radio"]:checked').forEach(input => {
            data[input.name] = input.value === 'true' ? true : input.value === 'false' ? false : input.value;
        });
        container.querySelectorAll('input[type="checkbox"]').forEach(input => {
            data[input.name] = input.checked;
        });
        container.querySelectorAll('input[type="range"]').forEach(input => {
            data[input.name] = parseInt(input.value);
        });
        container.querySelectorAll('select').forEach(input => {
            data[input.name] = parseInt(input.value) || input.value;
        });

        this.formData[step.key] = { ...this.formData[step.key], ...data };
    },

    _liveUpdate() {
        this._saveCurrentStep();
        const result = EcoTrack.CalculatorEngine.calculate(this.formData);
        this._updatePreview(result);
    },

    _updatePreview(result) {
        const totalEl = document.getElementById('calc-preview-total');
        if (totalEl) totalEl.textContent = result.totalTonnes.toFixed(1);

        this.steps.forEach(step => {
            const el = document.getElementById(`calc-cat-${step.key}`);
            if (el) {
                const val = result.categories[step.key] || 0;
                el.textContent = val >= 1000 ? (val / 1000).toFixed(1) + ' t' : Math.round(val) + ' kg';
            }
        });

        this._updateGauge(result.totalTonnes);
    },

    _updateGauge(value = 0) {
        EcoTrack.Charts.gauge('calc-gauge-canvas', value, 20);
    },

    async _showResults() {
        const result = EcoTrack.CalculatorEngine.calculate(this.formData);

        // Save to Firestore/localStorage
        await EcoTrack.FirestoreService.saveCalculation(result);
        EcoTrack.Toast.success('Your carbon footprint has been calculated and saved!');

        // Render results
        const container = document.getElementById('calc-form-card');
        if (!container) return;

        const comparison = result.comparison;
        const compClass = comparison.vsNational < 0 ? 'below' : 'above';
        const compText = comparison.vsNational < 0
            ? `${Math.abs(comparison.vsNationalPct)}% below national average`
            : `${comparison.vsNationalPct}% above national average`;

        container.innerHTML = `
            <div class="results-section">
                <div class="results-header">
                    <span class="section-label">Your Results</span>
                    <h2>Your Annual Carbon Footprint</h2>
                    <div class="results-total">
                        <span class="gradient-text">${result.totalTonnes}</span>
                        <span class="unit"> tonnes CO₂e/year</span>
                    </div>
                    <div class="results-comparison ${compClass}">
                        ${compClass === 'below' ? '↓' : '↑'} ${compText}
                    </div>
                    <div class="flex justify-center gap-3 mt-6">
                        <div class="eco-badge eco-badge-${result.ecoScore.grade.charAt(0).toLowerCase()}" style="width: 64px; height: 64px; font-size: var(--fs-2xl);">
                            ${result.ecoScore.grade}
                        </div>
                    </div>
                    <p class="mt-2" style="color: ${result.ecoScore.color}">${result.ecoScore.label}</p>
                </div>
                
                <div class="grid grid-2 mt-8">
                    <div class="card" style="padding: var(--space-6);">
                        <h4 style="margin-bottom: var(--space-4);">Category Breakdown</h4>
                        <div style="height: 260px; position: relative;">
                            <canvas id="results-doughnut"></canvas>
                        </div>
                    </div>
                    <div class="card" style="padding: var(--space-6);">
                        <h4 style="margin-bottom: var(--space-4);">How You Compare</h4>
                        <div style="height: 260px; position: relative;">
                            <canvas id="results-comparison"></canvas>
                        </div>
                    </div>
                </div>

                <div class="mt-8">
                    ${EcoTrack.Cards.impactTranslator(result.totalTonnes * 1000)}
                </div>

                <div class="flex justify-center gap-4 mt-8">
                    <a href="#dashboard" class="btn btn-primary btn-lg">📊 View Dashboard</a>
                    <a href="#actions" class="btn btn-secondary btn-lg">🎯 See Action Plans</a>
                    <button class="btn btn-ghost btn-lg" id="results-recalculate">🔄 Recalculate</button>
                </div>
            </div>
        `;

        // Render charts
        setTimeout(() => {
            EcoTrack.Charts.doughnut('results-doughnut', {
                labels: ['Transport', 'Food & Diet', 'Home Energy', 'Shopping'],
                values: [
                    result.categories.transport,
                    result.categories.food,
                    result.categories.energy,
                    result.categories.shopping
                ],
                colors: ['#00d47e', '#00b4d8', '#ffd60a', '#a78bfa']
            });

            EcoTrack.Charts.bar('results-comparison', {
                labels: ['You', 'National Avg', 'Global Avg', '2030 Target'],
                values: [result.totalTonnes, comparison.nationalAvg, comparison.globalAvg, 2.9],
                colors: [result.ecoScore.color, '#8fad9a', '#5a7d6a', '#00d47e']
            });
        }, 100);

        // Recalculate button
        document.getElementById('results-recalculate')?.addEventListener('click', () => {
            window.location.hash = '#calculator';
        });
    }
};

window.EcoTrack = EcoTrack;
