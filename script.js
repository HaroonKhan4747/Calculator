// Toggle mobile menu
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Calculator
document.getElementById("calculate").addEventListener("click", function () {
  const amount = parseFloat(document.getElementById("amount").value);
  const fromCurrency = document.getElementById("fromCurrency").value;
  const toCurrency = document.getElementById("toCurrency").value;
  const resultElement = document.getElementById("result");

  if (isNaN(amount)) {
    resultElement.textContent = "Please enter a valid amount.";
    return;
  }

  // Example exchange rates (dummy values)
  const rates = {
    PKR: 1,
    INR: 0.3,
    AED: 0.013,
    DHS: 0.013 // Dubai Dirham treated same as AED
  };

  if (!rates[fromCurrency] || !rates[toCurrency]) {
    resultElement.textContent = "Conversion not supported.";
    return;
  }

  const convertedAmount = (amount / rates[fromCurrency]) * rates[toCurrency];
  resultElement.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
});
