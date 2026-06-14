/**
 * EcoTrack — CLI Testing Suite (Node.js)
 * Validates logical integrity, boundary conditions, and edge cases in terminal
 */

const assert = require('assert');

// Mock browser global environment
global.window = {};

// Load dependencies
require('./data/emission-factors.js');
require('./data/recommendations.js');
require('./data/eco-scores.js');
require('./services/calculator.js');

const EcoTrack = global.window.EcoTrack;

console.log("\x1b[36m%s\x1b[0m", "🌿 EcoTrack CLI Test Suite Initiated\n");

let passed = 0;
let total = 0;

function it(description, testFn) {
    total++;
    try {
        testFn();
        passed++;
        console.log(`\x1b[32m[PASS]\x1b[0m ${description}`);
    } catch (error) {
        console.error(`\x1b[31m[FAIL]\x1b[0m ${description}`);
        console.error(error);
    }
}

// ----------------------------------------------------
// CalculatorEngine Validation
// ----------------------------------------------------
console.log("\x1b[33m%s\x1b[0m", "🧪 CalculatorEngine Validation:");

it("Calculates positive total footprint for standard inputs", () => {
    const normalData = {
        transport: { primaryCommute: 'car', annualKm: 10000, flightsPerYear: 1, vehicleType: 'petrol' },
        food: { dietType: 'mediumMeat', foodWaste: 'average', localFood: 'false' },
        energy: { homeSize: 'medium', electricitySource: 'grid_average', heatingType: 'naturalGas', thermostatReduced: false, goodInsulation: false },
        shopping: { clothingHabit: 'fastFashion', clothingItemsPerYear: 12, electronicsFrequency: 'average', spendingLevel: 'average', deliveryFrequency: 'monthly' }
    };
    const result = EcoTrack.CalculatorEngine.calculate(normalData);
    assert.ok(result.total > 0, "Total should be positive");
    assert.ok(result.categories.transport > 0, "Transport category should be positive");
});

it("Minimalist lifestyle returns drastically lower footprint than average", () => {
    const normalData = {
        transport: { primaryCommute: 'car', annualKm: 10000, flightsPerYear: 1, vehicleType: 'petrol' },
        food: { dietType: 'mediumMeat', foodWaste: 'average', localFood: 'false' },
        energy: { homeSize: 'medium', electricitySource: 'grid_average', heatingType: 'naturalGas', thermostatReduced: false, goodInsulation: false },
        shopping: { clothingHabit: 'fastFashion', clothingItemsPerYear: 12, electronicsFrequency: 'average', spendingLevel: 'average', deliveryFrequency: 'monthly' }
    };
    const minData = {
        transport: { primaryCommute: 'walk', annualKm: 0, flightsPerYear: 0, vehicleType: 'none' },
        food: { dietType: 'vegan', foodWaste: 'low', localFood: 'true' },
        energy: { homeSize: 'small', electricitySource: 'renewable', heatingType: 'electric', thermostatReduced: true, goodInsulation: true },
        shopping: { clothingHabit: 'secondHand', clothingItemsPerYear: 0, electronicsFrequency: 'rare', spendingLevel: 'low', deliveryFrequency: 'rare' }
    };
    const normalResult = EcoTrack.CalculatorEngine.calculate(normalData);
    const minResult = EcoTrack.CalculatorEngine.calculate(minData);
    assert.ok(minResult.total < normalResult.total, "Min total should be less than normal total");
    assert.ok(minResult.total > 0, "Min total should be non-zero");
});

it("Extreme consumer lifestyle correctly scales total footprint heavily", () => {
    const normalData = {
        transport: { primaryCommute: 'car', annualKm: 10000, flightsPerYear: 1, vehicleType: 'petrol' },
        food: { dietType: 'mediumMeat', foodWaste: 'average', localFood: 'false' },
        energy: { homeSize: 'medium', electricitySource: 'grid_average', heatingType: 'naturalGas', thermostatReduced: false, goodInsulation: false },
        shopping: { clothingHabit: 'fastFashion', clothingItemsPerYear: 12, electronicsFrequency: 'average', spendingLevel: 'average', deliveryFrequency: 'monthly' }
    };
    const maxData = {
        transport: { primaryCommute: 'car', annualKm: 100000, flightsPerYear: 20, vehicleType: 'petrol' },
        food: { dietType: 'highMeat', foodWaste: 'high', localFood: 'false' },
        energy: { homeSize: 'veryLarge', electricitySource: 'coal', heatingType: 'oil', thermostatReduced: false, goodInsulation: false },
        shopping: { clothingHabit: 'fastFashion', clothingItemsPerYear: 200, electronicsFrequency: 'frequent', spendingLevel: 'high', deliveryFrequency: 'daily' }
    };
    const normalResult = EcoTrack.CalculatorEngine.calculate(normalData);
    const maxResult = EcoTrack.CalculatorEngine.calculate(maxData);
    assert.ok(maxResult.total > normalResult.total * 2, "Max footprint should be over double");
    assert.ok(!isNaN(maxResult.total), "Total should not be NaN");
});

it("Engine gracefully handles empty nested objects via fallbacks", () => {
    const emptyData = { transport: {}, food: {}, energy: {}, shopping: {} };
    const emptyResult = EcoTrack.CalculatorEngine.calculate(emptyData);
    assert.ok(!isNaN(emptyResult.total), "Empty total should not be NaN");
    assert.ok(emptyResult.total > 0, "Empty total should be non-zero");
});

it("Engine gracefully survives completely missing keys without crashing", () => {
    assert.doesNotThrow(() => {
        EcoTrack.CalculatorEngine.calculate({ transport: null });
    });
});

// ----------------------------------------------------
// Recommendations Engine Validation
// ----------------------------------------------------
console.log("\n\x1b[33m%s\x1b[0m", "💡 Recommendations Engine Validation:");

it("High flights correctly triggers aviation recommendation", () => {
    const flightsData = { total: 10000, categories: { transport: 5000 }, transport: { flightsPerYear: 5 } };
    const recs = EcoTrack.Recommendations.getPersonalized(flightsData);
    const hasFlightRec = recs.some(r => r.title.toLowerCase().includes('flight'));
    assert.ok(hasFlightRec, "Should find flight recommendation");
});

it("High food waste correctly triggers composting recommendation", () => {
    const foodData = { total: 10000, categories: { food: 4000 }, food: { foodWaste: 'high' } };
    const foodRecs = EcoTrack.Recommendations.getPersonalized(foodData);
    const hasCompostRec = foodRecs.some(r => r.title.toLowerCase().includes('compost'));
    assert.ok(hasCompostRec, "Should find composting recommendation");
});

it("Returns fallback recommendations when no specific triggers match", () => {
    const emptyRecs = EcoTrack.Recommendations.getPersonalized({ total: 1000, categories: {} });
    assert.ok(emptyRecs.length > 0, "Should return at least one recommendation");
});

it("Total potential savings correctly sums impact values", () => {
    const totalSavings = EcoTrack.Recommendations.calculateTotalSavings([{annualSavingsKg: 100}, {annualSavingsKg: 250}]);
    assert.strictEqual(totalSavings, 350, "Savings sum should be 350");
});

// ----------------------------------------------------
// EcoScores Validation
// ----------------------------------------------------
console.log("\n\x1b[33m%s\x1b[0m", "🏆 EcoScores Validation:");

it("Search correctly returns relevant food items", () => {
    const results = EcoTrack.EcoScores.search("beef");
    assert.ok(results.length > 0, "Search results should be non-empty");
    assert.ok(results.some(r => r.name.toLowerCase().includes("beef")), "Some results should contain beef in the name");
});

it("Empty search returns full default dataset list", () => {
    const emptySearch = EcoTrack.EcoScores.search("");
    assert.ok(emptySearch.length > 10, "Should return full activities list");
});

it("Comparison correctly calculates absolute difference and ratio", () => {
    const beef = EcoTrack.EcoScores.search("beef burger")[0];
    const vegan = EcoTrack.EcoScores.search("vegan meal")[0];
    const diff = EcoTrack.EcoScores.compare(beef.id, vegan.id);
    assert.ok(diff.diffKg > 0, "Difference should be positive");
    assert.ok(parseFloat(diff.timesMore) > 1, "Ratio should be greater than 1");
});

// ----------------------------------------------------
// Test Run Summary
// ----------------------------------------------------
console.log("\n-----------------------------------------");
const passRate = ((passed / total) * 100).toFixed(1);
const statusColor = passed === total ? "\x1b[32m" : "\x1b[31m";
console.log(`${statusColor}%s\x1b[0m`, `Test Run Complete: ${passed}/${total} Passed (${passRate}%)`);
console.log("-----------------------------------------\n");

if (passed === total) {
    process.exit(0);
} else {
    process.exit(1);
}
