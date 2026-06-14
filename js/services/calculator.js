/**
 * EcoTrack — Carbon Calculation Engine
 * Processes user inputs and calculates carbon footprint
 */
var EcoTrack = window.EcoTrack || {};

EcoTrack.CalculatorEngine = {
    /**
     * Calculate total carbon footprint from form data
     * @param {Object} formData - User's answers from all 4 steps
     * @returns {Object} Detailed footprint breakdown
     */
    calculate(formData) {
        const transport = this._calcTransport(formData.transport || {});
        const food = this._calcFood(formData.food || {});
        const energy = this._calcEnergy(formData.energy || {});
        const shopping = this._calcShopping(formData.shopping || {});

        const total = transport.total + food.total + energy.total + shopping.total;
        const totalTonnes = total / 1000;

        // Determine comparison with averages
        const avgGlobal = EcoTrack.EmissionFactors.averages.global;
        const avgNational = EcoTrack.EmissionFactors.averages.us; // default to US

        return {
            total,
            totalTonnes: Math.round(totalTonnes * 10) / 10,
            categories: {
                transport: transport.total,
                food: food.total,
                energy: energy.total,
                shopping: shopping.total
            },
            details: {
                transport,
                food,
                energy,
                shopping
            },
            percentages: {
                transport: total > 0 ? Math.round((transport.total / total) * 100) : 0,
                food: total > 0 ? Math.round((food.total / total) * 100) : 0,
                energy: total > 0 ? Math.round((energy.total / total) * 100) : 0,
                shopping: total > 0 ? Math.round((shopping.total / total) * 100) : 0
            },
            comparison: {
                globalAvg: avgGlobal,
                nationalAvg: avgNational,
                vsGlobal: totalTonnes - avgGlobal,
                vsNational: totalTonnes - avgNational,
                vsGlobalPct: Math.round(((totalTonnes - avgGlobal) / avgGlobal) * 100),
                vsNationalPct: Math.round(((totalTonnes - avgNational) / avgNational) * 100)
            },
            ecoScore: this._calcEcoScore(totalTonnes),
            formData
        };
    },

    _calcTransport(data) {
        const factors = EcoTrack.EmissionFactors.transport;
        let carEmissions = 0;
        let flightEmissions = 0;
        let commuteEmissions = 0;

        // Car emissions
        const annualKm = data.annualKm || 0;
        const vehicleType = data.vehicleType || 'petrol';
        const carFactor = factors.car[vehicleType] || factors.car.average;
        carEmissions = annualKm * carFactor;

        // Flight emissions
        const flights = data.flightsPerYear || 0;
        const flightType = data.flightType || 'average';
        flightEmissions = flights * (factors.flights[flightType] || factors.flights.average);

        // Public transit commute
        if (data.primaryCommute === 'publicTransit') {
            const dailyKm = data.commuteDistance || 10;
            const workDays = 230;
            commuteEmissions = dailyKm * workDays * (factors.publicTransit.bus + factors.publicTransit.train) / 2;
        }

        const total = Math.round(carEmissions + flightEmissions + commuteEmissions);

        return {
            total,
            breakdown: {
                car: Math.round(carEmissions),
                flights: Math.round(flightEmissions),
                commute: Math.round(commuteEmissions)
            }
        };
    },

    _calcFood(data) {
        const factors = EcoTrack.EmissionFactors.food;
        const dietType = data.dietType || 'mediumMeat';
        const dailyFactor = factors.dietTypes[dietType] || factors.dietTypes.mediumMeat;

        // Base diet emissions (annual)
        let dietEmissions = dailyFactor * 365;

        // Food waste impact
        const wasteLevel = data.foodWaste || 'average';
        const wasteFactor = factors.foodWaste[wasteLevel] || factors.foodWaste.average;
        const wasteEmissions = wasteFactor * 365 * 0.3; // approx 30% of food is potentially wasted

        // Local food adjustment
        let localReduction = 0;
        if (data.localFood) {
            localReduction = dietEmissions * factors.localFoodReduction;
        }

        const total = Math.round(dietEmissions + wasteEmissions - localReduction);

        return {
            total,
            breakdown: {
                diet: Math.round(dietEmissions),
                waste: Math.round(wasteEmissions),
                localReduction: Math.round(localReduction)
            }
        };
    },

    _calcEnergy(data) {
        const factors = EcoTrack.EmissionFactors.energy;

        // Electricity
        const homeSize = data.homeSize || 'medium';
        const electricityKwh = factors.averageConsumption.electricity[homeSize] || 8000;
        const electricitySource = data.electricitySource || 'grid_average';
        const electricityFactor = factors.electricity[electricitySource] || factors.electricity.grid_average;
        const electricityEmissions = electricityKwh * electricityFactor;

        // Heating
        const heatingKwh = factors.averageConsumption.heating[homeSize] || 13000;
        const heatingType = data.heatingType || 'naturalGas';
        const heatingFactor = factors.heating[heatingType] || factors.heating.naturalGas;
        let heatingEmissions = heatingKwh * heatingFactor;

        // Thermostat adjustment
        if (data.thermostatReduced) {
            heatingEmissions -= factors.thermostatAdjustment;
        }

        // Insulation bonus
        if (data.goodInsulation) {
            heatingEmissions *= (1 - factors.insulationSavings);
        }

        const total = Math.round(Math.max(0, electricityEmissions + heatingEmissions));

        return {
            total,
            breakdown: {
                electricity: Math.round(electricityEmissions),
                heating: Math.round(Math.max(0, heatingEmissions))
            }
        };
    },

    _calcShopping(data) {
        const factors = EcoTrack.EmissionFactors.shopping;

        // Clothing
        const clothingHabit = data.clothingHabit || 'sustainable';
        const clothingItems = data.clothingItemsPerYear || 12;
        const clothingFactor = factors.clothing[clothingHabit] || factors.clothing.sustainable;
        const clothingEmissions = clothingItems * clothingFactor;

        // Electronics
        const electronicsFrequency = data.electronicsFrequency || 'average';
        let electronicsEmissions = 0;
        if (electronicsFrequency === 'frequent') {
            electronicsEmissions = (factors.electronics.smartphone + factors.electronics.laptop) / 1; // replace annually
        } else if (electronicsFrequency === 'average') {
            electronicsEmissions = (factors.electronics.smartphone / 2) + (factors.electronics.laptop / 3); // every 2-3 years
        } else {
            electronicsEmissions = (factors.electronics.smartphone / 4) + (factors.electronics.laptop / 5); // every 4-5 years
        }

        // General spending
        const spendingLevel = data.spendingLevel || 'average';
        const spendingEmissions = factors.generalSpending[spendingLevel] || factors.generalSpending.average;

        // Deliveries
        const deliveryFreq = data.deliveryFrequency || 'monthly';
        const deliveryEmissions = factors.onlineDeliveries[deliveryFreq] || factors.onlineDeliveries.monthly;

        const total = Math.round(clothingEmissions + electronicsEmissions + spendingEmissions + deliveryEmissions);

        return {
            total,
            breakdown: {
                clothing: Math.round(clothingEmissions),
                electronics: Math.round(electronicsEmissions),
                spending: Math.round(spendingEmissions),
                deliveries: Math.round(deliveryEmissions)
            }
        };
    },

    _calcEcoScore(totalTonnes) {
        if (totalTonnes <= 2) return { grade: 'A+', label: 'Exceptional', color: '#00d47e' };
        if (totalTonnes <= 4) return { grade: 'A', label: 'Excellent', color: '#00d47e' };
        if (totalTonnes <= 6) return { grade: 'B+', label: 'Very Good', color: '#00b4d8' };
        if (totalTonnes <= 8) return { grade: 'B', label: 'Good', color: '#00b4d8' };
        if (totalTonnes <= 10) return { grade: 'C+', label: 'Above Average', color: '#ffd60a' };
        if (totalTonnes <= 12) return { grade: 'C', label: 'Average', color: '#ffd60a' };
        if (totalTonnes <= 15) return { grade: 'D', label: 'Below Average', color: '#ffa500' };
        if (totalTonnes <= 20) return { grade: 'E', label: 'High Impact', color: '#ff6b6b' };
        return { grade: 'F', label: 'Very High Impact', color: '#dc2626' };
    },

    /**
     * Get a quick estimate from minimal inputs
     */
    quickEstimate(dietType, commuteType, homeSize) {
        return this.calculate({
            transport: { primaryCommute: commuteType, annualKm: commuteType === 'car' ? 15000 : 0, flightsPerYear: 1 },
            food: { dietType, foodWaste: 'average', localFood: false },
            energy: { homeSize, electricitySource: 'grid_average', heatingType: 'naturalGas' },
            shopping: { clothingHabit: 'sustainable', spendingLevel: 'average', deliveryFrequency: 'monthly' }
        });
    }
};

window.EcoTrack = EcoTrack;
