/**
 * EcoTrack — Firestore Service
 * Handles all data persistence with localStorage fallback
 */
var EcoTrack = window.EcoTrack || {};

EcoTrack.FirestoreService = {
    _getStorageKey(path) {
        const uid = EcoTrack.AuthService.getUid();
        return `ecotrack_${uid}_${path}`;
    },

    // Save calculation results
    async saveCalculation(data) {
        const uid = EcoTrack.AuthService.getUid();
        if (!uid) return null;

        const calculation = {
            ...data,
            date: new Date().toISOString(),
            timestamp: Date.now()
        };

        if (EcoTrack.FirebaseConfig.isOnline()) {
            try {
                const { doc, setDoc, collection, addDoc, serverTimestamp } = window.FirebaseModules;
                const db = EcoTrack.FirebaseConfig.db;

                // Save to user's calculations collection
                const calcRef = await addDoc(
                    collection(db, 'users', uid, 'calculations'),
                    { ...calculation, date: serverTimestamp() }
                );

                // Update user profile
                await setDoc(doc(db, 'users', uid, 'profile', 'info'), {
                    lastCalculation: serverTimestamp(),
                    totalCalculations: (await this._getCalcCount()) + 1
                }, { merge: true });

                calculation.id = calcRef.id;
            } catch (error) {
                console.warn('Firestore save failed, using localStorage', error);
                this._saveLocal(calculation);
            }
        } else {
            this._saveLocal(calculation);
        }

        return calculation;
    },

    _saveLocal(calculation) {
        const key = this._getStorageKey('calculations');
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        calculation.id = 'local_' + Date.now();
        existing.push(calculation);
        localStorage.setItem(key, JSON.stringify(existing));

        // Also save as latest
        localStorage.setItem(this._getStorageKey('latestCalc'), JSON.stringify(calculation));
    },

    async _getCalcCount() {
        const calcs = await this.getCalculations();
        return calcs.length;
    },

    // Get all calculations
    async getCalculations() {
        const uid = EcoTrack.AuthService.getUid();
        if (!uid) return [];

        if (EcoTrack.FirebaseConfig.isOnline()) {
            try {
                const { collection, getDocs, query, orderBy } = window.FirebaseModules;
                const db = EcoTrack.FirebaseConfig.db;

                const q = query(
                    collection(db, 'users', uid, 'calculations'),
                    orderBy('timestamp', 'desc')
                );
                const snapshot = await getDocs(q);
                return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            } catch (error) {
                console.warn('Firestore read failed, using localStorage', error);
            }
        }

        const key = this._getStorageKey('calculations');
        return JSON.parse(localStorage.getItem(key) || '[]').reverse();
    },

    // Get latest calculation
    async getLatestCalculation() {
        const uid = EcoTrack.AuthService.getUid();
        if (!uid) return null;

        if (EcoTrack.FirebaseConfig.isOnline()) {
            try {
                const { collection, getDocs, query, orderBy, limit } = window.FirebaseModules;
                const db = EcoTrack.FirebaseConfig.db;

                const q = query(
                    collection(db, 'users', uid, 'calculations'),
                    orderBy('timestamp', 'desc'),
                    limit(1)
                );
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    const doc = snapshot.docs[0];
                    return { id: doc.id, ...doc.data() };
                }
                return null;
            } catch (error) {
                console.warn('Firestore read failed, using localStorage', error);
            }
        }

        const key = this._getStorageKey('latestCalc');
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : null;
    },

    // Save adopted actions
    async saveAction(actionId, adopted) {
        const uid = EcoTrack.AuthService.getUid();
        if (!uid) return;

        const actionData = {
            actionId,
            adopted,
            date: new Date().toISOString(),
            timestamp: Date.now()
        };

        if (EcoTrack.FirebaseConfig.isOnline()) {
            try {
                const { doc, setDoc } = window.FirebaseModules;
                const db = EcoTrack.FirebaseConfig.db;
                await setDoc(
                    doc(db, 'users', uid, 'actions', actionId),
                    actionData,
                    { merge: true }
                );
            } catch (error) {
                console.warn('Firestore save failed, using localStorage', error);
                this._saveActionLocal(actionData);
            }
        } else {
            this._saveActionLocal(actionData);
        }
    },

    _saveActionLocal(actionData) {
        const key = this._getStorageKey('actions');
        const existing = JSON.parse(localStorage.getItem(key) || '{}');
        existing[actionData.actionId] = actionData;
        localStorage.setItem(key, JSON.stringify(existing));
    },

    // Get adopted actions
    async getAdoptedActions() {
        const uid = EcoTrack.AuthService.getUid();
        if (!uid) return {};

        if (EcoTrack.FirebaseConfig.isOnline()) {
            try {
                const { collection, getDocs } = window.FirebaseModules;
                const db = EcoTrack.FirebaseConfig.db;
                const snapshot = await getDocs(collection(db, 'users', uid, 'actions'));
                const actions = {};
                snapshot.docs.forEach(d => {
                    const data = d.data();
                    if (data.adopted) actions[d.id] = data;
                });
                return actions;
            } catch (error) {
                console.warn('Firestore read failed, using localStorage', error);
            }
        }

        const key = this._getStorageKey('actions');
        const stored = JSON.parse(localStorage.getItem(key) || '{}');
        const adopted = {};
        Object.entries(stored).forEach(([id, data]) => {
            if (data.adopted) adopted[id] = data;
        });
        return adopted;
    },

    // Clear all user data
    async clearAllData() {
        const uid = EcoTrack.AuthService.getUid();
        if (!uid) return;

        // Clear localStorage
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(`ecotrack_${uid}`)) {
                localStorage.removeItem(key);
            }
        });

        // Clear Firestore if online
        if (EcoTrack.FirebaseConfig.isOnline()) {
            try {
                const { collection, getDocs, deleteDoc } = window.FirebaseModules;
                const db = EcoTrack.FirebaseConfig.db;

                const collections = ['calculations', 'actions', 'profile'];
                for (const col of collections) {
                    const snapshot = await getDocs(collection(db, 'users', uid, col));
                    const deleteOps = snapshot.docs.map(d => deleteDoc(d.ref));
                    await Promise.all(deleteOps);
                }
            } catch (error) {
                console.warn('Firestore clear failed', error);
            }
        }
    }
};

window.EcoTrack = EcoTrack;
