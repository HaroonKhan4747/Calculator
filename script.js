// Hamburger menu toggle
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("nav-links").classList.toggle("active");
});

// Calculator
document.getElementById("calculateBtn").addEventListener("click", () => {
  const country = document.getElementById("country").value;
  const familySize = parseInt(document.getElementById("familySize").value);
  const livingType = document.getElementById("livingType").value;
  const salary = parseFloat(document.getElementById("salary").value);
  const currency = document.getElementById("currency").value;

  if (!salary) {
    document.getElementById("results").innerText = "⚠️ Please enter your salary.";
    return;
  }

  // Base expenses (rough averages per person per month)
  const baseCosts = {
    dubai: 4000,
    saudi: 3500,
    qatar: 3700,
    oman: 3000,
    bahrain: 3200,
    kuwait: 3800
  };

  let expense = baseCosts[country] * familySize;

  if (livingType === "luxury") expense *= 1.8;
  else if (livingType === "moderate") expense *= 1.2;

  const remaining = salary - expense;

  document.getElementById("results").innerHTML = `
    <p>Estimated Monthly Expense: <strong>${expense.toFixed(2)} ${currency}</strong></p>
    <p>Remaining After Expenses: <strong>${remaining.toFixed(2)} ${currency}</strong></p>
  `;
});
