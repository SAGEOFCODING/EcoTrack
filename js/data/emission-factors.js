/**
 * EcoTrack — Emission Factors Database
 * Sources: EPA, DEFRA, IPCC published datasets
 * All values in kg CO₂e per unit
 */
const EcoTrack = window.EcoTrack || {};

EcoTrack.EmissionFactors = {
    // Transport emission factors
    transport: {
        // kg CO2 per km driven
        car: {
            petrol: 0.192,
            diesel: 0.171,
            hybrid: 0.109,
            electric: 0.053,
            average: 0.170
        },
        // kg CO2 per passenger-km
        publicTransit: {
            bus: 0.089,
            train: 0.041,
            subway: 0.033,
            tram: 0.029
        },
        // kg CO2 per flight
        flights: {
            domestic: 255,        // avg domestic round trip
            shortHaul: 480,       // < 3 hours
            mediumHaul: 1100,     // 3-6 hours
            longHaul: 2200,       // > 6 hours
            average: 1000
        },
        // kg CO2 per km for active transport
        bicycle: 0.005,  // manufacturing amortized
        walking: 0.000,
        eScooter: 0.035
    },

    // Food & diet emission factors
    food: {
        // kg CO2 per day based on diet type
        dietTypes: {
            highMeat: 7.19,        // heavy meat eater (100g+ daily)
            mediumMeat: 5.63,      // medium meat (50-99g daily)
            lowMeat: 4.67,         // low meat (<50g daily)
            pescatarian: 3.91,
            vegetarian: 3.81,
            vegan: 2.89
        },
        // kg CO2 per serving
        meals: {
            beefBurger: 3.5,
            chickenBreast: 1.4,
            porkChop: 1.6,
            salmon: 1.2,
            eggs2: 0.6,
            tofu: 0.3,
            lentils: 0.2,
            rice: 0.4,
            pasta: 0.3,
            salad: 0.1,
            cheese: 1.3,
            milk1L: 1.1,
            plantMilk1L: 0.4,
            coffee: 0.3,
            beer: 0.5,
            wine: 0.7
        },
        // kg CO2 per kg of food waste
        foodWaste: {
            low: 0.5,       // minimal waste, composting
            average: 1.9,   // some waste
            high: 3.2       // frequent waste, no composting
        },
        // annual multiplier
        localFoodReduction: 0.05  // 5% reduction for buying local
    },

    // Home energy emission factors
    energy: {
        // kg CO2 per kWh
        electricity: {
            grid_average: 0.417,   // US average
            renewable: 0.020,      // wind/solar lifecycle
            coal: 0.910,
            gas: 0.450,
            nuclear: 0.012
        },
        // kg CO2 per kWh (thermal)
        heating: {
            naturalGas: 0.184,
            oil: 0.265,
            electric: 0.417,
            heatPump: 0.130,
            wood: 0.039
        },
        // average annual consumption kWh
        averageConsumption: {
            electricity: {
                small: 5000,      // apartment
                medium: 8000,     // small house
                large: 12000,     // large house
                veryLarge: 18000  // mansion
            },
            heating: {
                small: 8000,
                medium: 13000,
                large: 20000,
                veryLarge: 30000
            }
        },
        // kg CO2 per degree C adjustment per year
        thermostatAdjustment: 320,
        // percentage savings from insulation
        insulationSavings: 0.25
    },

    // Shopping & lifestyle emission factors
    shopping: {
        // kg CO2 per item (amortized annual)
        clothing: {
            fastFashion: 33.4,     // per garment
            sustainable: 16.7,
            secondHand: 3.3
        },
        // kg CO2 per device
        electronics: {
            smartphone: 70,       // manufacturing
            laptop: 300,
            desktop: 500,
            tablet: 130,
            tv: 450
        },
        // average annual spending category (kg CO2)
        generalSpending: {
            low: 800,          // minimalist
            average: 1600,     // moderate consumer
            high: 3200         // high consumer
        },
        // kg CO2 per year based on delivery frequency
        onlineDeliveries: {
            rare: 20,          // <1/month
            monthly: 50,
            weekly: 150,
            daily: 500
        }
    },

    // National and global averages (tonnes CO2 per year)
    averages: {
        global: 4.8,
        us: 16.0,
        uk: 5.5,
        eu: 6.8,
        india: 1.9,
        china: 7.4,
        canada: 15.6,
        australia: 17.1,
        japan: 9.7,
        brazil: 2.3,
        world_target_2030: 2.9  // Paris Agreement aligned
    },

    // Category weights for scoring
    categoryWeights: {
        transport: 0.30,
        food: 0.25,
        energy: 0.25,
        shopping: 0.20
    }
};

window.EcoTrack = EcoTrack;
