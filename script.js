// Toggle mobile menu
document.getElementById("menu-toggle").addEventListener("click", function () {
  document.getElementById("nav-links").classList.toggle("show");
});

// Handle calculation
document.getElementById("expenseForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const country = document.getElementById("country").value;
  const familySize = parseInt(document.getElementById("familySize").value);
  const livingType = document.getElementById("livingType").value;
  const currency = document.getElementById("currency").value;
  const salary = parseFloat(document.getElementById("salary").value);

  let baseCost = 0;

  switch (country) {
    case "dubai":
      baseCost = 4000;
      break;
    case "saudi":
      baseCost = 3000;
      break;
    case "qatar":
      baseCost = 3500;
      break;
    case "oman":
      baseCost = 2500;
      break;
    case "bahrain":
      baseCost = 2700;
      break;
    case "kuwait":
      baseCost = 3200;
      break;
  }

  // Adjust for lifestyle
  if (livingType === "moderate") baseCost *= 1.3;
  if (livingType === "luxury") baseCost *= 2;

  // Adjust for family size
  const totalCost = baseCost * familySize;

  const resultDiv = document.getElementById("results");
  resultDiv.innerHTML = `
    <h3>Estimated Monthly Expenses</h3>
    <p><strong>Country:</strong> ${document.querySelector("#country option:checked").text}</p>
    <p><strong>Family Size:</strong> ${familySize}</p>
    <p><strong>Lifestyle:</strong> ${livingType}</p>
    <p><strong>Estimated Cost:</strong> ${totalCost.toLocaleString()} ${currency}</p>
    <p><strong>Your Salary:</strong> ${salary.toLocaleString()} ${currency}</p>
    <p><strong>Status:</strong> ${salary >= totalCost ? "✅ Salary is enough" : "⚠️ Salary may not be enough"}</p>
  `;
});
