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

it("Returns category-specific recommendations", () => {
    const transportRecs = EcoTrack.Recommendations.getByCategory('transport');
    assert.ok(transportRecs.length > 0, "Should return transport recommendations");
    assert.ok(transportRecs.every(r => r.category === 'transport'), "All should be transport category");
});

it("Returns empty array for unknown category", () => {
    const unknownRecs = EcoTrack.Recommendations.getByCategory('nonexistent');
    assert.ok(Array.isArray(unknownRecs), "Should return an array");
    assert.strictEqual(unknownRecs.length, 0, "Should return empty array");
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

it("Comparison returns null for invalid activity IDs", () => {
    const result = EcoTrack.EcoScores.compare("nonexistent-1", "nonexistent-2");
    assert.strictEqual(result, null, "Should return null for invalid IDs");
});

it("getByCategory filters activities correctly", () => {
    const meals = EcoTrack.EcoScores.getByCategory("meals");
    assert.ok(meals.length > 0, "Should return meal activities");
    assert.ok(meals.every(a => a.category === "meals"), "All should be in meals category");
});

it("getByCategory 'all' returns all activities", () => {
    const all = EcoTrack.EcoScores.getByCategory("all");
    assert.strictEqual(all.length, EcoTrack.EcoScores.activities.length, "Should return all activities");
});

it("getScore assigns correct grade for low emissions", () => {
    const scoreA = EcoTrack.EcoScores.getScore(0.3);
    assert.strictEqual(scoreA.grade, "A", "0.3 kg CO₂ should be grade A");
});

it("getScore assigns correct grade for high emissions", () => {
    const scoreF = EcoTrack.EcoScores.getScore(15.0);
    assert.strictEqual(scoreF.grade, "F", "15.0 kg CO₂ should be grade F");
});

it("getScore assigns correct grade for moderate emissions", () => {
    const scoreC = EcoTrack.EcoScores.getScore(2.5);
    assert.strictEqual(scoreC.grade, "C", "2.5 kg CO₂ should be grade C");
});

// ----------------------------------------------------
// OffsetProjects Validation
// ----------------------------------------------------
console.log("\n\x1b[33m%s\x1b[0m", "🌍 OffsetProjects Validation:");

// Load offset data
require('./data/offsets.js');

it("getByCategory 'all' returns all offset projects", () => {
    const allProjects = EcoTrack.OffsetProjects.getByCategory("all");
    assert.ok(allProjects.length > 0, "Should return at least one project");
    assert.strictEqual(allProjects.length, EcoTrack.OffsetProjects.projects.length, "Should return all projects");
});

it("getByCategory filters offset projects by type", () => {
    const reforestation = EcoTrack.OffsetProjects.getByCategory("reforestation");
    assert.ok(reforestation.length > 0, "Should return reforestation projects");
    assert.ok(reforestation.every(p => p.category === "reforestation"), "All should be reforestation");
});

it("getById returns correct offset project", () => {
    const project = EcoTrack.OffsetProjects.getById("amazon-reforestation");
    assert.ok(project, "Should find Amazon project");
    assert.strictEqual(project.title, "Amazon Rainforest Restoration", "Title should match");
});

it("getById returns undefined for non-existent project", () => {
    const project = EcoTrack.OffsetProjects.getById("nonexistent-project");
    assert.strictEqual(project, undefined, "Should return undefined");
});

it("All offset projects have required fields", () => {
    EcoTrack.OffsetProjects.projects.forEach(p => {
        assert.ok(p.id, `Project ${p.title} should have an id`);
        assert.ok(p.title, `Project ${p.id} should have a title`);
        assert.ok(p.category, `Project ${p.id} should have a category`);
        assert.ok(p.co2PerDollar > 0, `Project ${p.id} should have positive co2PerDollar`);
    });
});

// ----------------------------------------------------
// CalculatorEngine — quickEstimate
// ----------------------------------------------------
console.log("\n\x1b[33m%s\x1b[0m", "⚡ QuickEstimate Validation:");

it("quickEstimate returns valid result for car commuter", () => {
    const result = EcoTrack.CalculatorEngine.quickEstimate("mediumMeat", "car", "medium");
    assert.ok(result.total > 0, "Total should be positive");
    assert.ok(result.totalTonnes > 0, "Total tonnes should be positive");
    assert.ok(result.ecoScore, "Should have an eco score");
});

it("quickEstimate returns lower footprint for vegan/walker/small home", () => {
    const high = EcoTrack.CalculatorEngine.quickEstimate("highMeat", "car", "large");
    const low = EcoTrack.CalculatorEngine.quickEstimate("vegan", "walk", "small");
    assert.ok(low.total < high.total, "Vegan walker in small home should have lower footprint");
});

it("Eco score grade A+ for extremely low emissions", () => {
    const score = EcoTrack.CalculatorEngine._calcEcoScore(1.5);
    assert.strictEqual(score.grade, "A+", "1.5 tonnes should get A+");
});

it("Eco score grade F for extremely high emissions", () => {
    const score = EcoTrack.CalculatorEngine._calcEcoScore(25);
    assert.strictEqual(score.grade, "F", "25 tonnes should get F");
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

