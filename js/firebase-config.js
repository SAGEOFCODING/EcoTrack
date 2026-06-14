/**
 * EcoTrack — Firebase Configuration
 * Handles Firebase app initialization
 */
const EcoTrack = window.EcoTrack || {};

EcoTrack.FirebaseConfig = {
    app: null,
    auth: null,
    db: null,
    initialized: false,

    // Firebase config - will be populated after web app creation
    config: {
        apiKey: "AIzaSyBmscrqkDZjuuxsIFN2prYZV2ry_KgfeGo",
        authDomain: "ecotrack-carbon-app.firebaseapp.com",
        projectId: "ecotrack-carbon-app",
        storageBucket: "ecotrack-carbon-app.firebasestorage.app",
        messagingSenderId: "580500275426",
        appId: "1:580500275426:web:8c8cd7ba147814c2869ebb"
    },

    async init() {
        if (this.initialized) return;

        try {
            // Wait for Firebase modules to load
            if (!window.FirebaseModules) {
                await new Promise((resolve, reject) => {
                    if (window.FirebaseModules) {
                        resolve();
                    } else {
                        window.addEventListener('firebase-ready', resolve, { once: true });
                        setTimeout(() => reject(new Error('Firebase load timeout')), 3000);
                    }
                });
            }

            const { initializeApp, getAuth, getFirestore } = window.FirebaseModules;

            // Only initialize if we have a valid config
            if (this.config.apiKey) {
                this.app = initializeApp(this.config);
                this.auth = getAuth(this.app);
                this.db = getFirestore(this.app);
                this.initialized = true;
                console.log('🔥 Firebase initialized successfully');
            } else {
                console.warn('⚠️ Firebase config not set. Running in offline mode with localStorage.');
                this.initialized = false;
            }
        } catch (error) {
            console.warn('⚠️ Firebase initialization failed. Running in offline mode.', error);
            this.initialized = false;
        }
    },

    isOnline() {
        return this.initialized && this.app !== null;
    }
};

window.EcoTrack = EcoTrack;
