/**
 * EcoTrack — Offset Explorer Page
 */
var EcoTrack = window.EcoTrack || {};
EcoTrack.Pages = EcoTrack.Pages || {};

EcoTrack.Pages.Offset = {
    currentFilter: 'all',

    render() {
        return `
            <div class="offset-page">
                <div class="container">
                    <div class="offset-header">
                        <span class="section-label">Carbon Offsets</span>
                        <h2>Explore <span class="gradient-text">Offset Projects</span></h2>
                        <p>Discover verified carbon offset projects around the world. Understand how offsets work and where your contribution goes.</p>
                    </div>

                    <div class="card mb-8" style="padding: var(--space-6);">
                        <h4 style="margin-bottom: var(--space-3);">💡 What are Carbon Offsets?</h4>
                        <p>${EcoTrack.OffsetProjects.educationalContent.whatAreOffsets}</p>
                        <div class="accordion-item mt-4" id="offset-how-accordion">
                            <button class="accordion-header" aria-expanded="false">
                                How do offsets work?
                                <span class="accordion-icon">▼</span>
                            </button>
                            <div class="accordion-body">
                                <div class="accordion-content">
                                    ${EcoTrack.OffsetProjects.educationalContent.howTheyWork}
                                    <div class="mt-4">
                                        <h5 style="margin-bottom: var(--space-2);">Key Tips:</h5>
                                        <ul style="list-style: none; display: flex; flex-direction: column; gap: var(--space-2);">
                                            ${EcoTrack.OffsetProjects.educationalContent.tips.map(tip => `<li>✅ ${tip}</li>`).join('')}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="offset-filters" id="offset-filters">
                        ${EcoTrack.OffsetProjects.categories.map(cat => `
                            <button class="tag ${cat.id === 'all' ? 'active' : ''}" data-category="${cat.id}">
                                ${cat.icon} ${cat.label}
                            </button>
                        `).join('')}
                    </div>

                    <div class="offset-grid" id="offset-grid">
                        ${EcoTrack.OffsetProjects.projects.map(p => EcoTrack.Cards.offset(p)).join('')}
                    </div>

                    <div class="card mt-8" style="padding: var(--space-6);">
                        <h4 style="margin-bottom: var(--space-4);">📋 Verification Standards</h4>
                        <div class="grid grid-2 gap-4">
                            ${Object.entries(EcoTrack.OffsetProjects.educationalContent.verificationStandards).map(([name, desc]) => `
                                <div class="card card-flat" style="padding: var(--space-4);">
                                    <h5 style="margin-bottom: var(--space-2); color: var(--accent-primary);">${name}</h5>
                                    <p style="font-size: var(--fs-sm);">${desc}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        this._bindFilters();
        this._bindAccordion();
    },

    _bindFilters() {
        document.querySelectorAll('#offset-filters .tag').forEach(tag => {
            tag.addEventListener('click', () => {
                document.querySelectorAll('#offset-filters .tag').forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                this.currentFilter = tag.dataset.category;

                const projects = EcoTrack.OffsetProjects.getByCategory(this.currentFilter);
                const grid = document.getElementById('offset-grid');
                if (grid) {
                    grid.innerHTML = projects.map(p => EcoTrack.Cards.offset(p)).join('');
                }
            });
        });
    },

    _bindAccordion() {
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                const item = header.closest('.accordion-item');
                if (item) {
                    item.classList.toggle('open');
                    header.setAttribute('aria-expanded', item.classList.contains('open'));
                }
            });
        });
    }
};

window.EcoTrack = EcoTrack;
