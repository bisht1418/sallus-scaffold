export const MOCK_SCAFFOLD_PRICES = {
    "Standard Frame": {
        pricePerM2: 10,
        pricePerM3: 15,
        pricePerLM: 8,
        pricePerHM: 12
    },
    "Hanging Scaffold": {
        pricePerM2: 12,
        pricePerM3: 20,
        pricePerLM: 10,
        pricePerHM: 15
    },
    "Tube & Clamp": {
        pricePerM2: 8,
        pricePerM3: 12,
        pricePerLM: 6,
        pricePerHM: 10
    }
};


export const MOCK_APPROVAL_FORMS = [
    {
        id: "SCF001",
        type: "Standard Frame",
        position: "North Wall",
        buildDate: "2024-01-01",
        dismantleDate: "2024-01-31",
        measurements: {
            m2: 100,
            m3: 0,
            lm: 0,
            hm: 0
        },
        status: "active"
    },
    {
        id: "SCF002",
        type: "Hanging Scaffold",
        position: "East Side",
        buildDate: "2024-01-05",
        dismantleDate: "2024-01-20",
        measurements: {
            m2: 0,
            m3: 50,
            lm: 0,
            hm: 0
        },
        status: "active"
    },
    {
        id: "SCF003",
        type: "Tube & Clamp",
        position: "Roof Section",
        buildDate: "2024-01-10",
        dismantleDate: null,
        measurements: {
            m2: 0,
            m3: 0,
            lm: 30,
            hm: 0
        },
        status: "active"
    }
];
