/**
 * EcoTrack — Card Components
 */
var EcoTrack = window.EcoTrack || {};

EcoTrack.Cards = {
    stat(value, label, icon, colorClass = '') {
        return `
            <div class="card stat-card animate-fade-in-up">
                <div class="card-icon ${colorClass ? 'icon-' + colorClass : ''}">${icon}</div>
                <div class="stat-value ${colorClass}">${value}</div>
                <div class="stat-label">${label}</div>
            </div>`;
    },

    feature(icon, title, description, iconClass = '') {
        return `
            <div class="card feature-card animate-fade-in-up">
                <div class="card-icon ${iconClass}">${icon}</div>
                <h3>${title}</h3>
                <p>${description}</p>
            </div>`;
    },

    action(rec, isAdopted = false) {
        const difficultyBadge = {
            easy: '<span class="badge badge-primary">Easy</span>',
            medium: '<span class="badge badge-warning">Medium</span>',
            hard: '<span class="badge badge-danger">Hard</span>'
        };

        const costBadge = {
            saves: '<span class="badge badge-primary">💰 Saves Money</span>',
            neutral: '<span class="badge badge-secondary">💲 Cost Neutral</span>',
            investment: '<span class="badge badge-warning">📈 Investment</span>'
        };

        return `
            <div class="card action-card ${isAdopted ? 'adopted' : ''}" data-action-id="${rec.id}">
                <div class="action-icon" style="background: ${isAdopted ? 'rgba(0, 212, 126, 0.2)' : 'rgba(255, 255, 255, 0.05)'}">
                    ${rec.icon}
                </div>
                <div class="action-content">
                    <h4>${rec.title}</h4>
                    <p>${rec.description}</p>
                    <div class="action-meta">
                        <span class="action-savings">-${rec.annualSavingsKg.toLocaleString()} kg CO₂/yr</span>
                        ${difficultyBadge[rec.difficulty] || ''}
                        ${costBadge[rec.costIndicator] || ''}
                    </div>
                    ${rec.costNote ? `<small class="text-muted mt-2" style="display:block">${rec.costNote}</small>` : ''}
                </div>
                <div class="action-toggle">
                    <label class="toggle-switch">
                        <input type="checkbox" ${isAdopted ? 'checked' : ''} 
                               data-action-toggle="${rec.id}" 
                               aria-label="Adopt: ${rec.title}">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>`;
    },

    offset(project) {
        const gradients = {
            reforestation: 'linear-gradient(135deg, #0a2e1a, #1a4a2e)',
            renewable: 'linear-gradient(135deg, #1a2e3d, #0a1e2d)',
            ocean: 'linear-gradient(135deg, #0a1e2e, #1a3e4e)',
            community: 'linear-gradient(135deg, #2e2a0a, #3d3a1a)',
            technology: 'linear-gradient(135deg, #1a0a2e, #2e1a4a)'
        };

        const statsHtml = Object.entries(project.stats)
            .map(([key, val]) => `
                <div class="offset-stat">
                    <div class="offset-stat-value">${val}</div>
                    <div class="offset-stat-label">${key.replace(/([A-Z])/g, ' $1').trim()}</div>
                </div>
            `).join('');

        return `
            <div class="card offset-card animate-fade-in-up">
                <div class="offset-card-image" style="background: ${gradients[project.category] || gradients.reforestation}; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 3rem; opacity: 0.3">${project.category === 'reforestation' ? '🌳' : project.category === 'renewable' ? '⚡' : project.category === 'ocean' ? '🌊' : project.category === 'community' ? '🏘️' : '🔬'}</span>
                    <div class="offset-card-badge">
                        <span class="badge badge-primary">${project.verificationStandard}</span>
                    </div>
                </div>
                <div class="offset-card-body">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="badge badge-secondary">${project.location}</span>
                    </div>
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="offset-card-stats">
                        ${statsHtml}
                    </div>
                </div>
            </div>`;
    },

    ecoScore(activity) {
        const score = EcoTrack.EcoScores.getScore(activity.kgCO2);
        return `
            <div class="card ecoscore-item animate-fade-in-up">
                <div class="eco-badge eco-badge-${score.grade.toLowerCase()}">${score.grade}</div>
                <div class="ecoscore-info">
                    <h4>${activity.icon} ${activity.name}</h4>
                    <p>${activity.description}</p>
                </div>
                <div class="ecoscore-value">
                    <div class="ecoscore-kg" style="color: ${score.color}">${activity.kgCO2 < 0.01 ? '~0' : activity.kgCO2}</div>
                    <div class="ecoscore-unit">kg CO₂</div>
                </div>
            </div>`;
    },

    tip(icon, category, title, description, iconClass = '') {
        return `
            <div class="card tip-card animate-fade-in-up">
                <div class="card-icon ${iconClass}">${icon}</div>
                <span class="tip-category">${category}</span>
                <h4>${title}</h4>
                <p>${description}</p>
            </div>`;
    }
};

window.EcoTrack = EcoTrack;
