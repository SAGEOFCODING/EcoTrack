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
