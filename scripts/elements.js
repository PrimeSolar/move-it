// The Library of Custom Reusable Web Elements
// This file is the library containing my collection of custom, reusable web elements
// that can be used across different parts of the project. These elements go beyond what browsers provide,
// allowing for expanded capabilities and functionality in the project.

// Navigation Bar
navigationBarContainer = document.querySelector("#navigationBarContainer");

function navigationBarContainerF(navigationBarContainer) {
  if (navigationBarContainer != null) {
    // Define navigation bar content:
    navigationBarContainer.innerHTML += `
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a href="index.html" name="start" aria-label="Move It Home Page" class="navbar-brand"><img alt="Logo" title="Move It Logo" id="logo" name="move-it-logo" src="assets/box-seam-black.svg" />Move It</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="index.html">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="about.html">About</a>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Services
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="local-moving.html">Local Moving</a></li>
                  <li><a class="dropdown-item" href="long-distance-moving.html">Long-Distance Moving</a></li>
                  <li><a class="dropdown-item" href="commercial-moving.html">Commercial Moving</a></li>
                </ul>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="pricing.html">Pricing</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="faqs.html">FAQs</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="glossary.html">Glossary</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="contact.html">Contact</a>
              </li>
            </ul>
          </div>
          <!--
          <form class="d-flex" role="search">
            <input class="form-control me-2" type="search" placeholder="Postcode" aria-label="Search">
            <button class="btn btn-outline-success" type="submit">Check</button>
          </form>-->
        </div>
      </nav>
      `
  }
}
navigationBarContainerF(navigationBarContainer);

// Scroll to Top Button
class ToTop extends HTMLElement {
  connectedCallback() {
    this.innerHTML += `
    <a href="#" aria-label="Scroll to top" title="Scroll to top">
      <svg width="45px" height="45px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 15L12 9L18 15" stroke="#fff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>
    `
  }
}
customElements.define("to-top", ToTop);

const toTop = document.querySelector("body").appendChild(document.createElement("to-top"));
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 100) {
    toTop.classList.add("active");
  } else {
    toTop.classList.remove("active");
  }
})

// Check Circle
class CheckCircle extends HTMLElement {
  connectedCallback() {
    this.innerHTML += `
    <img alt="Check circle" title="Included" id="check-circle" name="check-circle" src="assets/check-circle.svg" />
    `
  }
}
customElements.define("check-circle", CheckCircle);

// Footer
footerContainer = document.querySelector("#footerContainer");

function footerContainerF(footerContainer) {
  if (footerContainer != null) {
    // Define footer content:
    footerContainer.innerHTML += `
    <div class="container pt-1 mt-1">
      <footer class="pt-1 mt-5 mb-3">
        <ul class="nav justify-content-center border-bottom pb-3 mb-3">
          <li class="nav-item"><a href="index.html" class="nav-link px-2 text-body-secondary">Home</a></li>
          <li class="nav-item"><a href="about.html" class="nav-link px-2 text-body-secondary">About</a></li>
          <li class="nav-item"><a href="pricing.html" class="nav-link px-2 text-body-secondary">Pricing</a></li>
          <li class="nav-item"><a href="faqs.html" class="nav-link px-2 text-body-secondary">FAQs</a></li>
          <li class="nav-item"><a href="glossary.html" class="nav-link px-2 text-body-secondary">Glossary</a></li>
          <li class="nav-item"><a href="contact.html" class="nav-link px-2 text-body-secondary">Contact</a></li>
        </ul>
        <p class="text-center text-body-secondary">Copyright © <a href="https://firstsolar.github.io/web-developer/">Vladislav Kazantsev</a> 2024</p>
      </footer>
    </div>
      `
  }
}
footerContainerF(footerContainer);

console.log("elements.js is completed");
