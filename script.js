// Toggle Hamburger Menu
document.getElementById("hamburger").addEventListener("click", function () {
  document.getElementById("navLinks").classList.toggle("show");
});

// Smooth Scroll for Nav Links
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Calculate Expenses
document.getElementById("calculate").addEventListener("click", function () {
  const family = parseInt(document.getElementById("family").value) || 1;
  const lifestyle = document.getElementById("lifestyle").value;
  const country = document.getElementById("country").value;
  const currency = document.getElementById("currency").value;
  const salary = parseFloat(document.getElementById("salary").value) || 0;

  // Updated base costs (more realistic)
  let base = { rent: 0, food: 0, transport: 0, utilities: 0, misc: 0 };
  if (lifestyle === "budget") base = { rent: 400, food: 200, transport: 120, utilities: 100, misc: 80 };
  if (lifestyle === "moderate") base = { rent: 800, food: 350, transport: 200, utilities: 150, misc: 200 };
  if (lifestyle === "luxury") base = { rent: 2000, food: 700, transport: 400, utilities: 300, misc: 600 };

  // Adjust by family size (non-linear: 1st person full, others add 70%)
  for (let key in base) base[key] = Math.round(base[key] * (1 + (family - 1) * 0.7));

  // Currency conversion (approx. Aug 2025)
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
