/**
 * EcoTrack — Dashboard Page
 */
var EcoTrack = window.EcoTrack || {};
EcoTrack.Pages = EcoTrack.Pages || {};

EcoTrack.Pages.Dashboard = {
    render() {
        return `
            <div class="dashboard-page">
                <div class="container">
                    <div class="dashboard-header">
                        <span class="section-label">Impact Dashboard</span>
                        <h2>Your Carbon <span class="gradient-text">Impact Overview</span></h2>
                    </div>
                    <div id="dashboard-content">
                        <div class="empty-state" id="dashboard-empty">
                            <div class="empty-state-icon">📊</div>
                            <h3>No Data Yet</h3>
                            <p>Complete the carbon calculator first to see your personalized impact dashboard.</p>
                            <a href="#calculator" class="btn btn-primary btn-lg mt-4">🧮 Calculate Now</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    async init() {
        const data = await EcoTrack.FirestoreService.getLatestCalculation();
        if (data) {
            this._renderDashboard(data);
        }
    },

    _renderDashboard(data) {
        const content = document.getElementById('dashboard-content');
        if (!content) return;

        const ecoScore = data.ecoScore || EcoTrack.CalculatorEngine._calcEcoScore(data.totalTonnes);
        const pct = data.percentages || {};
        const cats = data.categories || {};
        const comp = data.comparison || {};

        content.innerHTML = `
            <div class="dashboard-stats">
                ${EcoTrack.Cards.stat(data.totalTonnes + 't', 'Total Footprint', '🌍', 'accent')}
                ${EcoTrack.Cards.stat(this._topCategory(pct), 'Biggest Contributor', '📊', 'warning')}
                ${EcoTrack.Cards.stat(this._potentialSavings(data) + 't', 'Potential Savings', '💡', 'secondary')}
                ${EcoTrack.Cards.stat(ecoScore.grade, 'Eco Score', '🏆', '')}
            </div>

            <div class="dashboard-charts">
                <div class="card chart-card">
                    <div class="chart-header">
                        <h4 class="chart-title">Category Breakdown</h4>
                    </div>
                    <div style="height: 300px; position: relative;">
                        <canvas id="dash-doughnut"></canvas>
                    </div>
                </div>
                <div class="card chart-card">
                    <div class="chart-header">
                        <h4 class="chart-title">How You Compare</h4>
                    </div>
                    <div style="height: 300px; position: relative;">
                        <canvas id="dash-bar"></canvas>
                    </div>
                </div>
            </div>

            <div class="dashboard-bottom">
                <div class="card chart-card">
                    <div class="chart-header">
                        <h4 class="chart-title">Monthly Progress</h4>
                        <span class="badge badge-primary">Last 6 months</span>
                    </div>
                    <div style="height: 280px; position: relative;">
                        <canvas id="dash-line"></canvas>
                    </div>
                </div>
                <div class="card" style="padding: var(--space-6);">
                    <h4 style="margin-bottom: var(--space-4);">Quick Insights</h4>
                    <div class="flex flex-col gap-4">
                        ${[
                            { key: 'transport', label: 'Transport', icon: '🚗' },
                            { key: 'food', label: 'Food & Diet', icon: '🍽️' },
                            { key: 'energy', label: 'Home Energy', icon: '⚡' },
                            { key: 'shopping', label: 'Shopping', icon: '🛒' }
                        ].map(cat => {
                            const value = cats[cat.key] || 0;
                            const percentage = pct[cat.key] || 0;
                            const badgeClass = percentage > 30 ? 'danger' : 'primary';
                            return `
                                <div class="card card-flat" style="padding: var(--space-4);">
                                    <div class="flex items-center gap-3">
                                        <span style="font-size: 1.5rem;">${cat.icon}</span>
                                        <div>
                                            <div class="stat-label">${cat.label}</div>
                                            <div style="font-weight: 600;">${Math.round(value).toLocaleString()} kg CO₂</div>
                                        </div>
                                        <span class="badge badge-${badgeClass}" style="margin-left: auto;">${percentage}%</span>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="mt-4">
                        <a href="#calculator" class="btn btn-ghost w-full">🔄 Recalculate</a>
                    </div>
                </div>
            </div>

            <div class="mt-8">
                ${EcoTrack.Cards.impactTranslator(data.totalTonnes * 1000)}
            </div>
        `;

        // Render charts after DOM update
        setTimeout(() => this._renderCharts(data), 100);
    },

    _renderCharts(data) {
        const cats = data.categories || {};
        const comp = data.comparison || {};

        EcoTrack.Charts.doughnut('dash-doughnut', {
            labels: ['Transport', 'Food & Diet', 'Home Energy', 'Shopping'],
            values: [cats.transport || 0, cats.food || 0, cats.energy || 0, cats.shopping || 0],
            colors: ['#00d47e', '#00b4d8', '#ffd60a', '#a78bfa']
        });

        EcoTrack.Charts.bar('dash-bar', {
            labels: ['You', 'National Avg', 'Global Avg', '2030 Target'],
            values: [data.totalTonnes, comp.nationalAvg || 10.4, comp.globalAvg || 4.8, 2.9],
            colors: ['#00b4d8', '#8fad9a', '#5a7d6a', '#00d47e']
        }, { horizontal: true });

        // Mock progress data (would come from multiple calculations over time)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const progressValues = this._generateProgressData(data.totalTonnes);
        EcoTrack.Charts.line('dash-line', {
            labels: months,
            values: progressValues
        });
    },

    _generateProgressData(current) {
        // Generate realistic downward trend data
        const start = current * 1.15;
        return Array.from({ length: 6 }, (_, i) => {
            const progress = i / 5;
            const noise = (Math.random() - 0.5) * 0.3;
            return Math.round((start - (start - current) * progress + noise) * 10) / 10;
        });
    },

    _topCategory(pct) {
        const entries = Object.entries(pct);
        if (entries.length === 0) return 'N/A';
        entries.sort((a, b) => b[1] - a[1]);
        const labels = { transport: 'Transport', food: 'Food', energy: 'Energy', shopping: 'Shopping' };
        return `${labels[entries[0][0]] || entries[0][0]} ${entries[0][1]}%`;
    },

    _potentialSavings(data) {
        const recs = EcoTrack.Recommendations.getPersonalized({
            total: data.total,
            categories: data.categories,
            ...data.formData
        });
        const total = EcoTrack.Recommendations.calculateTotalSavings(recs.slice(0, 5));
        return (total / 1000).toFixed(1);
    }
};

window.EcoTrack = EcoTrack;
