// Hamburger menu toggle
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("nav-links").classList.toggle("active");
});

// Calculator with breakdown
document.getElementById("calculateBtn").addEventListener("click", () => {
  const country = document.getElementById("country").value;
  const familySize = parseInt(document.getElementById("familySize").value);
  const livingType = document.getElementById("livingType").value;
  const salary = parseFloat(document.getElementById("salary").value);
  const currency = document.getElementById("currency").value;

  if (!salary) {
    document.getElementById("results").innerText = "⚠️ Please enter your salary.";
    return;
  }

  // Base costs per person (average per month)
  const baseCosts = {
    dubai: { rent: 2000, food: 1000, transport: 600, utilities: 400, school: 800, entertainment: 500 },
    saudi: { rent: 1800, food: 900, transport: 500, utilities: 350, school: 700, entertainment: 400 },
    qatar: { rent: 1900, food: 950, transport: 550, utilities: 380, school: 750, entertainment: 450 },
    oman: { rent: 1500, food: 800, transport: 400, utilities: 300, school: 600, entertainment: 350 },
    bahrain: { rent: 1600, food: 850, transport: 420, utilities: 320, school: 650, entertainment: 380 },
    kuwait: { rent: 2000, food: 950, transport: 500, utilities: 370, school: 720, entertainment: 420 }
  };

  let costs = { ...baseCosts[country] };

  // Scale by family size
  for (let key in costs) {
    if (key !== "rent") costs[key] *= familySize;
  }

  // Lifestyle adjustments
  let multiplier = 1;
  if (livingType === "luxury") multiplier = 1.8;
  else if (livingType === "moderate") multiplier = 1.2;

  for (let key in costs) {
    costs[key] *= multiplier;
  }

  const totalExpense = Object.values(costs).reduce((a, b) => a + b, 0);
  const remaining = salary - totalExpense;

  // Build results
  document.getElementById("results").innerHTML = `
    <h3>📊 Detailed Monthly Breakdown (${currency})</h3>
    <ul>
      <li>🏠 Rent: <strong>${costs.rent.toFixed(2)} ${currency}</strong></li>
      <li>🍽️ Food: <strong>${costs.food.toFixed(2)} ${currency}</strong></li>
      <li>🚗 Transport: <strong>${costs.transport.toFixed(2)} ${currency}</strong></li>
      <li>💡 Utilities: <strong>${costs.utilities.toFixed(2)} ${currency}</strong></li>
      <li>🎓 Schooling: <strong>${costs.school.toFixed(2)} ${currency}</strong></li>
      <li>🎉 Entertainment: <strong>${costs.entertainment.toFixed(2)} ${currency}</strong></li>
    </ul>
    <p><strong>Total Estimated Expense: ${totalExpense.toFixed(2)} ${currency}</strong></p>
    <p><strong>Remaining After Expenses: ${remaining.toFixed(2)} ${currency}</strong></p>
  `;
});
