function calculate() {
  const country = document.getElementById("country").value;
  const familySize = parseInt(document.getElementById("family-size").value);
  const livingType = document.getElementById("living-type").value;
  const salary = parseFloat(document.getElementById("salary").value);

  // Example base costs in local currency (in English symbols)
  const baseCosts = {
    UAE: { amount: 1200, currency: "AED" },
    Saudi: { amount: 1000, currency: "SAR" },
    Qatar: { amount: 1100, currency: "QAR" },
    Oman: { amount: 900, currency: "OMR" },
    Kuwait: { amount: 1050, currency: "KWD" },
    Bahrain: { amount: 950, currency: "BHD" },
  };

  // Living type multiplier
  const livingMultipliers = {
    Basic: 1,
    Moderate: 1.4,
    Luxury: 2,
  };

  let base = baseCosts[country] ? baseCosts[country].amount : 1000;
  let currency = baseCosts[country] ? baseCosts[country].currency : "USD";

  let adjusted = base * familySize * livingMultipliers[livingType];

  let breakdown = `
    <h3>Estimated Monthly Expenses in ${country} (${livingType} living)</h3>
    <table>
      <tr><td>Housing (rent)</td><td>${currency} ${(adjusted * 0.54).toFixed(2)}</td></tr>
      <tr><td>Utilities (power, water, internet)</td><td>${currency} ${(adjusted * 0.11).toFixed(2)}</td></tr>
      <tr><td>Food & groceries</td><td>${currency} ${(adjusted * 0.19).toFixed(2)}</td></tr>
      <tr><td>Transport</td><td>${currency} ${(adjusted * 0.08).toFixed(2)}</td></tr>
      <tr><td>Schooling</td><td>${currency} ${(familySize > 1 ? adjusted * 0.10 : 0).toFixed(2)}</td></tr>
      <tr><td>Entertainment & Misc</td><td>${currency} ${(adjusted * 0.07).toFixed(2)}</td></tr>
      <tr class="total"><td>Total</td><td>${currency} ${adjusted.toFixed(2)}</td></tr>
    </table>
  `;

  // Salary comparison
  let comparison = "";
  if (!isNaN(salary) && salary > 0) {
    comparison =
      salary >= adjusted
        ? `<p style="color:green">✅ Your salary of ${currency} ${salary.toFixed(
            2
          )} covers estimated expenses.</p>`
        : `<p style="color:red">⚠️ Your salary of ${currency} ${salary.toFixed(
            2
          )} may not cover estimated expenses.</p>`;
  }

  document.getElementById("results").innerHTML = breakdown + comparison;
}
