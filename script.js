<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Gulf Expense Calculator - Estimate living costs in Dubai (UAE), Saudi Arabia, Qatar, Oman, Bahrain, and Kuwait. Plan your monthly budget easily.">
  <title>Gulf Expense Calculator</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <!-- Navbar -->
  <header class="navbar">
    <div class="logo">GulfExpense</div>
    <nav id="nav-links" class="nav-links">
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">Contact</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </nav>
    <div class="hamburger" id="hamburger">&#9776;</div>
  </header>

  <!-- Hero -->
  <section class="hero">
    <h1>Gulf Expense Calculator</h1>
    <p>Estimate monthly living expenses across Gulf countries with a detailed breakdown.</p>
  </section>

  <!-- Calculator -->
  <section class="calculator">
    <label>Country
      <select id="country">
        <option value="dubai">Dubai (UAE)</option>
        <option value="saudi">Saudi Arabia</option>
        <option value="qatar">Qatar</option>
        <option value="oman">Oman</option>
        <option value="bahrain">Bahrain</option>
        <option value="kuwait">Kuwait</option>
      </select>
    </label>

    <label>Family Size
      <input type="number" id="familySize" min="1" value="1">
    </label>

    <label>Type of Living
      <select id="livingType">
        <option value="basic">Basic (low cost)</option>
        <option value="moderate">Moderate (balanced)</option>
        <option value="luxury">Luxury (high-end)</option>
      </select>
    </label>

    <label>Currency
      <select id="currency">
        <option value="AED">AED</option>
        <option value="SAR">SAR</option>
        <option value="QAR">QAR</option>
        <option value="OMR">OMR</option>
        <option value="BHD">BHD</option>
        <option value="KWD">KWD</option>
      </select>
    </label>

    <label>Your Salary (per month)
      <input type="number" id="salary" placeholder="Enter your salary in selected currency">
    </label>

    <button id="calculateBtn">Calculate</button>
    <div id="results"></div>
  </section>

  <!-- FAQs -->
  <section class="faqs">
    <h2>FAQs</h2>
    <div class="faq">
      <h3>How much do you need to survive in Dubai (UAE)?</h3>
      <p>On average, a single person needs AED 3,000–5,000 per month for basic living, while families require more depending on lifestyle.</p>
    </div>
    <div class="faq">
      <h3>Which Gulf country is the cheapest to live in?</h3>
      <p>Oman and Bahrain tend to have lower living costs compared to Dubai, Qatar, or Kuwait.</p>
    </div>
    <div class="faq">
      <h3>Do the results include schooling?</h3>
      <p>Yes, education expenses are included in family cost estimates.</p>
    </div>
    <div class="faq">
      <h3>What currency does the calculator use?</h3>
      <p>You can choose AED, SAR, QAR, OMR, BHD, or KWD.</p>
    </div>
    <div class="faq">
      <h3>Is this tool accurate?</h3>
      <p>It provides estimates based on average data; actual costs vary by lifestyle and location.</p>
    </div>
  </section>

  <!-- Footer -->
  <footer>
    <p>© 2025 GulfExpense. Estimates only; actual costs vary.</p>
  </footer>

  <script src="script.js"></script>
</body>
</html>
