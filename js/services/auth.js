/**
 * EcoTrack — Authentication Service
 * Handles Firebase Anonymous Auth with localStorage fallback
 */
const EcoTrack = window.EcoTrack || {};

EcoTrack.AuthService = {
    currentUser: null,
    listeners: [],

    async init() {
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

    onAuthChange(callback) {
        this.listeners.push(callback);
        if (this.currentUser) callback(this.currentUser);
    },

    _notifyListeners() {
        this.listeners.forEach(cb => cb(this.currentUser));
    },

    getUid() {
        return this.currentUser?.uid || null;
    },

    isAuthenticated() {
        return this.currentUser !== null;
    }
};

window.EcoTrack = EcoTrack;
