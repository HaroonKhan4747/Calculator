// Toggle Hamburger Menu
document.getElementById("hamburger").addEventListener("click", function () {
  document.getElementById("navLinks").classList.toggle("show");
});

// Calculate Expenses
document.getElementById("calculate").addEventListener("click", function () {
  const family = parseInt(document.getElementById("family").value) || 1;
  const lifestyle = document.getElementById("lifestyle").value;
  const country = document.getElementById("country").value;
  const currency = document.getElementById("currency").value;
  const salary = parseFloat(document.getElementById("salary").value) || 0;

  // Base costs by lifestyle
  let base = { rent: 0, food: 0, transport: 0, utilities: 0, misc: 0 };
  if (lifestyle === "budget") base = { rent: 200, food: 150, transport: 100, utilities: 80, misc: 70 };
  if (lifestyle === "moderate") base = { rent: 500, food: 300, transport: 200, utilities: 150, misc: 150 };
  if (lifestyle === "luxury") base = { rent: 1200, food: 600, transport: 400, utilities: 250, misc: 400 };

  // Adjust by family size
  for (let key in base) base[key] *= family;

  // Currency conversion (rough rates)
  const rates = { AED: 1, SAR: 1.02, QAR: 1.01, KWD: 0.083, BHD: 0.102, OMR: 0.104, USD: 0.27 };
  for (let key in base) base[key] = Math.round(base[key] * rates[currency]);

  const total = Object.values(base).reduce((a, b) => a + b, 0);

  // Show results
  const resultsDiv = document.getElementById("results");
  resultsDiv.style.display = "block";
  resultsDiv.innerHTML = `
    <h3>Estimated Monthly Expenses (${currency})</h3>
    <p><b>Rent:</b> ~${base.rent}</p>
    <p><b>Food:</b> ~${base.food}</p>
    <p><b>Transport:</b> ~${base.transport}</p>
    <p><b>Utilities:</b> ~${base.utilities}</p>
    <p><b>Miscellaneous:</b> ~${base.misc}</p>
    <hr>
    <p><b>Total Estimate:</b> ~${total} ${currency}</p>
    <p><b>Your Salary:</b> ${salary} ${currency}</p>
    <p><b>Verdict:</b> ${salary > total ? "✅ You can comfortably cover your expenses." : "⚠️ Expenses may exceed your salary."}</p>
  `;
});
