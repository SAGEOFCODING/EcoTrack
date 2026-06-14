/**
 * EcoTrack — Carbon Offset Projects Database
 */
const EcoTrack = window.EcoTrack || {};

EcoTrack.OffsetProjects = {
    categories: [
        { id: 'all', label: 'All Projects', icon: '🌍' },
        { id: 'reforestation', label: 'Reforestation', icon: '🌳' },
        { id: 'renewable', label: 'Renewable Energy', icon: '⚡' },
        { id: 'ocean', label: 'Ocean Conservation', icon: '🌊' },
        { id: 'community', label: 'Community Projects', icon: '🏘️' },
        { id: 'technology', label: 'Carbon Tech', icon: '🔬' }
    ],

    projects: [
        {
            id: 'amazon-reforestation',
            title: 'Amazon Rainforest Restoration',
            description: 'Restoring degraded areas of the Amazon through native tree planting. Each hectare absorbs 10+ tonnes of CO₂ annually while protecting biodiversity and supporting indigenous communities.',
            category: 'reforestation',
            location: 'Brazil',
            co2PerDollar: 0.5,
            verificationStandard: 'VCS (Verra)',
            impactScore: 95,
            color: '#00d47e',
            stats: { treesPlanted: '2.4M', hectares: '15,000', species: '120+' }
        },
        {
            id: 'kenyan-mangroves',
            title: 'Kenyan Mangrove Conservation',
            description: 'Protecting and restoring coastal mangrove forests that sequester carbon 4x faster than tropical rainforests while protecting shorelines from erosion and storms.',
            category: 'reforestation',
            location: 'Kenya',
            co2PerDollar: 0.7,
            verificationStandard: 'Gold Standard',
            impactScore: 92,
            color: '#00b4d8',
            stats: { hectares: '8,500', carbonStored: '45K tonnes', communities: '12' }
        },
        {
            id: 'india-solar',
            title: 'Rural India Solar Initiative',
            description: 'Installing solar panels in rural Indian villages to replace diesel generators and kerosene lamps, providing clean energy to communities while eliminating fossil fuel emissions.',
            category: 'renewable',
            location: 'India',
            co2PerDollar: 0.8,
            verificationStandard: 'Gold Standard',
            impactScore: 90,
            color: '#ffd60a',
            stats: { villages: '350+', households: '25,000', mwInstalled: '45 MW' }
        },
        {
            id: 'scottish-wind',
            title: 'Scottish Highland Wind Farm',
            description: 'Community-owned wind farm in the Scottish Highlands generating clean electricity for 50,000 homes while funding local community development projects.',
            category: 'renewable',
            location: 'Scotland, UK',
            co2PerDollar: 0.6,
            verificationStandard: 'VCS (Verra)',
            impactScore: 88,
            color: '#00b4d8',
            stats: { turbines: '24', homesSupplied: '50,000', annualOffset: '120K tonnes' }
        },
        {
            id: 'ocean-plastic',
            title: 'Pacific Ocean Cleanup & Conservation',
            description: 'Removing plastic from the Pacific Ocean while funding research on ocean carbon sequestration. Combines direct action with scientific advancement.',
            category: 'ocean',
            location: 'Pacific Ocean',
            co2PerDollar: 0.3,
            verificationStandard: 'Plan Vivo',
            impactScore: 85,
            color: '#00b4d8',
            stats: { plasticRemoved: '2,000 tonnes', areaProtected: '1.2M km²', researchPapers: '45' }
        },
        {
            id: 'seagrass-restoration',
            title: 'Mediterranean Seagrass Restoration',
            description: 'Restoring Posidonia seagrass meadows that capture carbon 35x faster than tropical forests per unit area. Also creates critical marine habitats.',
            category: 'ocean',
            location: 'Mediterranean Sea',
            co2PerDollar: 0.4,
            verificationStandard: 'VCS (Verra)',
            impactScore: 87,
            color: '#00d47e',
            stats: { hectaresRestored: '500', carbonRate: '35x forests', speciesProtected: '200+' }
        },
        {
            id: 'clean-cookstoves',
            title: 'East African Clean Cookstoves',
            description: 'Distributing fuel-efficient cookstoves to replace open fires in East Africa. Reduces deforestation, indoor air pollution, and carbon emissions while improving community health.',
            category: 'community',
            location: 'East Africa',
            co2PerDollar: 1.2,
            verificationStandard: 'Gold Standard',
            impactScore: 93,
            color: '#ffd60a',
            stats: { stovesDistributed: '500K', emissionsReduced: '2M tonnes', livesImproved: '2.5M' }
        },
        {
            id: 'biochar-project',
            title: 'Biochar Carbon Sequestration',
            description: 'Converting agricultural waste into biochar — a stable form of carbon that improves soil health while locking carbon away for thousands of years.',
            category: 'technology',
            location: 'USA',
            co2PerDollar: 0.3,
            verificationStandard: 'Puro.earth',
            impactScore: 86,
            color: '#a78bfa',
            stats: { biocharProduced: '5,000 tonnes', soilImproved: '10,000 acres', carbonLocked: '4,000+ years' }
        },
        {
            id: 'dac-iceland',
            title: 'Direct Air Capture (Iceland)',
            description: 'State-of-the-art facility capturing CO₂ directly from the atmosphere and mineralizing it underground. The most permanent form of carbon removal available.',
            category: 'technology',
            location: 'Iceland',
            co2PerDollar: 0.02,
            verificationStandard: 'Puro.earth',
            impactScore: 98,
            color: '#a78bfa',
            stats: { annualCapture: '4,000 tonnes', permanence: '10,000+ years', energySource: '100% geothermal' }
        },
        {
            id: 'borneo-rainforest',
            title: 'Borneo Rainforest Protection',
            description: 'Preventing deforestation of 100,000 hectares of tropical rainforest in Borneo. Protects orangutan habitat and one of the most biodiverse ecosystems on Earth.',
            category: 'reforestation',
            location: 'Borneo, Malaysia',
            co2PerDollar: 0.9,
            verificationStandard: 'VCS (Verra)',
            impactScore: 94,
            color: '#00d47e',
            stats: { areaProtected: '100,000 ha', orangutans: '3,000+', biodiversity: '300+ species' }
        }
    ],

    educationalContent: {
        whatAreOffsets: 'Carbon offsets are investments in environmental projects that reduce or remove greenhouse gases from the atmosphere to compensate for emissions made elsewhere.',
        howTheyWork: 'When you buy a carbon offset, you fund a project that reduces CO₂ emissions — like planting trees, building wind farms, or capturing methane. One offset typically represents one tonne of CO₂ removed or prevented.',
        verificationStandards: {
            'VCS (Verra)': 'The world\'s most widely used voluntary GHG program. Projects are independently audited and verified.',
            'Gold Standard': 'Founded by WWF, it certifies projects that demonstrate the highest levels of environmental integrity and sustainable development.',
            'Plan Vivo': 'Focuses on community-based projects that combine carbon sequestration with livelihood improvements.',
            'Puro.earth': 'Specializes in engineered carbon removal solutions with long-term permanence guarantees.'
        },
        tips: [
            'Offsets should complement, not replace, direct emission reductions',
            'Look for verified standards like VCS or Gold Standard',
            'Consider the permanence of the offset — trees can burn, but mineralized carbon lasts millennia',
            'Community co-benefits like jobs and health improvements add extra value'
        ]
    },

    getByCategory(categoryId) {
        if (categoryId === 'all') return this.projects;
        return this.projects.filter(p => p.category === categoryId);
    },

    getById(projectId) {
        return this.projects.find(p => p.id === projectId);
    }
};

window.EcoTrack = EcoTrack;
