"use strict";

/**
 * EcoTrack — Form Component Helpers
 * DRYs out HTML template logic for forms
 */
var EcoTrack = window.EcoTrack || {};

EcoTrack.Forms = {
    /**
     * Generates a radio button group
     * @param {string} label - The question label
     * @param {string} name - The input name attribute
     * @param {string} currentValue - The currently selected value
     * @param {Array<{value: string, label: string}>} options - Array of options
     */
    radioGroup(label, name, currentValue, options) {
        const optionHtml = options.map(opt => `
            <div class="radio-option">
                <input type="radio" name="${name}" value="${opt.value}" id="${name}-${opt.value}" ${currentValue === opt.value ? 'checked' : ''}>
                <label for="${name}-${opt.value}">${opt.label}</label>
            </div>
        `).join('');

        return `
            <div class="form-group">
                <label class="form-label">${label}</label>
                <div class="radio-group">
                    ${optionHtml}
                </div>
            </div>
        `;
    },

    /**
     * Generates a range slider
     */
    rangeSlider(label, name, min, max, step, currentValue, displaySuffix) {
        return `
            <div class="form-group">
                <label class="form-label">${label}</label>
                <div class="range-slider">
                    <input type="range" name="${name}" min="${min}" max="${max}" step="${step}" value="${currentValue}" id="${name}-slider">
                    <div class="range-value" id="${name}-display">${currentValue.toLocaleString()} ${displaySuffix}</div>
                    <div class="range-labels"><span>${min} ${displaySuffix}</span><span>${max.toLocaleString()} ${displaySuffix}</span></div>
                </div>
            </div>
        `;
    },

    /**
     * Generates a standard dropdown select
     */
    select(label, name, currentValue, options) {
        const optionHtml = options.map(opt => `
            <option value="${opt.value}" ${currentValue == opt.value ? 'selected' : ''}>${opt.label}</option>
        `).join('');

        return `
            <div class="form-group">
                <label class="form-label">${label}</label>
                <select class="form-select" name="${name}" id="${name}-select">
                    ${optionHtml}
                </select>
            </div>
        `;
    },

    /**
     * Generates a checkbox group
     */
    checkboxGroup(label, options) {
        const optionHtml = options.map(opt => `
            <div class="checkbox-option">
                <input type="checkbox" name="${opt.name}" id="checkbox-${opt.name}" ${opt.checked ? 'checked' : ''}>
                <label for="checkbox-${opt.name}">${opt.label}</label>
            </div>
        `).join('');

        return `
            <div class="form-group">
                <label class="form-label">${label}</label>
                <div class="radio-group">
                    ${optionHtml}
                </div>
            </div>
        `;
    }
};

window.EcoTrack = EcoTrack;
