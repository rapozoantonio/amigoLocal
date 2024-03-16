<template>
  <div class="footer-container">
    <div class="top-section">
      <div class="left-column">
        <h3 class="discover-link p-text-secondary">Discover</h3>
        <nav class="about-links">
          <a href="/about" class="footer-link">About</a> 
          <a href="/tickets" class="footer-link">Tickets</a> 
          <a href="/resale" class="footer-link">Resale</a>
        </nav>
      </div>
      <div class="right-column">
        <h3 class="ra-apps-link p-text-secondary">Get AL</h3>
        <nav class="guide-links">
          <a href="/ra-guide" class="footer-link">AL Guide</a> 
          <a href="/ra-scanner" class="footer-link">RA Scanner</a>
        </nav>
      </div>
    </div>
    <div class="promoter-section">
      <h2 class="promoter-question">Are you a promoter?</h2>
      <Button label="Submit event" class="submit-button" outlined />
    </div>
    <footer class="footer-footer">
      <div class="footer-info">
        <!-- Placeholder for the location icon -->
        <i class="pi pi-map-marker footer-location-icon"></i>
        <span> Rio de Janeiro</span>
        <span class="footer-info-divider"> | </span>
        <span class="p-text-secondary">Language</span>
        <a href="#" class="footer-language-link">English</a>
      </div>
      <div class="footer-legal">
        <a href="#" class="footer-legal-link">Privacy</a>
        <a href="#" class="footer-legal-link">Terms</a>
        <a href="#" class="footer-legal-link">Cookies</a>
        <a href="#" class="footer-legal-link">Sitemap</a>
      </div>
    </footer>
    <div class="footer-copy">© 2023 Amigo Local Ltd. All rights reserved.</div>
  </div>
</template>

<script setup>
import Button from "primevue/button";
</script>

<style scoped>
.footer-container {
  background-color: #1a1a1a;
  color: #fff;
  padding: 2rem; /* Adjusted padding */
  font-family: "Arial", sans-serif;
}

.top-section, .footer-header, .footer-main, .footer-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-header, .footer-main, .footer-footer, 
.promoter-section, .footer-info, .footer-legal {
  padding: 0.5rem 0;
}

.left-column .discover-link, 
.right-column .ra-apps-link, 
.footer-promoter h2,
.footer-about h1 {
  margin-bottom: 1rem;
  font-weight: bold;
}

.about-links, .guide-links, 
.footer-links a {
  display: flex;
  flex-wrap: wrap; /* Adjusted for wrapping */
}

.footer-link, .footer-nav-link, .footer-legal-link, .footer-language-link {
  color: #fff;
  text-decoration: none;
  margin: 0 0.5rem;
  transition: color 0.2s;
  font-weight: bolder; /* Make links bold */
}

.footer-link:hover, .footer-nav-link:hover, 
.footer-legal-link:hover, .footer-language-link:hover {
  color: #e50914;
}

.promoter-section {
  align-items: center;
  margin-top: 2rem;
}

.submit-event-button, .submit-button {
  outline-color: #e50914;
}

.footer-flag-icon {
  font-size: 1.5rem;
}

.footer-copy {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .top-section, .promoter-section, 
  .footer-header, .footer-main, .footer-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .footer-nav {
    display: none;
  }

  .footer-about, .footer-promoter {
    text-align: left;
  }

  .about-links, .guide-links, 
  .footer-info, .footer-legal {
    flex-wrap: nowrap; /* Keeps links in a row without wrapping */
    overflow-x: auto; /* Allows scrolling if the content is wider than the screen */
  }

  .footer-links a, .footer-link {
    margin: 0.25rem 0;
  }
}

.about-links, .guide-links {
  display: flex;
  flex-wrap: wrap;
}

.footer-link {
  margin-right: 0.5rem; /* Adjust spacing as needed */
}

.footer-link::after {
  content: '/';
  margin-left: 0.5rem;
}

.footer-link:last-child::after {
  content: ''; /* No slash after the last link */
}


::v-deep .p-button-label {
  color: #fff;
}
</style>
