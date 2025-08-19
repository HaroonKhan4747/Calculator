// Currency conversion rates
const RATES = { AED: 1, SAR: 3.75/3.67, QAR: 3.64/3.67, KWD: 0.306/3.67, BHD: 0.376/3.67, OMR: 0.384/3.67 };

// Currency symbols for results
const SYMBOLS = { AED: "AED", SAR: "SAR", QAR: "QAR", KWD: "KWD", BHD: "BHD", OMR: "OMR" };

// Country cost multipliers vs. AED baseline
const COUNTRY_MULTIPLIER = { Dubai:1.2, UAE:1, Saudi:0.85, Qatar:0.95, Kuwait:0.95, Oman:0.75, Bahrain:0.80 };

// Baseline monthly line-items in AED for ONE adult at each living type
const BASELINE = {
  Basic:    { housing: 1500, utilities: 300, foodPerPerson: 600, transportPerPerson: 240, miscPerPerson: 200, schoolingPerChild: 0 },
  Moderate: { housing: 4000, utilities: 600, foodPerPerson: 1200, transportPerPerson: 480, miscPerPerson: 600, schoolingPerChild: 1200 },
  Luxury:   { housing:10000, utilities:1200, foodPerPerson:2500, transportPerPerson:1000, miscPerPerson:1500, schoolingPerChild:3000 }
};

function fm(amount, currency) {
  return `${SYMBOLS[currency]} ${Number(amount).toLocaleString(undefined,{maximumFractionDigits:0})}`;
}

function calculate() {
  const country = document.getElementById("country").value;
  const familySize = Math.max(1, parseInt(document.getElementById("familySize").value || "1",10));
  const livingType = document.getElementById("livingType").value;
  const currency = document.getElementById("currency").value;
  const salaryInput = parseFloat(document.getElementById("salary").value || "0");

  const mult = COUNTRY_MULTIPLIER[country] || 1;
  const base = BASELINE[livingType];

  const housing = base.housing * mult;
  const utilities = base.utilities * mult * (1 + 0.2*(familySize-1));
  const food = base.foodPerPerson * familySize * mult;
  const transport = base.transportPerPerson * familySize * mult;
  const misc = base.miscPerPerson * familySize * mult;
  const children = Math.max(0,familySize-2);
  const schooling = base.schoolingPerChild * children * mult;

  const totalAED = housing + utilities + food + transport + misc + schooling;
  const rate = RATES[currency] || 1;

  const total = totalAED * rate;
  const salary = isNaN(salaryInput) ? 0 : salaryInput;
  const leftover = salary - total;

  const status = salary <= 0
    ? `<span class="status bad">Enter your salary to compare.</span>`
    : leftover >= 0
      ? `<span class="status ok">✅ Salary covers estimated expenses. Leftover: ${fm(leftover, currency)}</span>`
      : `<span class="status bad">⚠️ Salary may be insufficient. Short by ${fm(Math.abs(leftover), currency)}</span>`;

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
        <div><strong>Your Salary:</strong> ${salary>0?fm(salary,currency):"—"}</div>
        <div>${status}</div>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr><th>Category</th><th>Estimate</th></tr>
      </thead>
      <tbody>
        <tr><td>Housing (rent)</td><td>${fm(housing*rate,currency)}</td></tr>
        <tr><td>Utilities</td><td>${fm(utilities*rate,currency)}</td></tr>
        <tr><td>Food & groceries</td><td>${fm(food*rate,currency)}</td></tr>
        <tr><td>Transport</td><td>${fm(transport*rate,currency)}</td></tr>
        <tr><td>Schooling ${children>0?`(${children} child${children>1?"ren":""})`:"(n/a)"}</td><td>${fm(schooling*rate,currency)}</td></tr>
        <tr><td>Entertainment & Misc</td><td>${fm(misc*rate,currency)}</td></tr>
      </tbody>
      <tfoot>
        <tr><td>Total</td><td>${fm(total,currency)}</td></tr>
      </tfoot>
    </table>
    <p class="muted" style="margin-top:8px;">Estimates only. Real costs vary by city & neighborhood.</p>
  `;
}

document.addEventListener("DOMContentLoaded",()=> {
  const btn = document.getElementById("calcBtn");
  if(btn) btn.addEventListener("click",calculate);
});
