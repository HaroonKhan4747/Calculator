
function calculate() {
  const country = document.getElementById("country").value;
  const familySize = parseInt(document.getElementById("family-size").value);
  let baseCost = 0;

  switch(country) {
    case "UAE": baseCost = 1200; break;
    case "Saudi": baseCost = 1000; break;
    case "Qatar": baseCost = 1100; break;
    case "Oman": baseCost = 900; break;
    case "Kuwait": baseCost = 1150; break;
    case "Bahrain": baseCost = 950; break;
  }

  const total = baseCost * familySize;
  document.getElementById("results").innerHTML = `<h3>Estimated Monthly Cost in ${country}: $${total}</h3>`;
}
