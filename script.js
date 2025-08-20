/* -------------------------
  Gulf Expense Calculator
  - country data calibrated from Numbeo / market reports (Aug 2025)
  - currency conversion uses recent mid-market rates (Aug 2025)
  --------------------------*/

// UI helpers
document.getElementById("hamburger").addEventListener("click", function () {
  document.getElementById("navLinks").classList.toggle("show");
});
// smooth scroll
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

/* -------------------------
   Data sources & model:
   - For each country we store:
     - currency (local)
     - nonRentUSD: Numbeo's "single person, excluding rent" (USD)
     - rentOutsideLocal: Numbeo's 1-bedroom outside-center (in local currency)
     - localToUSD: how much 1 local unit equals USD (e.g., 1 AED = 0.2723 USD)
   See site footer / code comments for citations.
   -------------------------*/
const countries = {
  dubai:  { name: 'Dubai (UAE)', currency: 'AED', nonRentUSD: 1156.7, rentOutsideLocal: 5575.42, localToUSD: 0.2723 },  // Numbeo Dubai
  saudi:  { name: 'Saudi Arabia', currency: 'SAR', nonRentUSD: 815.1,  rentOutsideLocal: 1601.97, localToUSD: 0.2666 },  // Numbeo (country avg)
  qatar:  { name: 'Qatar',      currency: 'QAR', nonRentUSD: 889.3,  rentOutsideLocal: 3645.59, localToUSD: 0.2746 },  // Numbeo Doha
  kuwait: { name: 'Kuwait',     currency: 'KWD', nonRentUSD: 831.1,  rentOutsideLocal: 185.86,  localToUSD: 3.2730 },  // Numbeo Kuwait
  bahrain:{ name: 'Bahrain',    currency: 'BHD', nonRentUSD: 855.1,  rentOutsideLocal: 224.09,  localToUSD: 2.6528 },  // Numbeo Bahrain
  oman:   { name: 'Oman',       currency: 'OMR', nonRentUSD: 755.3,  rentOutsideLocal: 139.43,  localToUSD: 2.6009 }   // Numbeo Oman
};

// Conversion: USD per unit (used to convert USD ↔ display currency)
const usdPer = {
  AED: 0.2723,
  SAR: 0.2666,
  QAR: 0.2746,
  KWD: 3.2730,
  BHD: 2.6528,
  OMR: 2.6009,
  USD: 1
};

// lifestyle multipliers (applied to baseline non-rent and rent)
const lifestyleMultiplier = {
  budget: 0.65,
  moderate: 1.0,
  luxury: 1.8
};

// Calculate button
document.getElementById("calculate").addEventListener("click", function () {
  const family = Math.max(1, parseInt(document.getElementById("family").value) || 1);
  const lifestyle = document.getElementById("lifestyle").value;
  const countryKey = document.getElementById("country").value;
  const displayCurrency = document.getElementById("currency").value;
  const salaryInput = parseFloat(document.getElementById("salary").value) || 0;

  const country = countries[countryKey];
  if (!country) return;

  // Convert Numbeo non-rent (USD) -> local currency
  const nonRentLocalBase = country.nonRentUSD / country.localToUSD;

  // Apply lifestyle multiplier to non-rent (food/transport/utilities/misc)
  const nonRentLocalLifestyle = nonRentLocalBase * lifestyleMultiplier[lifestyle];

  // Split non-rent into components for UX (simple percentage split)
  const foodLocal     = Math.round(nonRentLocalLifestyle * 0.45);
  const transportLocal= Math.round(nonRentLocalLifestyle * 0.12);
  const utilitiesLocal= Math.round(nonRentLocalLifestyle * 0.10);
  const miscLocal     = Math.round(nonRentLocalLifestyle * 0.33);

  // Scale non-rent for family (1st person = full, others add ~60% per person)
  const nonRentScaledLocal = Math.round((foodLocal + transportLocal + utilitiesLocal + miscLocal) * (1 + (family - 1) * 0.6));

  // Rent handling:
  // baseline = Numbeo 1-bedroom outside center (local currency)
  // lifestyle affects rent (budget -> smaller, luxury -> larger)
  let rentLocal = country.rentOutsideLocal * (lifestyle === 'budget' ? 0.8 : (lifestyle === 'luxury' ? 1.6 : 1.0));
  // family-based bedroom approximation
  if (family === 1) rentLocal = Math.round(rentLocal);
  else if (family <= 3) rentLocal = Math.round(rentLocal * 1.5);
  else rentLocal = Math.round(rentLocal * 2.2);

  // Total (local currency)
  const totalLocal = rentLocal + nonRentScaledLocal;

  // Convert to USD
  const totalUSD = totalLocal * country.localToUSD;

  // Convert USD -> display currency using usdPer mapping
  const toDisplay = amountUSD => Math.round(amountUSD / usdPer[displayCurrency]);

  // Show component conversions in display currency
  const rentDisplay = toDisplay(rentLocal * country.localToUSD);
  const foodDisplay = toDisplay(foodLocal * country.localToUSD * (1 + (family - 1) * 0.6));
  const transportDisplay = toDisplay(transportLocal * country.localToUSD * (1 + (family - 1) * 0.6));
  const utilitiesDisplay = toDisplay(utilitiesLocal * country.localToUSD * (1 + (family - 1) * 0.6));
  const miscDisplay = toDisplay(miscLocal * country.localToUSD * (1 + (family - 1) * 0.6));
  const totalDisplay = toDisplay(totalUSD);

  // Provide a conservative range +/-10%
  const lowDisplay = Math.round(totalDisplay * 0.9);
  const highDisplay = Math.round(totalDisplay * 1.1);

  // Salary comparison (user entered salary is already in display currency)
  const verdict = salaryInput === 0
    ? "⚠️ You didn't enter a salary for comparison."
    : (salaryInput >= highDisplay ? "✅ You can comfortably cover your expenses." : (salaryInput >= totalDisplay ? "⚠️ You can cover typical expenses but little buffer." : "⚠️ Expenses may exceed your salary."));

  // Build results HTML (clear, conservative messaging)
  const resultsDiv = document.getElementById("results");
  resultsDiv.style.display = "block";
  resultsDiv.innerHTML = `
    <h3>Estimated Monthly Expenses — ${country.name} (${displayCurrency})</h3>
    <p class="muted">Model: Numbeo-based baseline, adjusted by lifestyle & family size. Values are estimates (range shown).</p>

    <div class="breakdown">
      <p><strong>Rent:</strong> ${rentDisplay.toLocaleString()} ${displayCurrency}</p>
      <p><strong>Food (family-scaled):</strong> ${foodDisplay.toLocaleString()} ${displayCurrency}</p>
      <p><strong>Transport (family-scaled):</strong> ${transportDisplay.toLocaleString()} ${displayCurrency}</p>
      <p><strong>Utilities (family-scaled):</strong> ${utilitiesDisplay.toLocaleString()} ${displayCurrency}</p>
      <p><strong>Misc (family-scaled):</strong> ${miscDisplay.toLocaleString()} ${displayCurrency}</p>
    </div>

    <hr>

    <p><strong>Total (estimate):</strong> ~${totalDisplay.toLocaleString()} ${displayCurrency}</p>
    <p><strong>Estimated range:</strong> ${lowDisplay.toLocaleString()} — ${highDisplay.toLocaleString()} ${displayCurrency}</p>

    <p><strong>Your Salary:</strong> ${salaryInput ? salaryInput.toLocaleString() + ' ' + displayCurrency : 'Not provided'}</p>
    <p><strong>Verdict:</strong> ${verdict}</p>

    <p class="fineprint">Notes: Non-rent baseline uses Numbeo "single person excluding rent" and 1-bedroom rent (outside centre). Conversions use recent mid-market exchange references (Aug 2025).</p>
  `;
});
