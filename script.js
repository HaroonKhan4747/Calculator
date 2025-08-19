function calculateExpenses() {
  const country = document.getElementById("country").value;
  const currency = document.getElementById("currency").value;
  const salary = parseFloat(document.getElementById("salary").value) || 0;
  const familySize = parseInt(document.getElementById("family").value) || 1;
  const lifestyle = document.getElementById("lifestyle").value;

  let baseCost = 800; // default baseline cost

  switch (country) {
    case "UAE": baseCost = 1200; break;
    case "Saudi": baseCost = 900; break;
    case "Qatar": baseCost = 1100; break;
    case "Oman": baseCost = 800; break;
    case "Bahrain": baseCost = 950; break;
    case "Kuwait": baseCost = 1000; break;
  }

  // Adjust for family size
  let total = baseCost * familySize;

  // Adjust for lifestyle
  if (lifestyle === "moderate") total *= 1.5;
  if (lifestyle === "luxury") total *= 2.5;

  // Breakdown
  const breakdown = {
    Housing: (total * 0.45).toFixed(0),
    Utilities: (total * 0.10).toFixed(0),
    Food: (total * 0.20).toFixed(0),
    Transport: (total * 0.10).toFixed(0),
    Schooling: (familySize > 1 ? (total * 0.10).toFixed(0) : 0),
    Entertainment: (total * 0.05).toFixed(0),
  };

  // Salary comparison
  let message = "";
  if (salary > 0) {
    if (salary >= total) {
      message = `<p style="color:green;">✅ Your salary seems enough to comfortably cover your expenses.</p>`;
    } else {
      message = `<p style="color:red;">⚠️ Your salary may not be enough to cover these expenses. Consider adjusting lifestyle or location.</p>`;
    }
  }

  // Display results
  let resultHTML = `
    <h2>Estimated Monthly Expenses in ${country}</h2>
    <table>
      <tr><th>Category</th><th>Cost (${currency})</th></tr>
      <tr><td>Housing</td><td>${breakdown.Housing}</td></tr>
      <tr><td>Utilities</td><td>${breakdown.Utilities}</td></tr>
      <tr><td>Food & Groceries</td><td>${breakdown.Food}</td></tr>
      <tr><td>Transport</td><td>${breakdown.Transport}</td></tr>
      <tr><td>Schooling</td><td>${breakdown.Schooling}</td></tr>
      <tr><td>Entertainment & Misc</td><td>${breakdown.Entertainment}</td></tr>
      <tr><th>Total</th><th>${total.toFixed(0)}</th></tr>
    </table>
    <p><em>Note: These are estimated values and may vary based on lifestyle and city within ${country}.</em></p>
    ${message}
  `;

  document.getElementById("results").innerHTML = resultHTML;
}
