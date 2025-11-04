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
