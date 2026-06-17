"use strict";

/**
 * EcoTrack — Authentication Service
 * Handles Firebase Anonymous Auth with localStorage fallback
 */
var EcoTrack = window.EcoTrack || {};

EcoTrack.AuthService = {
    currentUser: null,
    listeners: [],

    /**
     * Initialize authentication with Firebase or localStorage fallback
     * @returns {Promise<Object>} Authenticated user object
     */
    async init() {
        if (this._initialized) return this.currentUser;
        this._initialized = true;

        if (EcoTrack.FirebaseConfig.isOnline()) {
            const { signInAnonymously, onAuthStateChanged } = window.FirebaseModules;
            const auth = EcoTrack.FirebaseConfig.auth;

            return new Promise((resolve) => {
                onAuthStateChanged(auth, async (user) => {
                    if (user) {
                        this.currentUser = { uid: user.uid, isAnonymous: true };
                        console.log('🔐 Authenticated:', user.uid);
                    } else {
                        try {
                            const result = await signInAnonymously(auth);
                            this.currentUser = { uid: result.user.uid, isAnonymous: true };
                            console.log('🔐 Anonymous sign-in:', result.user.uid);
                        } catch (error) {
                            console.warn('Auth failed, using local mode');
                            this._useLocalAuth();
                        }
                    }
                    this._notifyListeners();
                    resolve(this.currentUser);
                });
            });
        } else {
            this._useLocalAuth();
            return this.currentUser;
        }
    },

    _useLocalAuth() {
        let localUid = localStorage.getItem('ecotrack_uid');
        if (!localUid) {
            localUid = 'local_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
            localStorage.setItem('ecotrack_uid', localUid);
        }
        this.currentUser = { uid: localUid, isAnonymous: true, isLocal: true };
        this._notifyListeners();
    },

    /**
     * Register a callback to be notified of auth state changes
     * @param {Function} callback - Called with user object on auth changes
     */
    onAuthChange(callback) {
        this.listeners.push(callback);
        if (this.currentUser) callback(this.currentUser);
    },

    _notifyListeners() {
        this.listeners.forEach(cb => cb(this.currentUser));
    },

    /**
     * Get the current user's unique ID
     * @returns {string|null} User ID or null if not authenticated
     */
    getUid() {
        return this.currentUser?.uid || null;
    },

    /**
     * Check if the user is currently authenticated
     * @returns {boolean} True if authenticated
     */
    isAuthenticated() {
        return this.currentUser !== null;
    }
};

window.EcoTrack = EcoTrack;
