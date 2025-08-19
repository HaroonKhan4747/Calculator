// Currency conversion rates (1 USD = X currency)
const RATES = {
  USD: 1,
  AED: 3.67,
  SAR: 3.75,
  QAR: 3.64,
  KWD: 0.306,
  BHD: 0.376,
  OMR: 0.384
};

// Currency symbols
const SYMBOLS = {
  USD: "$", AED: "د.إ", SAR: "﷼", QAR: "ر.ق", KWD: "KD", BHD: "BD", OMR: "﷼"
};

// Country cost multipliers vs. USD baseline
const COUNTRY_MULTIPLIER = {
  UAE: 1.00,
  Saudi: 0.85,
  Qatar: 0.95,
  Kuwait: 0.95,
  Oman: 0.75,
  Bahrain: 0.80
};

// Baseline monthly line-items in USD for ONE adult at each living type
const BASELINE_USD = {
  Basic:    { housing: 400, utilities: 80,  foodPerPerson: 150, transportPerPerson: 60,  miscPerPerson: 50,  schoolingPerChild: 0   },
  Moderate: { housing: 1000,utilities: 150, foodPerPerson: 300, transportPerPerson: 120, miscPerPerson: 150, schoolingPerChild: 300 },
  Luxury:   { housing: 2500,utilities: 250, foodPerPerson: 500, transportPerPerson: 300, miscPerPerson: 400, schoolingPerChild: 800 }
};

// Helper: format money
function fm(amount, currency) {
  const sym = SYMBOLS[currency] || "";
  return `${sym} ${Number(amount).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function calculate() {
  const country = document.getElementById("country").value;
  const familySize = Math.max(1, parseInt(document.getElementById("familySize").value || "1", 10));
  const livingType = document.getElementById("livingType").value;
  const currency = document.getElementById("currency").value;
  const salaryInput = parseFloat(document.getElementById("salary").value || "0");

  const mult = COUNTRY_MULTIPLIER[country] || 1;
  const base = BASELINE_USD[livingType];

  // Per-line in USD before conversion
  const housingUSD   = base.housing * mult; // housing scales mostly by type + country, not by headcount
  const utilUSD      = base.utilities * mult * (1 + 0.2 * (familySize - 1)); // utilities grow with family
  const foodUSD      = base.foodPerPerson * familySize * mult;
  const transportUSD = base.transportPerPerson * familySize * mult;
  const miscUSD      = base.miscPerPerson * familySize * mult;

  // Schooling: if family size >= 3 assume number of children = familySize - 2
  const children = Math.max(0, familySize - 2);
  const schoolingUSD = base.schoolingPerChild * children * mult;

  const totalUSD = housingUSD + utilUSD + foodUSD + transportUSD + schoolingUSD + miscUSD;

  // Convert to selected currency
  const rate = RATES[currency] || 1;
  const housing   = housingUSD   * rate;
  const utilities = utilUSD      * rate;
  const food      = foodUSD      * rate;
  const transport = transportUSD * rate;
  const schooling = schoolingUSD * rate;
  const misc      = miscUSD      * rate;
  const total     = totalUSD     * rate;

  // Salary is already in selected currency (per your request)
  const salary = isNaN(salaryInput) ? 0 : salaryInput;
  const leftover = salary - total;

  // Status text
  const status =
    salary <= 0
      ? `<span class="status bad">Enter your salary to compare.</span>`
      : leftover >= 0
        ? `<span class="status ok">✅ Salary covers estimated expenses. Leftover: ${fm(leftover, currency)}</span>`
        : `<span class="status bad">⚠️ Salary may be insufficient. Short by ${fm(Math.abs(leftover), currency)}</span>`;

  // Render detailed result
  const results = document.getElementById("results");
  results.classList.remove("hidden");
  results.innerHTML = `
    <div class="result-head">
      <div>
        <div><strong>Country:</strong> ${country}</div>
        <div><strong>Family Size:</strong> ${familySize}</div>
        <div><strong>Living Type:</strong> ${livingType}</div>
      </div>
      <div>
        <div><strong>Total Estimated:</strong> ${fm(total, currency)}</div>
        <div><strong>Your Salary:</strong> ${salary > 0 ? fm(salary, currency) : "—"}</div>
        <div>${status}</div>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr><th>Category</th><th>Estimate</th></tr>
      </thead>
      <tbody>
        <tr><td>Housing (rent)</td><td>${fm(housing, currency)}</td></tr>
        <tr><td>Utilities (power, water, internet)</td><td>${fm(utilities, currency)}</td></tr>
        <tr><td>Food & groceries</td><td>${fm(food, currency)}</td></tr>
        <tr><td>Transport</td><td>${fm(transport, currency)}</td></tr>
        <tr><td>Schooling ${children > 0 ? `(${children} child${children>1?"ren":""})` : "(n/a)"} </td><td>${fm(schooling, currency)}</td></tr>
        <tr><td>Entertainment & Misc</td><td>${fm(misc, currency)}</td></tr>
      </tbody>
      <tfoot>
        <tr><td>Total</td><td>${fm(total, currency)}</td></tr>
      </tfoot>
    </table>
    <p class="muted" style="margin-top:8px;">Estimates only. Real costs vary by city & neighborhood.</p>
  `;
}

// Hook button
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("calcBtn");
  if (btn) btn.addEventListener("click", calculate);
});
