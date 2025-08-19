// Existing calculator code kept intact...
const RATES = {
  AED: 1, SAR: 3.75, QAR: 3.64, KWD: 0.306, BHD: 0.376, OMR: 0.384
};

const SYMBOLS = { AED:"AED", SAR:"SAR", QAR:"QAR", KWD:"KWD", BHD:"BHD", OMR:"OMR" };

const COUNTRY_MULTIPLIER = {
  Dubai: 1.1, UAE:1.0, Saudi:0.85, Qatar:0.95, Kuwait:0.95, Oman:0.75, Bahrain:0.8
};

const BASELINE_USD = {
  Basic:    { housing: 400, utilities: 80,  foodPerPerson: 150, transportPerPerson: 60, miscPerPerson: 50, schoolingPerChild: 0 },
  Moderate: { housing:1000, utilities:150, foodPerPerson:300, transportPerPerson:120, miscPerPerson:150, schoolingPerChild:300 },
  Luxury:   { housing:2500, utilities:250, foodPerPerson:500, transportPerPerson:300, miscPerPerson:400, schoolingPerChild:800 }
};

function fm(amount, currency) {
  const sym = SYMBOLS[currency] || "";
  return `${sym} ${Number(amount).toLocaleString(undefined, { maximumFractionDigits:0 })}`;
}

function calculate() {
  const country = document.getElementById("country").value;
  const familySize = Math.max(1, parseInt(document.getElementById("familySize").value || "1", 10));
  const livingType = document.getElementById("livingType").value;
  const currency = document.getElementById("currency").value;
  const salaryInput = parseFloat(document.getElementById("salary").value || "0");

  const mult = COUNTRY_MULTIPLIER[country] || 1;
  const base = BASELINE_USD[livingType];

  const housingUSD   = base.housing * mult;
  const utilUSD      = base.utilities * mult * (1 + 0.2*(familySize-1));
  const foodUSD      = base.foodPerPerson * familySize * mult;
  const transportUSD = base.transportPerPerson * familySize * mult;
  const miscUSD      = base.miscPerPerson * familySize * mult;

  const children = Math.max(0, familySize-2);
  const schoolingUSD = base.schoolingPerChild * children * mult;

  const totalUSD = housingUSD + utilUSD + foodUSD + transportUSD + miscUSD + schoolingUSD;

  const rate = RATES[currency] || 1;
  const housing   = housingUSD*rate;
  const utilities = utilUSD*rate;
  const food      = foodUSD*rate;
  const transport = transportUSD*rate;
  const schooling = schoolingUSD*rate;
  const misc      = miscUSD*rate;
  const total     = totalUSD*rate;

  const salary = isNaN(salaryInput) ? 0 : salaryInput;
  const leftover = salary-total;

  const status = salary<=0
    ? `<span class="status bad">Enter your salary to compare.</span>`
    : leftover>=0
      ? `<span class="status ok">✅ Salary covers estimated expenses. Leftover: ${fm(leftover,currency)}</span>`
      : `<span class="status bad">⚠️ Salary may be insufficient. Short by ${fm(Math.abs(leftover),currency)}</span>`;

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
        <div><strong>Total Estimated:</strong> ${fm(total,currency)}</div>
        <div><strong>Your Salary:</strong> ${salary>0 ? fm(salary,currency) : "—"}</div>
        <div>${status}</div>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("calcBtn");
  if(btn) btn.addEventListener("click", calculate);

  // Hamburger menu toggle
  const menuBtn = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  if(menuBtn && navMenu){
    menuBtn.addEventListener("click", () => {
      navMenu.classList.toggle("show");
    });
  }
});
