"use strict";

/**
 * EcoTrack — Core Testing Suite
 * Validates logical integrity, boundary conditions, and edge cases
 */

var EcoTrack = window.EcoTrack || {};

EcoTrack.Tests = {
    results: { passed: 0, failed: 0, total: 0 },

    run() {
        console.log("%c🌿 EcoTrack Test Suite Initiated", "color: #00d47e; font-size: 16px; font-weight: bold;");
        this.results = { passed: 0, failed: 0, total: 0 };

        this.testCalculatorEngine();
        this.testRecommendationsEngine();
        this.testEcoScores();
        this.testOffsetProjects();
        this.testQuickEstimate();

        this.report();
    },

    assert(condition, message) {
        this.results.total++;
        if (condition) {
            this.results.passed++;
            console.log(`%c[PASS]%c ${message}`, "color: #00d47e; font-weight: bold;", "color: inherit;");
        } else {
            this.results.failed++;
            console.error(`[FAIL] ${message}`);
        }
    },

    testCalculatorEngine() {
        console.group("🧪 CalculatorEngine Validation");

        // 1. Normal Base Case
        const normalData = {
            transport: { primaryCommute: 'car', annualKm: 10000, flightsPerYear: 1, vehicleType: 'petrol' },
            food: { dietType: 'mediumMeat', foodWaste: 'average', localFood: 'false' },
            energy: { homeSize: 'medium', electricitySource: 'grid_average', heatingType: 'naturalGas', thermostatReduced: false, goodInsulation: false },
            shopping: { clothingHabit: 'fastFashion', clothingItemsPerYear: 12, electronicsFrequency: 'average', spendingLevel: 'average', deliveryFrequency: 'monthly' }
        };
        const normalResult = EcoTrack.CalculatorEngine.calculate(normalData);
        this.assert(normalResult.total > 0, "Calculates positive total footprint for standard inputs");
        this.assert(normalResult.categories.transport > 0, "Calculates transport footprint correctly");

        // 2. Edge Case: All zeroes or minimums
        const minData = {
            transport: { primaryCommute: 'walk', annualKm: 0, flightsPerYear: 0, vehicleType: 'none' },
            food: { dietType: 'vegan', foodWaste: 'low', localFood: 'true' },
            energy: { homeSize: 'small', electricitySource: 'renewable', heatingType: 'electric', thermostatReduced: true, goodInsulation: true },
            shopping: { clothingHabit: 'secondHand', clothingItemsPerYear: 0, electronicsFrequency: 'rare', spendingLevel: 'low', deliveryFrequency: 'rare' }
        };
        const minResult = EcoTrack.CalculatorEngine.calculate(minData);
        this.assert(minResult.total < normalResult.total, "Minimalist lifestyle returns drastically lower footprint than average");
        this.assert(minResult.total > 0, "Even minimalist lifestyles have a base footprint (non-zero)");

        // 3. Boundary Case: Extreme Maximums
        const maxData = {
            transport: { primaryCommute: 'car', annualKm: 100000, flightsPerYear: 20, vehicleType: 'petrol' },
            food: { dietType: 'highMeat', foodWaste: 'high', localFood: 'false' },
            energy: { homeSize: 'veryLarge', electricitySource: 'coal', heatingType: 'oil', thermostatReduced: false, goodInsulation: false },
            shopping: { clothingHabit: 'fastFashion', clothingItemsPerYear: 200, electronicsFrequency: 'frequent', spendingLevel: 'high', deliveryFrequency: 'daily' }
        };
        const maxResult = EcoTrack.CalculatorEngine.calculate(maxData);
        this.assert(maxResult.total > normalResult.total * 2, "Extreme consumer lifestyle correctly scales total footprint heavily");
        this.assert(!isNaN(maxResult.total), "Extreme values do not produce NaN");

        // 4. Invalid Input Handling (Missing Objects)
        const emptyData = { transport: {}, food: {}, energy: {}, shopping: {} };
        const emptyResult = EcoTrack.CalculatorEngine.calculate(emptyData);
        this.assert(!isNaN(emptyResult.total) && emptyResult.total > 0, "Engine gracefully handles empty nested objects via fallbacks");

        // 5. Invalid Input Handling (Nulls)
        try {
            const nullResult = EcoTrack.CalculatorEngine.calculate({ transport: null });
            this.assert(true, "Engine gracefully survives completely missing keys without crashing");
        } catch (e) {
            this.assert(false, "Engine crashed on missing top-level keys");
        }

        console.groupEnd();
    },

    testRecommendationsEngine() {
        console.group("💡 Recommendations Engine Validation");

        // 1. Specific Trigger: High flights
        const flightsData = { total: 10000, categories: { transport: 5000 }, transport: { flightsPerYear: 5 } };
        const recs = EcoTrack.Recommendations.getPersonalized(flightsData);
        const hasFlightRec = recs.some(r => r.title.toLowerCase().includes('flight'));
        this.assert(hasFlightRec, "High flights correctly triggers aviation recommendation");

        // 2. Specific Trigger: Food waste
        const foodData = { total: 10000, categories: { food: 4000 }, food: { foodWaste: 'high' } };
        const foodRecs = EcoTrack.Recommendations.getPersonalized(foodData);
        const hasCompostRec = foodRecs.some(r => r.title.toLowerCase().includes('compost'));
        this.assert(hasCompostRec, "High food waste correctly triggers composting recommendation");

        // 3. Fallbacks
        const emptyRecs = EcoTrack.Recommendations.getPersonalized({ total: 1000, categories: {} });
        this.assert(emptyRecs.length > 0, "Returns fallback recommendations when no specific triggers match");

        // 4. Savings Math
        const totalSavings = EcoTrack.Recommendations.calculateTotalSavings([{annualSavingsKg: 100}, {annualSavingsKg: 250}]);
        this.assert(totalSavings === 350, "Total potential savings correctly sums impact values");

        // 5. Category-specific recommendations
        const transportRecs = EcoTrack.Recommendations.getByCategory('transport');
        this.assert(transportRecs.length > 0 && transportRecs.every(r => r.category === 'transport'), "Returns category-specific recommendations correctly");

        // 6. Unknown category returns empty array
        const unknownRecs = EcoTrack.Recommendations.getByCategory('nonexistent');
        this.assert(Array.isArray(unknownRecs) && unknownRecs.length === 0, "Returns empty array for unknown category");

        console.groupEnd();
    },

    testEcoScores() {
        console.group("🏆 EcoScores Validation");

        // 1. Search Logic
        const results = EcoTrack.EcoScores.search("beef");
        this.assert(results.length > 0 && results.some(r => r.name.toLowerCase().includes("beef")), "Search correctly returns relevant food items");

        // 2. Empty Search
        const emptySearch = EcoTrack.EcoScores.search("");
        this.assert(emptySearch.length > 10, "Empty search returns full default dataset list");

        // 3. Comparison Math
        const beef = EcoTrack.EcoScores.search("beef burger")[0];
        const vegan = EcoTrack.EcoScores.search("vegan meal")[0];
        const diff = EcoTrack.EcoScores.compare(beef.id, vegan.id);
        this.assert(diff.diffKg > 0, "Comparison correctly calculates absolute difference");
        this.assert(parseFloat(diff.timesMore) > 1, "Comparison correctly calculates ratio");

        // 4. Invalid comparison
        const invalidResult = EcoTrack.EcoScores.compare("nonexistent-1", "nonexistent-2");
        this.assert(invalidResult === null, "Comparison returns null for invalid activity IDs");

        // 5. Category filtering
        const meals = EcoTrack.EcoScores.getByCategory("meals");
        this.assert(meals.length > 0 && meals.every(a => a.category === "meals"), "getByCategory filters activities correctly");

        // 6. All category returns full list
        const allActivities = EcoTrack.EcoScores.getByCategory("all");
        this.assert(allActivities.length === EcoTrack.EcoScores.activities.length, "getByCategory 'all' returns all activities");

        // 7. Grade thresholds
        const scoreA = EcoTrack.EcoScores.getScore(0.3);
        this.assert(scoreA.grade === "A", "getScore assigns grade A for 0.3 kg CO₂");

        const scoreF = EcoTrack.EcoScores.getScore(15.0);
        this.assert(scoreF.grade === "F", "getScore assigns grade F for 15.0 kg CO₂");

        const scoreC = EcoTrack.EcoScores.getScore(2.5);
        this.assert(scoreC.grade === "C", "getScore assigns grade C for 2.5 kg CO₂");

        console.groupEnd();
    },

    testOffsetProjects() {
        console.group("🌍 OffsetProjects Validation");

        // 1. getByCategory 'all'
        const allProjects = EcoTrack.OffsetProjects.getByCategory("all");
        this.assert(allProjects.length === EcoTrack.OffsetProjects.projects.length, "getByCategory 'all' returns all offset projects");

        // 2. Category filter
        const reforestation = EcoTrack.OffsetProjects.getByCategory("reforestation");
        this.assert(reforestation.length > 0 && reforestation.every(p => p.category === "reforestation"), "getByCategory filters offset projects by type");

        // 3. getById valid project
        const project = EcoTrack.OffsetProjects.getById("amazon-reforestation");
        this.assert(project && project.title === "Amazon Rainforest Restoration", "getById returns correct offset project");

        // 4. getById invalid project
        const noProject = EcoTrack.OffsetProjects.getById("nonexistent-project");
        this.assert(noProject === undefined, "getById returns undefined for non-existent project");

        // 5. Data integrity
        const allValid = EcoTrack.OffsetProjects.projects.every(p => p.id && p.title && p.category && p.co2PerDollar > 0);
        this.assert(allValid, "All offset projects have required fields with valid data");

        console.groupEnd();
    },

    testQuickEstimate() {
        console.group("⚡ QuickEstimate Validation");

        // 1. Valid result
        const result = EcoTrack.CalculatorEngine.quickEstimate("mediumMeat", "car", "medium");
        this.assert(result.total > 0 && result.totalTonnes > 0 && result.ecoScore, "quickEstimate returns valid result for car commuter");

        // 2. Comparison
        const high = EcoTrack.CalculatorEngine.quickEstimate("highMeat", "car", "large");
        const low = EcoTrack.CalculatorEngine.quickEstimate("vegan", "walk", "small");
        this.assert(low.total < high.total, "quickEstimate returns lower footprint for vegan/walker/small home");

        // 3. Eco score grades
        const scoreAPlus = EcoTrack.CalculatorEngine._calcEcoScore(1.5);
        this.assert(scoreAPlus.grade === "A+", "Eco score grade A+ for extremely low emissions");

        const scoreF = EcoTrack.CalculatorEngine._calcEcoScore(25);
        this.assert(scoreF.grade === "F", "Eco score grade F for extremely high emissions");

        console.groupEnd();
    },

    report() {
        console.log("-----------------------------------------");
        const passRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
        const color = passRate == 100 ? "color: #00d47e" : "color: #ff4757";
        console.log(`%cTest Run Complete: ${this.results.passed}/${this.results.total} Passed (${passRate}%)`, `${color}; font-size: 14px; font-weight: bold;`);
        console.log("-----------------------------------------");
    }
};

// Run tests automatically in console if url has ?test=true
if (window.location.search.includes('test=true')) {
    setTimeout(() => EcoTrack.Tests.run(), 500);
}
