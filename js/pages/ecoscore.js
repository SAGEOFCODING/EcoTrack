"use strict";

/**
 * EcoTrack — Eco-Score Page
 */
var EcoTrack = window.EcoTrack || {};
EcoTrack.Pages = EcoTrack.Pages || {};

EcoTrack.Pages.EcoScore = {
    currentCategory: 'all',
    compareItem1: null,
    compareItem2: null,

    render() {
        return `
            <div class="ecoscore-page">
                <div class="container">
                    <div class="ecoscore-header">
                        <span class="section-label">Eco-Score</span>
                        <h2>Rate Your <span class="gradient-text">Daily Activities</span></h2>
                        <p>Every activity has a carbon cost. Search, browse, and compare everyday choices on our A-F scale.</p>
                    </div>

                    <div class="ecoscore-search">
                        <div class="search-box">
                            <span class="search-icon">🔍</span>
                            <input type="text" id="ecoscore-search-input" placeholder="Search activities (e.g., 'beef burger', 'cycling')..." aria-label="Search eco-score activities">
                        </div>
                    </div>

                    <div class="ecoscore-categories" id="ecoscore-categories">
                        ${EcoTrack.EcoScores.categories.map(cat => `
                            <button class="tag ${cat.id === 'all' ? 'active' : ''}" data-category="${cat.id}">
                                ${cat.icon} ${cat.label}
                            </button>
                        `).join('')}
                    </div>

                    <div class="ecoscore-grid" id="ecoscore-grid">
                        ${this._renderActivities(EcoTrack.EcoScores.activities)}
                    </div>

                    <div class="comparison-section">
                        <div class="section-header mt-8" style="text-align: left;">
                            <span class="section-label">This vs. That</span>
                            <h3>Compare Activities <span class="gradient-text">Side by Side</span></h3>
                        </div>
                        <div class="comparison-selectors">
                            <div class="form-group">
                                <label class="form-label">Activity 1</label>
                                <select class="form-select" id="compare-select-1">
                                    <option value="">Select an activity...</option>
                                    ${EcoTrack.EcoScores.activities.map(a => `<option value="${a.id}">${a.icon} ${a.name}</option>`).join('')}
                                </select>
                            </div>
                            <div class="comparison-vs">VS</div>
                            <div class="form-group">
                                <label class="form-label">Activity 2</label>
                                <select class="form-select" id="compare-select-2">
                                    <option value="">Select an activity...</option>
                                    ${EcoTrack.EcoScores.activities.map(a => `<option value="${a.id}">${a.icon} ${a.name}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        <div id="comparison-result"></div>
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        this._bindSearch();
        this._bindCategories();
        this._bindComparison();
    },

    _renderActivities(activities) {
        if (activities.length === 0) {
            return `<div class="empty-state"><div class="empty-state-icon">🔍</div><h3>No Results</h3><p>Try a different search term.</p></div>`;
        }
        return activities.map(a => EcoTrack.Cards.ecoScore(a)).join('');
    },

    _bindSearch() {
        const input = document.getElementById('ecoscore-search-input');
        if (!input) return;

        let debounceTimer;
        input.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const query = e.target.value.trim();
                const results = query
                    ? EcoTrack.EcoScores.search(query)
                    : EcoTrack.EcoScores.getByCategory(this.currentCategory);

                const grid = document.getElementById('ecoscore-grid');
                if (grid) grid.innerHTML = this._renderActivities(results);
            }, 300);
        });
    },

    _bindCategories() {
        document.querySelectorAll('#ecoscore-categories .tag').forEach(tag => {
            tag.addEventListener('click', () => {
                document.querySelectorAll('#ecoscore-categories .tag').forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                this.currentCategory = tag.dataset.category;

                const results = EcoTrack.EcoScores.getByCategory(this.currentCategory);
                const grid = document.getElementById('ecoscore-grid');
                if (grid) grid.innerHTML = this._renderActivities(results);

                // Clear search
                const input = document.getElementById('ecoscore-search-input');
                if (input) input.value = '';
            });
        });
    },

    _bindComparison() {
        const select1 = document.getElementById('compare-select-1');
        const select2 = document.getElementById('compare-select-2');

        const updateComparison = () => {
            const id1 = select1?.value;
            const id2 = select2?.value;
            if (!id1 || !id2) return;

            const result = EcoTrack.EcoScores.compare(id1, id2);
            if (!result) return;

            const container = document.getElementById('comparison-result');
            if (!container) return;

            const score1 = EcoTrack.EcoScores.getScore(result.item1.kgCO2);
            const score2 = EcoTrack.EcoScores.getScore(result.item2.kgCO2);

            container.innerHTML = `
                <div class="card comparison-results animate-scale-in">
                    <div class="comparison-card">
                        <div class="comparison-item">
                            <div class="eco-badge eco-badge-${score1.grade.toLowerCase()}" style="margin: 0 auto var(--space-3);">${score1.grade}</div>
                            <div class="comparison-item-name">${result.item1.icon} ${result.item1.name}</div>
                            <div class="comparison-item-value" style="color: ${score1.color}">
                                ${result.item1.kgCO2} <span class="comparison-item-unit">kg CO₂</span>
                            </div>
                        </div>
                        <div class="comparison-vs">VS</div>
                        <div class="comparison-item">
                            <div class="eco-badge eco-badge-${score2.grade.toLowerCase()}" style="margin: 0 auto var(--space-3);">${score2.grade}</div>
                            <div class="comparison-item-name">${result.item2.icon} ${result.item2.name}</div>
                            <div class="comparison-item-value" style="color: ${score2.color}">
                                ${result.item2.kgCO2} <span class="comparison-item-unit">kg CO₂</span>
                            </div>
                        </div>
                    </div>
                    <hr class="divider">
                    <div class="comparison-winner">
                        ${result.winner.icon} <span class="text-accent">${result.winner.name}</span> wins!
                    </div>
                    <p>${result.loser.name} produces <span class="comparison-diff text-danger">${result.timesMore}x</span> more CO₂</p>
                    <p class="text-muted mt-2">Difference: ${result.diffKg.toFixed(2)} kg CO₂ (${result.diffPercent}%)</p>
                </div>
            `;
        };

        select1?.addEventListener('change', updateComparison);
        select2?.addEventListener('change', updateComparison);
    }
};

window.EcoTrack = EcoTrack;
