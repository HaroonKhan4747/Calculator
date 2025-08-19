document.getElementById("calculate").addEventListener("click", () => {
  const country = document.getElementById("country").value;
  const familySize = parseInt(document.getElementById("familySize").value) || 1;
  const livingType = document.getElementById("livingType").value;
  const salary = parseFloat(document.getElementById("salary").value) || 0;

  // Currency map
  const currencies = {
    UAE: "AED",
    Qatar: "QAR",
    Saudi: "SAR",
    Kuwait: "KWD",
    Bahrain: "BHD",
    Oman: "OMR"
  };

  const currency = currencies[country] || "USD";

  // Base expenses per family member (USD for calculation simplicity)
  const baseExpenses = {
    basic: { rent: 400, utilities: 100, food: 150, transport: 60, schooling: 0, entertainment: 50 },
    moderate: { rent: 800, utilities: 200, food: 300, transport: 120, schooling: 100, entertainment: 100 },
    luxury: { rent: 1500, utilities: 300, food: 500, transport: 200, schooling: 300, entertainment: 300 }
  };

  const chosen = baseExpenses[livingType];
  let total = 0;
  let resultHTML = `
    <h3>Estimating the best value for you...</h3>
    <h3>Estimated Monthly Expenses (${currency})</h3>
    <ul>
  `;

  for (const [key, value] of Object.entries(chosen)) {
    const cost = value * familySize;
    total += cost;
    resultHTML += `<li>${capitalize(key)}: ${currency} ${cost.toFixed(2)}</li>`;
  }

  resultHTML += `</ul><strong>Total: ${currency} ${total.toFixed(2)}</strong>`;

  if (salary > 0) {
    if (salary >= total) {
      resultHTML += `<p>✅ Your salary of ${salary} USD is enough to cover estimated expenses.</p>`;
    } else {
      resultHTML += `<p>⚠️ Your salary of ${salary} USD may not be sufficient for these expenses.</p>`;
    }
  }

  document.getElementById("results").innerHTML = resultHTML;
});

// Helper function
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
