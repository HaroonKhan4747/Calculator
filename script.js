function toggleMenu() {
  document.querySelector(".nav-links").classList.toggle("show");
}

function calculateExpenses() {
  const country = document.getElementById("country").value;
  const family = parseInt(document.getElementById("family").value);
  const living = document.getElementById("living").value;
  const currency = document.getElementById("currency").value;
  const salary = parseFloat(document.getElementById("salary").value);

  if (isNaN(family) || isNaN(salary)) {
    alert("Please enter valid details.");
    return;
  }

  // Base multipliers
  let baseCost = 0;
  switch (country) {
    case "dubai": baseCost = 4000; break;
    case "saudi": baseCost = 3000; break;
    case "qatar": baseCost = 3500; break;
    case "oman": baseCost = 2500; break;
    case "kuwait": baseCost = 3700; break;
    case "bahrain": baseCost = 2800; break;
  }

  // Living style adjustment
  let livingFactor = 1;
  if (living === "basic") livingFactor = 0.8;
  if (living === "moderate") livingFactor = 1.2;
  if (living === "luxury") livingFactor = 2.0;

  const totalEstimate = Math.round(baseCost * family * livingFactor);

  // Breakdown (approximate percentages)
  const rent = Math.round(totalEstimate * 0.4);
  const food = Math.round(totalEstimate * 0.25);
  const transport = Math.round(totalEstimate * 0.15);
  const utilities = Math.round(totalEstimate * 0.1);
  const misc = Math.round(totalEstimate * 0.1);

  // Show results
  document.getElementById("results").style.display = "block";
  document.getElementById("results").innerHTML = `
    <h3>Estimated Monthly Expenses (${currency})</h3>
    <ul>
      <li><strong>Rent:</strong> ~${rent} ${currency}</li>
      <li><strong>Food:</strong> ~${food} ${currency}</li>
      <li><strong>Transport:</strong> ~${transport} ${currency}</li>
      <li><strong>Utilities:</strong> ~${utilities} ${currency}</li>
      <li><strong>Miscellaneous:</strong> ~${misc} ${currency}</li>
    </ul>
    <h4><strong>Total Estimate:</strong> ~${totalEstimate} ${currency}</h4>
    <p>Your entered salary: ${salary} ${currency}</p>
    <p><em>Note: These are closest estimates. Actual costs may vary depending on lifestyle and city.</em></p>
  `;
}
