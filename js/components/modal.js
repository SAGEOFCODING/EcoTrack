"use strict";

/**
 * EcoTrack — Modal & Toast Components
 */
var EcoTrack = window.EcoTrack || {};

EcoTrack.Modal = {
    open(content, options = {}) {
        const overlay = document.getElementById('modal-overlay');
        const container = document.getElementById('modal-content');
        if (!overlay || !container) return;

        container.innerHTML = `
            <div class="modal-header flex justify-between items-center mb-6">
                <h3 id="modal-title">${options.title || ''}</h3>
                <button class="btn btn-icon btn-ghost" id="modal-close" aria-label="Close modal">✕</button>
            </div>
            <div class="modal-body" id="modal-body-desc">${content}</div>
            ${options.footer ? `<div class="modal-footer mt-6 flex justify-end gap-3">${options.footer}</div>` : ''}
        `;

        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        overlay.setAttribute('aria-labelledby', 'modal-title');
        overlay.setAttribute('aria-describedby', 'modal-body-desc');
        overlay.setAttribute('tabindex', '-1');

        // Close handlers
        document.getElementById('modal-close')?.addEventListener('click', () => this.close());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.close();
        });

        // ESC key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                this.close();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // Trap focus
        document.body.style.overflow = 'hidden';
    },

    close() {
        const overlay = document.getElementById('modal-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            overlay.setAttribute('aria-hidden', 'true');
        }
        document.body.style.overflow = '';
    }
};

EcoTrack.Toast = {
    show(message, type = 'info', duration = 4000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${message}</span>
        `;
        toast.setAttribute('role', 'alert');

        container.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto-remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    success(message) { this.show(message, 'success'); },
    error(message) { this.show(message, 'error'); },
    warning(message) { this.show(message, 'warning'); },
    info(message) { this.show(message, 'info'); }
};

window.EcoTrack = EcoTrack;
