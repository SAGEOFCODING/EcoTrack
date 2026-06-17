"use strict";

/**
 * EcoTrack — Chart.js Wrapper Components
 * Consistent chart theming and helpers
 */
var EcoTrack = window.EcoTrack || {};

EcoTrack.Charts = {
    // Global chart defaults
    defaults: {
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
        textColor: '#8fad9a',
        gridColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        colors: ['#00d47e', '#00b4d8', '#ffd60a', '#a78bfa', '#ff6b6b', '#ff9f43'],
        gradients: {
            green: ['rgba(0, 212, 126, 0.8)', 'rgba(0, 212, 126, 0.1)'],
            teal: ['rgba(0, 180, 216, 0.8)', 'rgba(0, 180, 216, 0.1)'],
            yellow: ['rgba(255, 214, 10, 0.8)', 'rgba(255, 214, 10, 0.1)'],
            purple: ['rgba(167, 139, 250, 0.8)', 'rgba(167, 139, 250, 0.1)'],
            red: ['rgba(255, 107, 107, 0.8)', 'rgba(255, 107, 107, 0.1)']
        }
    },

    instances: {},

    init() {
        if (typeof Chart !== 'undefined') {
            Chart.defaults.font.family = this.defaults.fontFamily;
            Chart.defaults.color = this.defaults.textColor;
            Chart.defaults.borderColor = this.defaults.borderColor;
            Chart.defaults.responsive = true;
            Chart.defaults.maintainAspectRatio = false;
            Chart.defaults.plugins.legend.labels.usePointStyle = true;
            Chart.defaults.plugins.legend.labels.padding = 20;
        }
    },

    destroy(id) {
        if (this.instances[id]) {
            this.instances[id].destroy();
            delete this.instances[id];
        }
    },

    destroyAll() {
        Object.keys(this.instances).forEach(id => this.destroy(id));
    },

    _createGradient(ctx, colors) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1]);
        return gradient;
    },

    /**
     * Doughnut chart for category breakdown
     */
    doughnut(canvasId, data, options = {}) {
        this.destroy(canvasId);
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;

        const ctx = canvas.getContext('2d');
        this.instances[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: data.colors || this.defaults.colors,
                    borderWidth: 0,
                    hoverOffset: 8,
                    spacing: 2
                }]
            },
            options: {
                cutout: options.cutout || '70%',
                plugins: {
                    legend: {
                        display: options.showLegend !== false,
                        position: options.legendPosition || 'bottom',
                        labels: {
                            padding: 16,
                            font: { size: 13 }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#182922',
                        titleFont: { family: "'Sora', sans-serif", weight: '600' },
                        bodyFont: { family: "'Inter', sans-serif" },
                        padding: 12,
                        borderColor: 'rgba(0, 212, 126, 0.2)',
                        borderWidth: 1,
                        callbacks: {
                            label: (context) => {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const pct = Math.round((context.raw / total) * 100);
                                return `${context.label}: ${context.raw.toLocaleString()} kg (${pct}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 1200
                },
                ...options.chartOptions
            }
        });

        return this.instances[canvasId];
    },

    /**
     * Bar chart for comparisons
     */
    bar(canvasId, data, options = {}) {
        this.destroy(canvasId);
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;

        const ctx = canvas.getContext('2d');
        this.instances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: data.label || 'Value',
                    data: data.values,
                    backgroundColor: data.colors || this.defaults.colors.map(c => c + '99'),
                    borderColor: data.colors || this.defaults.colors,
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false,
                    barThickness: options.barThickness || 40
                }]
            },
            options: {
                indexAxis: options.horizontal ? 'y' : 'x',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#182922',
                        titleFont: { family: "'Sora', sans-serif", weight: '600' },
                        bodyFont: { family: "'Inter', sans-serif" },
                        padding: 12,
                        borderColor: 'rgba(0, 212, 126, 0.2)',
                        borderWidth: 1,
                        callbacks: {
                            label: (ctx) => `${ctx.raw.toFixed(1)} tonnes CO₂/yr`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: this.defaults.gridColor, drawBorder: false },
                        ticks: { font: { size: 12 } }
                    },
                    y: {
                        grid: { color: this.defaults.gridColor, drawBorder: false },
                        ticks: { font: { size: 12 } },
                        beginAtZero: true
                    }
                },
                animation: { duration: 1000 },
                ...options.chartOptions
            }
        });

        return this.instances[canvasId];
    },

    /**
     * Line chart for progress tracking
     */
    line(canvasId, data, options = {}) {
        this.destroy(canvasId);
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;

        const ctx = canvas.getContext('2d');
        const gradient = this._createGradient(ctx, this.defaults.gradients.green);

        this.instances[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: data.label || 'CO₂ Emissions',
                    data: data.values,
                    borderColor: '#00d47e',
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#00d47e',
                    pointBorderColor: '#0a0f0d',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 8
                }]
            },
            options: {
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#182922',
                        titleFont: { family: "'Sora', sans-serif", weight: '600' },
                        bodyFont: { family: "'Inter', sans-serif" },
                        padding: 12,
                        borderColor: 'rgba(0, 212, 126, 0.2)',
                        borderWidth: 1,
                        callbacks: {
                            label: (ctx) => `${ctx.raw.toFixed(1)} tonnes CO₂`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: this.defaults.gridColor, drawBorder: false },
                        ticks: { font: { size: 12 } }
                    },
                    y: {
                        grid: { color: this.defaults.gridColor, drawBorder: false },
                        ticks: { font: { size: 12 }, callback: (v) => v + 't' },
                        beginAtZero: false
                    }
                },
                animation: { duration: 1500 },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                ...options.chartOptions
            }
        });

        return this.instances[canvasId];
    },

    /**
     * Semi-circle gauge chart
     */
    gauge(canvasId, value, max, options = {}) {
        this.destroy(canvasId);
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;

        const ctx = canvas.getContext('2d');
        const pct = Math.min(value / max, 1);

        // Determine color based on value
        let color = '#00d47e';
        if (pct > 0.75) color = '#ff6b6b';
        else if (pct > 0.5) color = '#ffd60a';
        else if (pct > 0.25) color = '#00b4d8';

        this.instances[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [value, Math.max(0, max - value)],
                    backgroundColor: [color, 'rgba(255,255,255,0.05)'],
                    borderWidth: 0,
                    circumference: 270,
                    rotation: 225
                }]
            },
            options: {
                cutout: '80%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                animation: { duration: 1500 }
            }
        });

        return this.instances[canvasId];
    }
};

window.EcoTrack = EcoTrack;
