/**
 * EcoTrack — Calculator Page
 * Multi-step carbon footprint calculator
 */
const EcoTrack = window.EcoTrack || {};
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
            <div class="form-group">
                <label class="form-label">How do you primarily commute?</label>
                <div class="radio-group">
                    ${['car', 'publicTransit', 'bicycle', 'walk', 'remote'].map(opt => `
                        <div class="radio-option">
                            <input type="radio" name="primaryCommute" value="${opt}" id="commute-${opt}" ${d.primaryCommute === opt ? 'checked' : ''}>
                            <label for="commute-${opt}">${{car:'🚗 Car', publicTransit:'🚌 Public Transit', bicycle:'🚲 Bicycle', walk:'🚶 Walk', remote:'🏠 Remote'}[opt]}</label>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Annual driving distance (km)</label>
                <div class="range-slider">
                    <input type="range" name="annualKm" min="0" max="50000" step="500" value="${d.annualKm || 10000}" id="calc-annual-km">
                    <div class="range-value" id="km-display">${(d.annualKm || 10000).toLocaleString()} km</div>
                    <div class="range-labels"><span>0 km</span><span>50,000 km</span></div>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Number of flights per year</label>
                <select class="form-select" name="flightsPerYear" id="calc-flights">
                    ${[0,1,2,3,4,5,6,7,8,9,10].map(n => `<option value="${n}" ${d.flightsPerYear == n ? 'selected' : ''}>${n}${n === 10 ? '+' : ''} flights</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Vehicle type (if driving)</label>
                <div class="radio-group">
                    ${['petrol', 'diesel', 'hybrid', 'electric', 'none'].map(opt => `
                        <div class="radio-option">
                            <input type="radio" name="vehicleType" value="${opt}" id="vehicle-${opt}" ${(d.vehicleType || 'petrol') === opt ? 'checked' : ''}>
                            <label for="vehicle-${opt}">${{petrol:'⛽ Petrol', diesel:'🛢️ Diesel', hybrid:'🔋 Hybrid', electric:'⚡ Electric', none:'❌ No Car'}[opt]}</label>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    _renderFood() {
        const d = this.formData.food;
        return `
            <h3 style="margin-bottom: var(--space-6);">🍽️ Food & Diet</h3>
            <div class="form-group">
                <label class="form-label">What best describes your diet?</label>
                <div class="radio-group">
                    ${['highMeat', 'mediumMeat', 'lowMeat', 'pescatarian', 'vegetarian', 'vegan'].map(opt => `
                        <div class="radio-option">
                            <input type="radio" name="dietType" value="${opt}" id="diet-${opt}" ${(d.dietType || 'mediumMeat') === opt ? 'checked' : ''}>
                            <label for="diet-${opt}">${{highMeat:'🥩 Heavy Meat', mediumMeat:'🍗 Moderate Meat', lowMeat:'🥓 Light Meat', pescatarian:'🐟 Pescatarian', vegetarian:'🥗 Vegetarian', vegan:'🌱 Vegan'}[opt]}</label>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">How much food do you waste?</label>
                <div class="radio-group">
                    ${['low', 'average', 'high'].map(opt => `
                        <div class="radio-option">
                            <input type="radio" name="foodWaste" value="${opt}" id="waste-${opt}" ${(d.foodWaste || 'average') === opt ? 'checked' : ''}>
                            <label for="waste-${opt}">${{low:'♻️ Minimal (compost)', average:'📦 Some Waste', high:'🗑️ Frequent Waste'}[opt]}</label>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Do you buy local & seasonal produce?</label>
                <div class="radio-group">
                    <div class="radio-option">
                        <input type="radio" name="localFood" value="true" id="local-yes" ${d.localFood ? 'checked' : ''}>
                        <label for="local-yes">🌾 Yes, mostly local</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" name="localFood" value="false" id="local-no" ${!d.localFood ? 'checked' : ''}>
                        <label for="local-no">🏪 No, mostly supermarket</label>
                    </div>
                </div>
            </div>
        `;
    },

    _renderEnergy() {
        const d = this.formData.energy;
        return `
            <h3 style="margin-bottom: var(--space-6);">⚡ Home Energy</h3>
            <div class="form-group">
                <label class="form-label">Home size</label>
                <div class="radio-group">
                    ${['small', 'medium', 'large', 'veryLarge'].map(opt => `
                        <div class="radio-option">
                            <input type="radio" name="homeSize" value="${opt}" id="home-${opt}" ${(d.homeSize || 'medium') === opt ? 'checked' : ''}>
                            <label for="home-${opt}">${{small:'🏢 Apartment', medium:'🏠 Small House', large:'🏡 Large House', veryLarge:'🏰 Very Large'}[opt]}</label>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Electricity source</label>
                <div class="radio-group">
                    ${['grid_average', 'renewable', 'coal', 'gas'].map(opt => `
                        <div class="radio-option">
                            <input type="radio" name="electricitySource" value="${opt}" id="elec-${opt}" ${(d.electricitySource || 'grid_average') === opt ? 'checked' : ''}>
                            <label for="elec-${opt}">${{grid_average:'🔌 Grid Average', renewable:'☀️ Renewable', coal:'🏭 Coal Heavy', gas:'🔥 Gas Heavy'}[opt]}</label>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Primary heating type</label>
                <div class="radio-group">
                    ${['naturalGas', 'oil', 'electric', 'heatPump', 'wood'].map(opt => `
                        <div class="radio-option">
                            <input type="radio" name="heatingType" value="${opt}" id="heat-${opt}" ${(d.heatingType || 'naturalGas') === opt ? 'checked' : ''}>
                            <label for="heat-${opt}">${{naturalGas:'🔥 Natural Gas', oil:'🛢️ Oil/Fuel', electric:'⚡ Electric', heatPump:'🔄 Heat Pump', wood:'🪵 Wood'}[opt]}</label>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Energy saving measures</label>
                <div class="radio-group">
                    <div class="checkbox-option">
                        <input type="checkbox" name="thermostatReduced" id="thermo-reduced" ${d.thermostatReduced ? 'checked' : ''}>
                        <label for="thermo-reduced">🌡️ Lowered thermostat 2°C+</label>
                    </div>
                    <div class="checkbox-option">
                        <input type="checkbox" name="goodInsulation" id="good-insulation" ${d.goodInsulation ? 'checked' : ''}>
                        <label for="good-insulation">🏗️ Good insulation</label>
                    </div>
                </div>
            </div>
        `;
    },

    _renderShopping() {
        const d = this.formData.shopping;
        return `
            <h3 style="margin-bottom: var(--space-6);">🛒 Shopping & Lifestyle</h3>
            <div class="form-group">
                <label class="form-label">Clothing buying habits</label>
                <div class="radio-group">
                    ${['fastFashion', 'sustainable', 'secondHand'].map(opt => `
                        <div class="radio-option">
                            <input type="radio" name="clothingHabit" value="${opt}" id="cloth-${opt}" ${(d.clothingHabit || 'sustainable') === opt ? 'checked' : ''}>
                            <label for="cloth-${opt}">${{fastFashion:'🛍️ Fast Fashion', sustainable:'🌱 Sustainable Brands', secondHand:'♻️ Second-Hand'}[opt]}</label>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Clothing items purchased per year</label>
                <div class="range-slider">
                    <input type="range" name="clothingItemsPerYear" min="0" max="60" step="1" value="${d.clothingItemsPerYear || 12}" id="calc-clothing-items">
                    <div class="range-value" id="clothing-display">${d.clothingItemsPerYear || 12} items</div>
                    <div class="range-labels"><span>0</span><span>60 items</span></div>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Electronics upgrade frequency</label>
                <div class="radio-group">
                    ${['frequent', 'average', 'rare'].map(opt => `
                        <div class="radio-option">
                            <input type="radio" name="electronicsFrequency" value="${opt}" id="elec-freq-${opt}" ${(d.electronicsFrequency || 'average') === opt ? 'checked' : ''}>
                            <label for="elec-freq-${opt}">${{frequent:'📱 Every 1-2 years', average:'💻 Every 2-3 years', rare:'🔧 4+ years (repair)'}[opt]}</label>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Overall spending level</label>
                <div class="radio-group">
                    ${['low', 'average', 'high'].map(opt => `
                        <div class="radio-option">
                            <input type="radio" name="spendingLevel" value="${opt}" id="spend-${opt}" ${(d.spendingLevel || 'average') === opt ? 'checked' : ''}>
                            <label for="spend-${opt}">${{low:'🧘 Minimalist', average:'⚖️ Moderate', high:'🛒 High Consumer'}[opt]}</label>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Online delivery frequency</label>
                <div class="radio-group">
                    ${['rare', 'monthly', 'weekly', 'daily'].map(opt => `
                        <div class="radio-option">
                            <input type="radio" name="deliveryFrequency" value="${opt}" id="delivery-${opt}" ${(d.deliveryFrequency || 'monthly') === opt ? 'checked' : ''}>
                            <label for="delivery-${opt}">${{rare:'📬 Rarely', monthly:'📦 Monthly', weekly:'🚚 Weekly', daily:'📫 Daily'}[opt]}</label>
                        </div>
                    `).join('')}
                </div>
            </div>
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
                        <canvas id="results-doughnut" height="260"></canvas>
                    </div>
                    <div class="card" style="padding: var(--space-6);">
                        <h4 style="margin-bottom: var(--space-4);">How You Compare</h4>
                        <canvas id="results-comparison" height="260"></canvas>
                    </div>
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
