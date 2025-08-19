function calculateExpenses() {
    const country = document.getElementById("country").value;
    const familySize = parseInt(document.getElementById("familySize").value);
    const livingType = document.getElementById("livingType").value;
    const salary = parseFloat(document.getElementById("salary").value);

    // Base expense estimates (per person)
    const baseCosts = {
        uae: { rent: 1200, utilities: 250, food: 450, transport: 180, entertainment: 150 },
        qatar: { rent: 1000, utilities: 220, food: 400, transport: 170, entertainment: 140 },
        saudi: { rent: 900, utilities: 200, food: 380, transport: 160, entertainment: 130 },
        oman: { rent: 850, utilities: 180, food: 350, transport: 150, entertainment: 120 },
        bahrain: { rent: 950, utilities: 210, food: 390, transport: 165, entertainment: 135 },
        kuwait: { rent: 1100, utilities: 230, food: 420, transport: 175, entertainment: 145 }
    };

    // Currency labels
    const currencyLabels = {
        uae: "AED",
        qatar: "QAR",
        saudi: "SAR",
        oman: "OMR",
        bahrain: "BHD",
        kuwait: "KWD"
    };

    const costs = baseCosts[country];
    let multiplier = 1;

    if (livingType === "luxury") multiplier = 2;
    if (livingType === "basic") multiplier = 0.8;

    const rent = costs.rent * multiplier;
    const utilities = costs.utilities * multiplier;
    const food = costs.food * familySize * multiplier;
    const transport = costs.transport * familySize * multiplier;
    const entertainment = costs.entertainment * familySize * multiplier;
    const schooling = familySize > 2 ? 300 * (familySize - 2) : 0;

    const total = rent + utilities + food + transport + entertainment + schooling;
    const balance = salary ? salary - total : null;

    const currency = currencyLabels[country];

    let resultHTML = `
        <h3>Estimated Monthly Expenses (${currency})</h3>
        <ul>
            <li>Rent: ${currency} ${rent.toFixed(2)}</li>
            <li>Utilities (power, water, internet): ${currency} ${utilities.toFixed(2)}</li>
            <li>Food & groceries: ${currency} ${food.toFixed(2)}</li>
            <li>Transport: ${currency} ${transport.toFixed(2)}</li>
            <li>Schooling: ${currency} ${schooling.toFixed(2)}</li>
            <li>Entertainment & Misc: ${currency} ${entertainment.toFixed(2)}</li>
        </ul>
        <strong>Total: ${currency} ${total.toFixed(2)}</strong>
    `;

    if (salary) {
        resultHTML += `<p><strong>Your Salary:</strong> ${currency} ${salary.toFixed(2)}</p>`;
        resultHTML += `<p><strong>Remaining Balance:</strong> ${currency} ${balance.toFixed(2)}</p>`;
    }

    document.getElementById("results").innerHTML = resultHTML;
}
