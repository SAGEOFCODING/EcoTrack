/**
 * EcoTrack — Basic Test Suite
 * To run these tests in the browser console, execute: `EcoTrack.Tests.runAll()`
 */
var EcoTrack = window.EcoTrack || {};

EcoTrack.Tests = {
    assert(condition, message) {
        if (!condition) {
            console.error(`❌ TEST FAILED: ${message}`);
            return false;
        }
        console.log(`✅ TEST PASSED: ${message}`);
        return true;
    },

    testCalculatorEngine() {
        console.log('--- Running Calculator Engine Tests ---');
        let passed = 0;
        let total = 0;

        // Mock formData representing a "High Impact" user
        const highImpactData = {
            transport: { primaryCommute: 'car', annualKm: 25000, vehicleType: 'petrol', flightsPerYear: 5 },
            food: { dietType: 'highMeat', foodWaste: 'high', localFood: false },
            energy: { homeSize: 'large', electricitySource: 'coal', heatingType: 'oil' },
            shopping: { clothingHabit: 'fastFashion', clothingItemsPerYear: 40, electronicsFrequency: 'frequent', spendingLevel: 'high' }
        };

        const result = EcoTrack.CalculatorEngine.calculate(highImpactData);

        total++;
        if (this.assert(result.totalTonnes > 15, 'High impact user should generate > 15 tonnes CO2')) passed++;

        total++;
        if (this.assert(result.ecoScore.grade === 'F' || result.ecoScore.grade === 'E', 'High impact user should get an E or F grade')) passed++;

        total++;
        if (this.assert(result.categories.transport > 0, 'Transport category should have positive emissions')) passed++;

        return { passed, total };
    },

    testAuthConcurrency() {
        console.log('--- Running Auth Concurrency Tests ---');
        let passed = 0;
        let total = 0;

        // Simulate concurrent init calls
        EcoTrack.AuthService._initialized = false;
        EcoTrack.AuthService.init();
        EcoTrack.AuthService.init();

        total++;
        if (this.assert(EcoTrack.AuthService._initialized === true, 'AuthService should immediately lock initialization state to prevent duplicate listeners')) passed++;

        return { passed, total };
    },

    runAll() {
        console.log('🚀 Starting EcoTrack Test Suite');
        const calcResults = this.testCalculatorEngine();
        const authResults = this.testAuthConcurrency();

        const totalPassed = calcResults.passed + authResults.passed;
        const totalTests = calcResults.total + authResults.total;

        console.log('---------------------------------------');
        console.log(`🏁 Test Suite Completed: ${totalPassed}/${totalTests} Passed`);
        return totalPassed === totalTests;
    }
};

window.EcoTrack = EcoTrack;
