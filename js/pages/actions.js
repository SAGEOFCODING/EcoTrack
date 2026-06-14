/**
 * EcoTrack — Action Plans Page
 */
var EcoTrack = window.EcoTrack || {};
EcoTrack.Pages = EcoTrack.Pages || {};

EcoTrack.Pages.Actions = {
    adoptedActions: {},

    render() {
        return `
            <div class="actions-page">
                <div class="container">
                    <div class="actions-header">
                        <span class="section-label">Personalized Action Plans</span>
                        <h2>Your Path to <span class="gradient-text">Lower Emissions</span></h2>
                        <p>Smart recommendations tailored to your footprint profile, sorted by impact.</p>
                    </div>
                    <div id="actions-content">
                        <div class="empty-state" id="actions-empty">
                            <div class="empty-state-icon">🎯</div>
                            <h3>Calculate First</h3>
                            <p>Complete the carbon calculator to receive personalized action recommendations based on your unique profile.</p>
                            <a href="#calculator" class="btn btn-primary btn-lg mt-4">🧮 Calculate Now</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    async init() {
        this.adoptedActions = await EcoTrack.FirestoreService.getAdoptedActions();
        const data = await EcoTrack.FirestoreService.getLatestCalculation();
        if (data) {
            this._renderActions(data);
        }
    },

    _renderBanner(adoptedCount, adoptedSavings) {
        if (adoptedSavings <= 0) return '';
        return `
            <div class="card card-glow mb-6" style="padding: var(--space-5);">
                <div class="flex items-center gap-4">
                    <span style="font-size: 2rem;">🎉</span>
                    <div>
                        <h4>You're making a difference!</h4>
                        <p>By adopting ${adoptedCount} action${adoptedCount !== 1 ? 's' : ''}, you could save up to <strong class="text-accent">${(adoptedSavings / 1000).toFixed(1)} tonnes CO₂</strong> per year.</p>
                    </div>
                </div>
            </div>
        `;
    },

    _renderActions(data) {
        const content = document.getElementById('actions-content');
        if (!content) return;

        const recommendations = EcoTrack.Recommendations.getPersonalized({
            total: data.total,
            categories: data.categories,
            ...data.formData
        });

        const adoptedCount = Object.keys(this.adoptedActions).length;
        const totalSavings = EcoTrack.Recommendations.calculateTotalSavings(recommendations);
        const adoptedSavings = recommendations
            .filter(r => this.adoptedActions[r.id])
            .reduce((sum, r) => sum + r.annualSavingsKg, 0);

        content.innerHTML = `
            <div class="actions-summary">
                ${EcoTrack.Cards.stat(recommendations.length, 'Recommendations', '🎯', 'accent')}
                <div id="adopted-count-wrapper">
                    ${EcoTrack.Cards.stat(adoptedCount, 'Actions Adopted', '✅', 'secondary')}
                </div>
                ${EcoTrack.Cards.stat((totalSavings / 1000).toFixed(1) + 't', 'Potential Savings', '💡', 'warning')}
            </div>

            <div id="actions-banner-container">
                ${this._renderBanner(adoptedCount, adoptedSavings)}
            </div>

            <div class="tabs mb-6" id="actions-tabs">
                <button class="tab-btn active" data-filter="all">All</button>
                <button class="tab-btn" data-filter="transport">🚗 Transport</button>
                <button class="tab-btn" data-filter="food">🍽️ Food</button>
                <button class="tab-btn" data-filter="energy">⚡ Energy</button>
                <button class="tab-btn" data-filter="shopping">🛒 Shopping</button>
            </div>

            <div class="action-list" id="action-list">
                ${recommendations.map(rec => EcoTrack.Cards.action(rec, !!this.adoptedActions[rec.id])).join('')}
            </div>
        `;

        this._bindToggle(recommendations);
        this._bindFilters(recommendations);
    },

    _bindToggle(recommendations) {
        document.querySelectorAll('[data-action-toggle]').forEach(toggle => {
            toggle.addEventListener('change', async (e) => {
                const actionId = e.target.dataset.actionToggle;
                const adopted = e.target.checked;

                await EcoTrack.FirestoreService.saveAction(actionId, adopted);

                if (adopted) {
                    this.adoptedActions[actionId] = { adopted: true };
                    e.target.closest('.action-card')?.classList.add('adopted');
                    EcoTrack.Toast.success('Action adopted! 🌱');
                } else {
                    delete this.adoptedActions[actionId];
                    e.target.closest('.action-card')?.classList.remove('adopted');
                    EcoTrack.Toast.info('Action removed');
                }

                // Update summary stats & banner dynamically
                const adoptedCount = Object.keys(this.adoptedActions).length;
                const adoptedSavings = recommendations
                    .filter(r => this.adoptedActions[r.id])
                    .reduce((sum, r) => sum + r.annualSavingsKg, 0);

                const countWrapper = document.getElementById('adopted-count-wrapper');
                if (countWrapper) {
                    countWrapper.innerHTML = EcoTrack.Cards.stat(adoptedCount, 'Actions Adopted', '✅', 'secondary');
                }

                const bannerContainer = document.getElementById('actions-banner-container');
                if (bannerContainer) {
                    bannerContainer.innerHTML = this._renderBanner(adoptedCount, adoptedSavings);
                }
            });
        });
    },

    _bindFilters(recommendations) {
        document.querySelectorAll('#actions-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#actions-tabs .tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;
                const filtered = filter === 'all'
                    ? recommendations
                    : recommendations.filter(r => r.category === filter);

                const list = document.getElementById('action-list');
                if (list) {
                    list.innerHTML = filtered.map(rec =>
                        EcoTrack.Cards.action(rec, !!this.adoptedActions[rec.id])
                    ).join('');
                    this._bindToggle(filtered);
                }
            });
        });
    }
};

window.EcoTrack = EcoTrack;
