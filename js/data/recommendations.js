/**
 * EcoTrack — Smart Recommendation Engine Data
 * Decision trees and personalized action recommendations
 */
var EcoTrack = window.EcoTrack || {};

EcoTrack.Recommendations = {
    transport: [
        {
            id: 'transport-public-transit',
            title: 'Switch to Public Transit 2 Days/Week',
            description: 'Replace two car commute days with bus or train. Public transit produces 87% less CO₂ per passenger-km than single-occupancy vehicles.',
            icon: '🚌',
            annualSavingsKg: 1200,
            difficulty: 'easy',
            costIndicator: 'saves',
            costNote: 'Save ~$2,500/year on fuel & parking',
            condition: (data) => data.transport.primaryCommute === 'car' && data.transport.annualKm > 5000,
            category: 'transport'
        },
        {
            id: 'transport-cycling',
            title: 'Bike for Trips Under 5km',
            description: 'Short urban trips are perfect for cycling. You\'ll reduce emissions to near zero while improving cardiovascular health.',
            icon: '🚲',
            annualSavingsKg: 500,
            difficulty: 'easy',
            costIndicator: 'saves',
            costNote: 'Save ~$800/year on short trips',
            condition: (data) => data.transport.primaryCommute === 'car',
            category: 'transport'
        },
        {
            id: 'transport-carpool',
            title: 'Start Carpooling',
            description: 'Sharing rides with just one other person cuts your commute emissions in half. Apps like Waze Carpool make it easy to find partners.',
            icon: '🚗',
            annualSavingsKg: 900,
            difficulty: 'easy',
            costIndicator: 'saves',
            costNote: 'Split fuel costs 50%',
            condition: (data) => data.transport.primaryCommute === 'car' && data.transport.annualKm > 8000,
            category: 'transport'
        },
        {
            id: 'transport-ev',
            title: 'Consider an Electric Vehicle',
            description: 'EVs produce 50-70% fewer lifecycle emissions than petrol cars. With growing charging infrastructure, the switch is more practical than ever.',
            icon: '⚡',
            annualSavingsKg: 1800,
            difficulty: 'hard',
            costIndicator: 'investment',
            costNote: 'Higher upfront cost, lower running costs',
            condition: (data) => data.transport.vehicleType === 'petrol' || data.transport.vehicleType === 'diesel',
            category: 'transport'
        },
        {
            id: 'transport-flights',
            title: 'Choose Train for Short Distances',
            description: 'Trains emit up to 90% less CO₂ than flights for journeys under 600km. Consider rail alternatives for domestic trips.',
            icon: '🚄',
            annualSavingsKg: 800,
            difficulty: 'medium',
            costIndicator: 'neutral',
            costNote: 'Often comparable in total travel time',
            condition: (data) => data.transport.flightsPerYear > 2,
            category: 'transport'
        },
        {
            id: 'transport-reduce-flights',
            title: 'Reduce One Long-Haul Flight',
            description: 'A single transatlantic round-trip generates ~2.2 tonnes of CO₂. Consider video conferencing or closer vacation destinations.',
            icon: '✈️',
            annualSavingsKg: 2200,
            difficulty: 'medium',
            costIndicator: 'saves',
            costNote: 'Significant ticket savings',
            condition: (data) => data.transport.flightsPerYear > 3,
            category: 'transport'
        },
        {
            id: 'transport-remote-work',
            title: 'Work From Home More Often',
            description: 'Each day working remotely eliminates your commute emissions entirely. Even 1-2 days/week makes a significant impact.',
            icon: '🏠',
            annualSavingsKg: 600,
            difficulty: 'easy',
            costIndicator: 'saves',
            costNote: 'Save on commute costs',
            condition: (data) => data.transport.primaryCommute === 'car' && data.transport.annualKm > 10000,
            category: 'transport'
        }
    ],

    food: [
        {
            id: 'food-meatless-monday',
            title: 'Try Meatless Mondays',
            description: 'Replacing meat with plant-based meals just one day a week reduces your food footprint by ~15%. Start with familiar dishes like pasta or stir-fry.',
            icon: '🥗',
            annualSavingsKg: 400,
            difficulty: 'easy',
            costIndicator: 'saves',
            costNote: 'Plant proteins are typically cheaper',
            condition: (data) => data.food.dietType === 'highMeat' || data.food.dietType === 'mediumMeat',
            category: 'food'
        },
        {
            id: 'food-reduce-beef',
            title: 'Swap Beef for Chicken or Fish',
            description: 'Beef produces 5x more emissions than chicken. Swapping beef meals for poultry or fish significantly cuts your carbon impact.',
            icon: '🍗',
            annualSavingsKg: 600,
            difficulty: 'easy',
            costIndicator: 'neutral',
            costNote: 'Chicken is often cheaper than beef',
            condition: (data) => data.food.dietType === 'highMeat',
            category: 'food'
        },
        {
            id: 'food-reduce-waste',
            title: 'Meal Planning & Composting',
            description: 'Plan meals weekly to reduce food waste. Compost unavoidable scraps instead of sending them to landfill where they produce methane.',
            icon: '♻️',
            annualSavingsKg: 300,
            difficulty: 'easy',
            costIndicator: 'saves',
            costNote: 'Save ~$1,500/year on wasted food',
            condition: (data) => data.food.foodWaste === 'average' || data.food.foodWaste === 'high',
            category: 'food'
        },
        {
            id: 'food-local-seasonal',
            title: 'Buy Local & Seasonal Produce',
            description: 'Locally sourced, seasonal food requires less transportation and refrigeration. Visit farmers\' markets for the freshest, lowest-emission options.',
            icon: '🌾',
            annualSavingsKg: 200,
            difficulty: 'easy',
            costIndicator: 'neutral',
            costNote: 'Often fresher and same price',
            condition: (data) => data.food.localFood === false,
            category: 'food'
        },
        {
            id: 'food-plant-milk',
            title: 'Switch to Plant-Based Milk',
            description: 'Oat milk produces 80% fewer emissions than dairy milk. It\'s an easy swap for coffee, cereal, and cooking.',
            icon: '🥛',
            annualSavingsKg: 150,
            difficulty: 'easy',
            costIndicator: 'neutral',
            costNote: 'Prices now comparable to dairy',
            condition: (data) => data.food.dietType !== 'vegan',
            category: 'food'
        },
        {
            id: 'food-go-vegetarian',
            title: 'Try a Vegetarian Diet',
            description: 'Going vegetarian reduces your food emissions by ~33% compared to an average meat diet. There are thousands of delicious recipes to explore.',
            icon: '🥬',
            annualSavingsKg: 800,
            difficulty: 'hard',
            costIndicator: 'saves',
            costNote: 'Plant-based diets are typically cheaper',
            condition: (data) => data.food.dietType === 'highMeat' || data.food.dietType === 'mediumMeat',
            category: 'food'
        }
    ],

    energy: [
        {
            id: 'energy-green-provider',
            title: 'Switch to Green Energy Provider',
            description: 'Many utilities offer 100% renewable energy plans. The switch is usually seamless with no installation required.',
            icon: '💚',
            annualSavingsKg: 1500,
            difficulty: 'easy',
            costIndicator: 'neutral',
            costNote: 'Often same or slightly higher cost',
            condition: (data) => data.energy.electricitySource !== 'renewable',
            category: 'energy'
        },
        {
            id: 'energy-insulation',
            title: 'Improve Home Insulation',
            description: 'Proper insulation can reduce heating/cooling energy by 25%. Check loft, walls, and windows for heat loss.',
            icon: '🏗️',
            annualSavingsKg: 700,
            difficulty: 'hard',
            costIndicator: 'investment',
            costNote: 'Pays back in 3-5 years through savings',
            condition: (data) => data.energy.homeSize === 'large' || data.energy.homeSize === 'veryLarge',
            category: 'energy'
        },
        {
            id: 'energy-thermostat',
            title: 'Lower Thermostat by 2°C',
            description: 'Each degree reduction saves about 320 kg CO₂/year. Wear a sweater indoors and use smart thermostats for optimal scheduling.',
            icon: '🌡️',
            annualSavingsKg: 640,
            difficulty: 'easy',
            costIndicator: 'saves',
            costNote: 'Save ~$150/year on heating',
            condition: (data) => data.energy.heatingType !== 'heatPump',
            category: 'energy'
        },
        {
            id: 'energy-led-bulbs',
            title: 'Switch All Lights to LED',
            description: 'LED bulbs use 75% less energy and last 25x longer than incandescent bulbs. They pay for themselves within months.',
            icon: '💡',
            annualSavingsKg: 200,
            difficulty: 'easy',
            costIndicator: 'saves',
            costNote: 'Lower electricity bills',
            condition: () => true,
            category: 'energy'
        },
        {
            id: 'energy-solar',
            title: 'Install Solar Panels',
            description: 'Rooftop solar can eliminate 80%+ of your electricity emissions. Government incentives often cover 30% of installation costs.',
            icon: '☀️',
            annualSavingsKg: 2500,
            difficulty: 'hard',
            costIndicator: 'investment',
            costNote: 'Significant upfront cost, long-term savings',
            condition: (data) => data.energy.electricitySource !== 'renewable',
            category: 'energy'
        },
        {
            id: 'energy-heat-pump',
            title: 'Consider a Heat Pump',
            description: 'Heat pumps are 3-4x more efficient than gas boilers. They work for both heating and cooling, reducing year-round emissions.',
            icon: '🔄',
            annualSavingsKg: 1200,
            difficulty: 'hard',
            costIndicator: 'investment',
            costNote: 'Government rebates often available',
            condition: (data) => data.energy.heatingType === 'naturalGas' || data.energy.heatingType === 'oil',
            category: 'energy'
        },
        {
            id: 'energy-unplug',
            title: 'Eliminate Standby Power',
            description: 'Devices on standby can account for 10% of your electricity bill. Use power strips to easily cut phantom loads.',
            icon: '🔌',
            annualSavingsKg: 100,
            difficulty: 'easy',
            costIndicator: 'saves',
            costNote: 'Save ~$100/year on electricity',
            condition: () => true,
            category: 'energy'
        }
    ],

    shopping: [
        {
            id: 'shopping-secondhand',
            title: 'Buy Second-Hand Clothing',
            description: 'The fashion industry produces 10% of global emissions. Buying pre-owned extends garment life and prevents manufacturing emissions.',
            icon: '👕',
            annualSavingsKg: 200,
            difficulty: 'easy',
            costIndicator: 'saves',
            costNote: 'Significantly cheaper than new',
            condition: (data) => data.shopping.clothingHabit === 'fastFashion',
            category: 'shopping'
        },
        {
            id: 'shopping-extend-devices',
            title: 'Extend Device Lifetime to 4+ Years',
            description: 'Manufacturing a smartphone generates ~70 kg CO₂. Using your phone one extra year reduces its per-year footprint by 25%.',
            icon: '📱',
            annualSavingsKg: 150,
            difficulty: 'easy',
            costIndicator: 'saves',
            costNote: 'Avoid upgrade costs',
            condition: (data) => data.shopping.electronicsFrequency === 'frequent',
            category: 'shopping'
        },
        {
            id: 'shopping-reduce-deliveries',
            title: 'Consolidate Online Orders',
            description: 'Batch your online orders to reduce delivery trips. Choose standard shipping over express to allow efficient route planning.',
            icon: '📦',
            annualSavingsKg: 100,
            difficulty: 'easy',
            costIndicator: 'saves',
            costNote: 'Often free standard shipping',
            condition: (data) => data.shopping.deliveryFrequency === 'weekly' || data.shopping.deliveryFrequency === 'daily',
            category: 'shopping'
        },
        {
            id: 'shopping-minimalism',
            title: 'Practice Conscious Consumption',
            description: 'Before buying, ask: Do I need this? Quality over quantity reduces both emissions and clutter. The most sustainable product is the one not made.',
            icon: '🎯',
            annualSavingsKg: 400,
            difficulty: 'medium',
            costIndicator: 'saves',
            costNote: 'Major savings from buying less',
            condition: (data) => data.shopping.spendingLevel === 'high',
            category: 'shopping'
        },
        {
            id: 'shopping-repair',
            title: 'Repair Instead of Replace',
            description: 'Learning basic repairs extends product life significantly. Many communities have repair cafes where you can get free help.',
            icon: '🔧',
            annualSavingsKg: 180,
            difficulty: 'medium',
            costIndicator: 'saves',
            costNote: 'Repair costs fraction of replacement',
            condition: () => true,
            category: 'shopping'
        },
        {
            id: 'shopping-sustainable-brands',
            title: 'Choose Sustainable Brands',
            description: 'Look for B-Corp, Fair Trade, or carbon-neutral certified brands. They typically produce 40-60% fewer emissions through responsible manufacturing.',
            icon: '🌱',
            annualSavingsKg: 250,
            difficulty: 'medium',
            costIndicator: 'neutral',
            costNote: 'Sometimes slightly more expensive',
            condition: (data) => data.shopping.clothingHabit === 'fastFashion' || data.shopping.spendingLevel === 'high',
            category: 'shopping'
        }
    ],

    /**
     * Smart recommendation engine
     * Analyzes user's footprint and returns personalized, prioritized recommendations
     */
    getPersonalized(footprintData) {
        const allRecs = [
            ...this.transport,
            ...this.food,
            ...this.energy,
            ...this.shopping
        ];

        // Filter recommendations based on conditions
        const applicable = allRecs.filter(rec => {
            try {
                return rec.condition(footprintData);
            } catch {
                return false;
            }
        });

        // Calculate category percentages
        const total = footprintData.total || 1;
        const categoryPct = {
            transport: ((footprintData.categories?.transport || 0) / total) * 100,
            food: ((footprintData.categories?.food || 0) / total) * 100,
            energy: ((footprintData.categories?.energy || 0) / total) * 100,
            shopping: ((footprintData.categories?.shopping || 0) / total) * 100
        };

        // Score and sort by impact
        const scored = applicable.map(rec => {
            let score = rec.annualSavingsKg;
            // Boost recommendations for high-contributing categories
            if (categoryPct[rec.category] > 35) score *= 1.5;
            else if (categoryPct[rec.category] > 25) score *= 1.2;
            // Slight boost for easier actions
            if (rec.difficulty === 'easy') score *= 1.1;
            return { ...rec, score };
        });

        scored.sort((a, b) => b.score - a.score);

        // Return top 8 recommendations
        return scored.slice(0, 8);
    },

    /**
     * Get all recommendations for a specific category
     */
    getByCategory(category) {
        return this[category] || [];
    },

    /**
     * Calculate total potential savings from a set of recommendations
     */
    calculateTotalSavings(recommendations) {
        return recommendations.reduce((sum, rec) => sum + rec.annualSavingsKg, 0);
    }
};

window.EcoTrack = EcoTrack;
