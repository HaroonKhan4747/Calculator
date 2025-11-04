// Function to load HTML content into a container
function loadHTML(containerId, file) {
  fetch(file)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.text();
    })
    .then(data => {
      document.getElementById(containerId).innerHTML = data;
      if(containerId === 'header-container') initHeaderMenu(); // optional: initialize mobile menu
    })
    .catch(error => console.error('Error loading HTML:', error));
}

// Load header and footer
loadHTML('header-container', 'header.html');
loadHTML('footer-container', 'footer.html');

// Optional: Initialize hamburger menu for mobile after loading header
function initHeaderMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
}

  const body = document.body;
  const toggleDesktop = document.getElementById('darkModeToggle');
  const toggleMobile = document.getElementById('darkModeToggleMobile');

  // Load saved dark mode preference
  if (localStorage.getItem('dark-mode') === 'true') {
    body.classList.add('dark-mode');
    if (toggleDesktop) toggleDesktop.textContent = '☀️';
    if (toggleMobile) toggleMobile.textContent = '☀️';
  }

  function toggleDarkMode() {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');

    // Update toggle icons
    if (toggleDesktop) toggleDesktop.textContent = isDark ? '☀️' : '🌙';
    if (toggleMobile) toggleMobile.textContent = isDark ? '☀️' : '🌙';

    // Save preference
    localStorage.setItem('dark-mode', isDark);

    // Optional: sync toggle styles if needed
    syncToggleStyles();
  }

  function syncToggleStyles() {
    const headerGradient = 'linear-gradient(90deg, #0a0a0a, #1b1b1b)';
    const boxShadow = '0 0 18px rgba(255, 255, 255, 0.12)';

    if (toggleDesktop) {
      toggleDesktop.style.background = headerGradient;
      toggleDesktop.style.color = '#ffffff';
      toggleDesktop.style.boxShadow = boxShadow;
      toggleDesktop.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    }

    if (toggleMobile) {
      toggleMobile.style.background = headerGradient;
      toggleMobile.style.color = '#ffffff';
      toggleMobile.style.boxShadow = boxShadow;
      toggleMobile.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    }
  }

  // Initial sync
  syncToggleStyles();

  // Add event listeners
  if (toggleDesktop) toggleDesktop.addEventListener('click', toggleDarkMode);
  if (toggleMobile) toggleMobile.addEventListener('click', toggleDarkMode);

