// Toggle Mobile Menu
document.getElementById("menu-toggle").addEventListener("click", () => {
  document.getElementById("nav-links").classList.toggle("active");
});

// Calculator Logic
document.getElementById("expense-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const country = document.getElementById("country").value;
  const family = parseInt(document.getElementById("family").value);
  const living = document.getElementById("living").value;
  const currency = document.getElementById("currency").value;
  const salary = parseFloat(document.getElementById("salary").value);

  let baseCost = 0;

  switch(country) {
    case "Dubai": baseCost = 4000; break;
    case "Saudi Arabia": baseCost = 3500; break;
    case "Qatar": baseCost = 3800; break;
    case "Oman": baseCost = 3000; break;
    case "Kuwait": baseCost = 3600; break;
    case "Bahrain": baseCost = 3400; break;
  }

  if (living === "luxury") baseCost *= 1.8;
  else if (living === "moderate") baseCost *= 1.2;

  let totalCost = baseCost * family;

  const resultDiv = document.getElementById("results");
  resultDiv.innerHTML = `
    <p><strong>Estimated Monthly Cost in ${country}:</strong> ${totalCost.toFixed(2)} ${currency}</p>
    ${salary ? `<p>Your remaining savings: ${(salary - totalCost).toFixed(2)} ${currency}</p>` : ""}
  `;
});
