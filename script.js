function calculate() {
  const amount = document.getElementById("amount").value;
  const currency = document.getElementById("currency").value;
  const resultDiv = document.getElementById("result");

  if (amount === "" || amount <= 0) {
    resultDiv.innerHTML = "Please enter a valid amount.";
    return;
  }

  let rate = 1;
  switch (currency) {
    case "PKR": rate = 1; break;
    case "AED": rate = 0.013; break;
    case "INR": rate = 0.3; break;
    case "GBP": rate = 0.0028; break;
    case "EUR": rate = 0.0032; break;
  }

  const converted = (amount * rate).toFixed(2);
  resultDiv.innerHTML = `${amount} ${currency} = ${converted} Base Units`;
}

// Mobile navbar toggle
document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".nav-links").classList.toggle("active");
});
