function calculate() {
  const country = document.getElementById("country").value;
  const familySize = parseInt(document.getElementById("family-size").value) || 1;

  // Sample base monthly costs (in USD for simplicity)
  const baseCosts = {
    UAE: 1200,
    Saudi: 900,
    Qatar: 1100,
    Oman: 800,
    Kuwait: 1000,
    Bahrain: 850,
  };

  // If country not found, exit
  if (!baseCosts[country]) {
    document.getElementById("results").innerHTML =
      "<p>Please select a valid country.</p>";
    return;
  }

  // Calculate estimated expenses
  const expense = baseCosts[country] * familySize;

  // Show result
  document.getElementById("results").innerHTML = `
    <h3>Estimated Monthly Expense</h3>
    <p><strong>${country}</strong> for a family of ${familySize}: 
    <span style="color:green;">$${expense.toLocaleString()}</span></p>
    <small>(Approximate, excluding rent & lifestyle)</small>
  `;
}

