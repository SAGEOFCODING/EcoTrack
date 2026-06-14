/**
 * EcoTrack — Eco-Score Daily Activities Database
 * Rates everyday activities on A-F scale with CO₂ equivalents
 */
const EcoTrack = window.EcoTrack || {};

EcoTrack.EcoScores = {
    categories: [
        { id: 'all', label: 'All Activities', icon: '🌍' },
        { id: 'meals', label: 'Meals & Food', icon: '🍽️' },
        { id: 'transport', label: 'Transport', icon: '🚗' },
        { id: 'energy', label: 'Home Energy', icon: '💡' },
        { id: 'lifestyle', label: 'Lifestyle', icon: '🛒' }
    ],

    // Score thresholds (kg CO2 per activity instance)
    scoreThresholds: {
        A: { max: 0.5, color: '#00d47e', label: 'Excellent' },
        B: { max: 1.5, color: '#00b4d8', label: 'Good' },
        C: { max: 3.0, color: '#ffd60a', label: 'Moderate' },
        D: { max: 5.0, color: '#ffa500', label: 'Poor' },
        E: { max: 10.0, color: '#ff6b6b', label: 'Bad' },
        F: { max: Infinity, color: '#dc2626', label: 'Very Bad' }
    },

    activities: [
        // Meals & Food
        { id: 'vegan-meal', name: 'Vegan Meal', category: 'meals', kgCO2: 0.3, icon: '🥗', description: 'A fully plant-based meal with locally sourced vegetables, grains, and legumes.' },
        { id: 'vegetarian-meal', name: 'Vegetarian Meal', category: 'meals', kgCO2: 0.7, icon: '🧀', description: 'Meal with dairy or eggs but no meat. Includes pasta, pizza, or egg dishes.' },
        { id: 'chicken-meal', name: 'Chicken Meal', category: 'meals', kgCO2: 1.4, icon: '🍗', description: 'A meal centered around chicken — one of the lower-emission meats.' },
        { id: 'fish-meal', name: 'Fish Meal', category: 'meals', kgCO2: 1.2, icon: '🐟', description: 'Sustainable fish meal. Farmed salmon or wild-caught options vary.' },
        { id: 'pork-meal', name: 'Pork Meal', category: 'meals', kgCO2: 1.6, icon: '🥩', description: 'Pork chop or sausage-based meal. Moderate emissions compared to beef.' },
        { id: 'beef-burger', name: 'Beef Burger', category: 'meals', kgCO2: 3.5, icon: '🍔', description: 'A standard beef burger. Beef has the highest emissions of common meats.' },
        { id: 'beef-steak', name: 'Beef Steak Dinner', category: 'meals', kgCO2: 7.0, icon: '🥩', description: 'A large beef steak dinner. One of the highest-emission single meals.' },
        { id: 'plant-burger', name: 'Plant-Based Burger', category: 'meals', kgCO2: 0.4, icon: '🌿', description: 'Beyond/Impossible style plant burger. 90% less emissions than beef.' },
        { id: 'coffee-dairy', name: 'Coffee with Dairy Milk', category: 'meals', kgCO2: 0.3, icon: '☕', description: 'Standard coffee with cow\'s milk.' },
        { id: 'coffee-oat', name: 'Coffee with Oat Milk', category: 'meals', kgCO2: 0.1, icon: '☕', description: 'Coffee with oat milk — 60% less emissions than dairy.' },
        { id: 'food-delivery', name: 'Food Delivery Order', category: 'meals', kgCO2: 2.5, icon: '🛵', description: 'Restaurant delivery includes food preparation energy, packaging, and transport.' },
        { id: 'home-cooking', name: 'Home-Cooked Meal', category: 'meals', kgCO2: 0.5, icon: '👨‍🍳', description: 'Cooking at home is typically lower emission than eating out.' },

        // Transport
        { id: 'walk-1km', name: 'Walking (1 km)', category: 'transport', kgCO2: 0.0, icon: '🚶', description: 'Zero-emission transport. Good for health and the planet.' },
        { id: 'bike-5km', name: 'Cycling (5 km)', category: 'transport', kgCO2: 0.025, icon: '🚲', description: 'Near-zero emissions. Only minimal manufacturing footprint.' },
        { id: 'ebike-5km', name: 'E-Bike (5 km)', category: 'transport', kgCO2: 0.05, icon: '🔋', description: 'Electric bike commute. Extremely efficient per km.' },
        { id: 'bus-10km', name: 'Bus Ride (10 km)', category: 'transport', kgCO2: 0.89, icon: '🚌', description: 'Public bus journey. Emissions shared among all passengers.' },
        { id: 'train-20km', name: 'Train Ride (20 km)', category: 'transport', kgCO2: 0.82, icon: '🚄', description: 'Electric train journey. One of the most efficient motorized transport modes.' },
        { id: 'car-petrol-10km', name: 'Petrol Car (10 km)', category: 'transport', kgCO2: 1.92, icon: '🚗', description: 'Standard petrol car trip, single occupancy.' },
        { id: 'car-ev-10km', name: 'Electric Car (10 km)', category: 'transport', kgCO2: 0.53, icon: '⚡', description: 'EV trip using average grid electricity.' },
        { id: 'uber-ride', name: 'Ride-Share (10 km)', category: 'transport', kgCO2: 2.5, icon: '🚕', description: 'Ride-hailing trip includes deadheading (empty return trips).' },
        { id: 'domestic-flight', name: 'Domestic Flight', category: 'transport', kgCO2: 255, icon: '✈️', description: 'Average domestic round-trip flight (~800 km each way).' },
        { id: 'long-haul-flight', name: 'Transatlantic Flight', category: 'transport', kgCO2: 2200, icon: '🛫', description: 'Round-trip transatlantic flight. One of the highest single activities.' },

        // Home Energy
        { id: 'ac-1hour', name: 'Air Conditioning (1 hr)', category: 'energy', kgCO2: 1.5, icon: '❄️', description: 'Running a typical home AC unit for one hour.' },
        { id: 'heater-1hour', name: 'Gas Heater (1 hr)', category: 'energy', kgCO2: 1.2, icon: '🔥', description: 'Running a gas central heating system for one hour.' },
        { id: 'shower-8min', name: 'Hot Shower (8 min)', category: 'energy', kgCO2: 0.8, icon: '🚿', description: 'Average hot shower using gas or electric water heating.' },
        { id: 'shower-short', name: 'Short Shower (4 min)', category: 'energy', kgCO2: 0.4, icon: '🚿', description: 'Shorter shower = half the emissions. Every minute counts.' },
        { id: 'laundry-hot', name: 'Laundry (Hot Wash)', category: 'energy', kgCO2: 1.8, icon: '👔', description: 'Hot water wash cycle uses significant energy for heating.' },
        { id: 'laundry-cold', name: 'Laundry (Cold Wash)', category: 'energy', kgCO2: 0.3, icon: '👔', description: 'Cold wash uses 90% less energy. Modern detergents work great in cold.' },
        { id: 'tv-3hours', name: 'Watching TV (3 hrs)', category: 'energy', kgCO2: 0.2, icon: '📺', description: 'Modern LED TV energy consumption for a typical evening.' },
        { id: 'gaming-2hours', name: 'Gaming Console (2 hrs)', category: 'energy', kgCO2: 0.5, icon: '🎮', description: 'Console gaming session. Higher than TV due to processing power.' },
        { id: 'dryer-cycle', name: 'Tumble Dryer Cycle', category: 'energy', kgCO2: 2.4, icon: '💨', description: 'One of the most energy-intensive appliances. Consider line drying.' },
        { id: 'line-drying', name: 'Line Drying Clothes', category: 'energy', kgCO2: 0.0, icon: '☀️', description: 'Zero emissions! Nature\'s dryer.' },

        // Lifestyle
        { id: 'new-tshirt', name: 'Buying a New T-Shirt', category: 'lifestyle', kgCO2: 6.5, icon: '👕', description: 'Manufacturing a cotton t-shirt including growing, processing, and transport.' },
        { id: 'secondhand-tshirt', name: 'Second-Hand T-Shirt', category: 'lifestyle', kgCO2: 0.5, icon: '♻️', description: 'Buying pre-owned. Only transport emissions count.' },
        { id: 'new-jeans', name: 'Buying New Jeans', category: 'lifestyle', kgCO2: 33.4, icon: '👖', description: 'Jeans are water and energy-intensive to produce.' },
        { id: 'new-smartphone', name: 'New Smartphone', category: 'lifestyle', kgCO2: 70, icon: '📱', description: 'Manufacturing a smartphone involves mining, processing, and assembly.' },
        { id: 'streaming-1hour', name: 'Video Streaming (1 hr)', category: 'lifestyle', kgCO2: 0.036, icon: '🎬', description: 'Data center energy for streaming is surprisingly low per hour.' },
        { id: 'email-sent', name: 'Sending an Email', category: 'lifestyle', kgCO2: 0.004, icon: '📧', description: 'Very low impact per email. Attachments increase it slightly.' },
        { id: 'google-search', name: 'Google Search', category: 'lifestyle', kgCO2: 0.0003, icon: '🔍', description: 'Each search uses a tiny amount of data center energy.' },
        { id: 'online-order', name: 'Online Shopping Delivery', category: 'lifestyle', kgCO2: 0.9, icon: '📦', description: 'Standard delivery including packaging and transport.' },
        { id: 'book-paper', name: 'Buying a Paper Book', category: 'lifestyle', kgCO2: 2.7, icon: '📚', description: 'Paper book including manufacturing, printing, and transport.' },
        { id: 'ebook', name: 'Reading an E-Book', category: 'lifestyle', kgCO2: 0.02, icon: '📖', description: 'Digital reading has minimal per-book emissions after device manufacture.' }
    ],

    getScore(kgCO2) {
        for (const [grade, threshold] of Object.entries(this.scoreThresholds)) {
            if (kgCO2 <= threshold.max) return { grade, ...threshold };
        }
        return { grade: 'F', ...this.scoreThresholds.F };
    },

    getByCategory(categoryId) {
        if (categoryId === 'all') return this.activities;
        return this.activities.filter(a => a.category === categoryId);
    },

    search(query) {
        const lower = query.toLowerCase();
        return this.activities.filter(a =>
            a.name.toLowerCase().includes(lower) ||
            a.description.toLowerCase().includes(lower) ||
            a.category.toLowerCase().includes(lower)
        );
    },

    compare(id1, id2) {
        const a1 = this.activities.find(a => a.id === id1);
        const a2 = this.activities.find(a => a.id === id2);
        if (!a1 || !a2) return null;

        const diff = Math.abs(a1.kgCO2 - a2.kgCO2);
        const pctDiff = a1.kgCO2 > 0 ? ((diff / Math.max(a1.kgCO2, a2.kgCO2)) * 100).toFixed(0) : 0;
        const winner = a1.kgCO2 <= a2.kgCO2 ? a1 : a2;
        const loser = a1.kgCO2 <= a2.kgCO2 ? a2 : a1;

        return {
            item1: a1,
            item2: a2,
            winner,
            loser,
            diffKg: diff,
            diffPercent: pctDiff,
            timesMore: loser.kgCO2 > 0 ? (loser.kgCO2 / Math.max(winner.kgCO2, 0.001)).toFixed(1) : 'N/A'
        };
    }
};

window.EcoTrack = EcoTrack;
