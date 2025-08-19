function calculate() {
  const country = document.getElementById("country").value;
  const currency = document.getElementById("currency").value;
  const familySize = parseInt(document.getElementById("family-size").value);
  const salary = parseFloat(document.getElementById("salary").value) || 0;
  const livingType = document.getElementById("living-type").value;

  // Currency symbols
  const symbols = {
    USD: "$",
    AED: "د.إ",
    SAR: "﷼",
    QAR: "﷼",
    OMR: "﷼",
    KWD: "د.ك",
    BHD: ".د.ب"
  };

  let baseRent = 800, utilities = 200, food = 300, transport = 120, entertainment = 100;

  // Adjust base by country
  switch (country) {
    case "UAE": baseRent = 1200; break;
    case "Saudi": baseRent = 1000; break;
    case "Qatar": baseRent = 1300; break;
    case "Oman": baseRent = 700; break;
    case "Kuwait": baseRent = 1100; break;
    case "Bahrain": baseRent = 900; break;
  }

  // Living type multiplier
  let multiplier = 1;
  if (livingType === "moderate") multiplier = 1.5;
  if (livingType === "luxury") multiplier = 2.5;

  // Calculate expenses
  let rent = baseRent * multiplier;
  let util = utilities * multiplier;
  let foodCost = food * familySize * multiplier;
  let transportCost = transport * multiplier;
  let entertainmentCost = entertainment * multiplier;
  let schooling = familySize > 1 ? 300 * (familySize - 1) * multiplier : 0;

  let total = rent + util + foodCost + transportCost + schooling + entertainmentCost;

  // Salary comparison
  let balance = salary - total;
  let financialStatus = balance >= 0 ? "✅ Within budget" : "⚠️ Expenses exceed salary";

  // Output
  document.getElementById("results").innerHTML = `
    <h3>Estimated Monthly Expenses (${country})</h3>
    <table border="1" cellpadding="6">
      <tr><td>Rent</td><td>${symbols[currency]} ${rent.toFixed(2)}</td></tr>
      <tr><td>Utilities</td><td>${symbols[currency]} ${util.toFixed(2)}</td></tr>
      <tr><td>Food & Groceries</td><td>${symbols[currency]} ${foodCost.toFixed(2)}</td></tr>
      <tr><td>Transport</td><td>${symbols[currency]} ${transportCost.toFixed(2)}</td></tr>
      <tr><td>Schooling</td><td>${symbols[currency]} ${schooling.toFixed(2)}</td></tr>
      <tr><td>Entertainment & Misc</td><td>${symbols[currency]} ${entertainmentCost.toFixed(2)}</td></tr>
      <tr><th>Total</th><th>${symbols[currency]} ${total.toFixed(2)}</th></tr>
    </table>
    <p><strong>Your Salary:</strong> ${symbols[currency]} ${salary.toFixed(2)}</p>
    <p><strong>Balance:</strong> ${symbols[currency]} ${balance.toFixed(2)} — ${financialStatus}</p>
  `;
}
