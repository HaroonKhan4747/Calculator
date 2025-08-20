/* ======= Data ======= */
// Currency conversion rates (1 USD = X currency)
const RATES = { AED: 3.67, SAR: 3.75, QAR: 3.64, KWD: 0.306, BHD: 0.376, OMR: 0.384 };
// Symbols (english-only tags)
const SYMBOLS = { AED: "AED", SAR: "SAR", QAR: "QAR", KWD: "KWD", BHD: "BHD", OMR: "OMR" };

// Country multiplier vs USD baseline
const COUNTRY_MULTIPLIER = {
  Dubai: 1.10,
  UAE: 1.00,
  Saudi: 0.85,
  Qatar: 0.95,
  Kuwait: 0.95,
  Oman: 0.75,
  Bahrain: 0.80
};

// Baseline monthly line-items in USD for ONE adult at each living type
const BASELINE_USD = {
  Basic:    { housing: 400,  utilities: 80,  foodPerPerson: 150, transportPerPerson: 60,  miscPerPerson: 50,  schoolingPerChild: 0   },
  Moderate: { housing: 1000, utilities: 150, foodPerPerson: 300, transportPerPerson: 120, miscPerPerson: 150, schoolingPerChild: 300 },
  Luxury:   { housing: 2500, utilities: 250, foodPerPerson: 500, transportPerPerson: 300, miscPerPerson: 400, schoolingPerChild: 800 }
};

/* ======= Helpers ======= */
function fm(amount, currency) {
  const sym = SYMBOLS[currency] || "";
  return `${sym} ${Number(amount).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

/* ======= Calculator ======= */
function calculate() {
  const country = document.getElementById("country").value;
  const familySize = Math.max(1, parseInt(document.getElementById("familySize").value || "1", 10));
  const livingType = document.getElementById("livingType").value;
  const currency = document.getElementById("currency").value;
  const salaryInput = parseFloat(document.getElementById("salary").value || "0");

  const mult = COUNTRY_MULTIPLIER[country] || 1;
  const base = BASELINE_USD[livingType];

  // USD estimates
  const housingUSD   = base.housing * mult;                          // per household
  const utilUSD      = base.utilities * mult * (1 + 0.2 * (familySize - 1)); // scales with headcount
  const foodUSD      = base.foodPerPerson * familySize * mult;
  const transportUSD = base.transportPerPerson * familySize * mult;
  const miscUSD      = base.miscPerPerson * familySize * mult;

  // schooling if family size >= 3 (assume children = familySize - 2)
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

  // Salary in selected currency
  const salary = isNaN(salaryInput) ? 0 : salaryInput;
  const leftover = salary - total;
  const usedPct = salary > 0 ? Math.round((total / salary) * 100) : null;

  let statusHtml = `<span class="status-bad">Enter your salary to compare.</span>`;
  if (salary > 0) {
    statusHtml = leftover >= 0
      ? `<span class="status-ok">✅ Covers estimates. Leftover: ${fm(leftover, currency)} (${100 - usedPct}% of salary)</span>`
      : `<span class="status-bad">⚠️ Short by ${fm(Math.abs(leftover), currency)} (${usedPct}% of salary needed)</span>`;
  }

  // Quick tip
  let tip = "";
  if (salary > 0) {
    if (leftover < 0) {
      tip = "Tip: Try Basic living, consider a cheaper area, or reduce transport/dining to close the gap.";
    } else if (leftover < total * 0.15) {
      tip = "Tip: You’re close. Avoid premium rent areas or reduce eating-out to improve your buffer.";
    } else {
      tip = "Tip: Healthy buffer. Consider saving/investing a portion each month.";
    }
  }

  const results = document.getElementById("results");
  results.classList.remove("hidden");
  results.innerHTML = `
    <div class="result-head">
      <div>
        <div><strong>Country:</strong> ${country === "Dubai" ? "Dubai (UAE)" : country}</div>
        <div><strong>Family Size:</strong> ${familySize}</div>
        <div><strong>Living Type:</strong> ${livingType}</div>
      </div>
      <div>
        <div><strong>Total Estimated:</strong> ${fm(total, currency)}</div>
        <div><strong>Your Salary:</strong> ${salary > 0 ? fm(salary, currency) : "—"}</div>
        <div>${statusHtml}</div>
      </div>
    </div>

    <table class="table">
      <thead><tr><th>Category</th><th>Estimate</th></tr></thead>
      <tbody>
        <tr><td>Housing (rent)</td><td>${fm(housing, currency)}</td></tr>
        <tr><td>Utilities (power, water, internet)</td><td>${fm(utilities, currency)}</td></tr>
        <tr><td>Food & groceries</td><td>${fm(food, currency)}</td></tr>
        <tr><td>Transport</td><td>${fm(transport, currency)}</td></tr>
        <tr><td>Schooling ${children > 0 ? `(${children} child${children>1?"ren":""})` : "(n/a)"}</td><td>${fm(schooling, currency)}</td></tr>
        <tr><td>Entertainment & Misc</td><td>${fm(misc, currency)}</td></tr>
      </tbody>
      <tfoot>
        <tr><td>Total</td><td>${fm(total, currency)}</td></tr>
      </tfoot>
    </table>

    <p class="muted" style="margin-top:8px;">${tip}</p>
    <p class="muted">Estimates only. Real costs vary by city & neighborhood.</p>
  `;
}

/* ======= Events ======= */
// Calculate button
document.getElementById("calcBtn").addEventListener("click", calculate);
// Enter key in salary field triggers calculate
document.getElementById("salary").addEventListener("keydown", (e) => {
  if (e.key === "Enter") calculate();
});

// Hamburger toggle
const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");
hamburger.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
});
