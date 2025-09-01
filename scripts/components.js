// The Library of Custom Reusable Web Components
// This file is the library containing my collection of custom, reusable web components
// that can be used across different parts of the project. These components go beyond what browsers provide,
// allowing for expanded capabilities and functionality in the project.

// The Navigation Bar
navigationBarContainer = document.querySelector("#navigationBarContainer");

function createNavigationBar(navigationBarContainer) {
  if (navigationBarContainer) {
    // Define the navigation bar content:
    navigationBarContainer.innerHTML += `
      <nav class="navbar navbar-expand-lg bg-body-tertiary" role="navigation" aria-label="Main Navigation">
        <div class="container-fluid">
          <a href="index.html" name="start" aria-label="The Move It Home Page" class="navbar-brand">
            <img alt="The Move It Logo" title="The Move It Logo" id="logo" name="move-it-logo" src="assets/box-seam-blue.svg" />Move It
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="nav navbar-nav">
              <li class="nav-item">
                <a class="nav-link" aria-current="page" href="index.html">Home</a>
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
                <a class="nav-link" href="checklist.html">Checklist</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="glossary.html">Glossary</a>
              </li>
              <li class="nav-item">
                <a class="nav-link link-primary" href="contact.html">Contact</a>
              </li>
              <button id="theme" type="button" onclick="toggleTheme()" aria-label="Toggle Theme">
                Toggle Theme
              </button>
            </ul>
            <!--
            <form class="d-flex ms-auto" role="search">
              <input class="form-control me-2" type="search" placeholder="Postcode" aria-label="Search">
              <button class="btn btn-outline-success" type="submit">Check</button>
            </form>-->
          </div>
        </div>
      </nav>
      `;
  }
}
createNavigationBar(navigationBarContainer);

// The Scroll to Top Button
class ToTop extends HTMLElement {
  connectedCallback() {
    this.innerHTML += `
    <a href="#" aria-label="Scroll to top" title="Scroll to top">
      <svg width="45px" height="45px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 15L12 9L18 15" stroke="#fff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>
    `;
  }
}
customElements.define("to-top", ToTop);

const toTop = document
  .querySelector("body")
  .appendChild(document.createElement("to-top"));
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 100) {
    toTop.classList.add("active");
  } else {
    toTop.classList.remove("active");
  }
});

// The Print Button
const printButton = document.querySelector("#print");
if (printButton) {
  printButton.classList.add("my-5");
  printButton.classList.add("pb-5");
  printButton.classList.add("text-center");
  printButton.innerHTML += `
  <button
    type="button"
    id="print-button"
    class="btn btn-primary"
    onclick="printPage()"
  >
  Print Page
  </button>
`;
}

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "p") {
    event.preventDefault();
    printPage();
  }
});

function printPage() {
  const htmlElement = document.body;
  if (htmlElement.classList.contains("dark-mode")) {
    htmlElement.classList.remove("dark-mode");
    htmlElement.classList.add("light-mode");
    window.print();
    htmlElement.classList.remove("light-mode");
    htmlElement.classList.add("dark-mode");
  } else {
    window.print();
  }
}

// Check Circle
class CheckCircle extends HTMLElement {
  connectedCallback() {
    this.innerHTML += `
    <img alt="Check Circle" title="Included" class="check-circle" name="check-circle" src="assets/check-circle.svg" />
    `;
  }
}
customElements.define("check-circle", CheckCircle);

// The Footer
footer = document.querySelector("footer");
footer.style.display = "flex";
footer.style.flexDirection = "column";
const year = new Date().getFullYear();
function createFooter(footer) {
  if (footer) {
    // Define the footer content:
    footerContainer.innerHTML += `
    <div class="container py-1 text-center">
      <div class="pt-1 pb-1 mt-1 mb-1">
        <ul class="nav justify-content-center border-bottom pb-3 pt-3 mb-3">
          <li class="nav-item"><a class="nav-link px-2 text-body-secondary" href="index.html">Home</a></li>
          <li class="nav-item"><a class="nav-link px-2 text-body-secondary" href="about.html">About</a></li>
          <li class="nav-item"><a class="nav-link px-2 text-body-secondary" href="pricing.html">Pricing</a></li>
          <li class="nav-item"><a class="nav-link px-2 text-body-secondary" href="faqs.html">FAQs</a></li>
          <li class="nav-item"><a class="nav-link px-2 text-body-secondary" href="checklist.html">Checklist</a></li>
          <li class="nav-item"><a class="nav-link px-2 text-body-secondary" href="glossary.html">Glossary</a></li>
          <li class="nav-item"><a class="nav-link px-2 link-primary" href="contact.html">Contact</a></li>
        </ul>
        <p id="copyright">Copyright © <a href="https://primesolar.github.io/web-developer/" class="link-primary" rel="noopener noreferrer">Vladislav Kazantsev</a> ${year}</p>
        <a type="button" href="https://www.buymeacoffee.com/CocaCola" id="bmc-button" target="_blank" rel="noopener noreferrer" aria-label="Buy me a coffee" role="button">☕ Buy me a coffee</a>
        <a href="https://www.buymeacoffee.com/CocaCola" id="bmc-arrow" target="_blank" rel="noopener noreferrer" aria-label="Buy me a coffee" role="button">⬇</a>
        <a href="https://www.buymeacoffee.com/CocaCola" id="bmc-link" target="_blank" rel="noopener noreferrer" aria-label="Buy me a coffee" role="button">coff.ee/CocaCola</a>
      </div>
    </div>
      `;
    function applyFooterStyles() {
      if (window.matchMedia("(max-width: 768px)").matches) {
        footer.style.paddingBottom = "4rem";
      } else {
        footer.style.paddingBottom = "";
      }
    }
    applyFooterStyles();
    window.addEventListener("resize", applyFooterStyles);
  }
}
createFooter(footer);

// The Contact Us Link Titles
const contactUsLinks = document.querySelectorAll("a");
for (let x of contactUsLinks) {
  if (x.getAttribute("href") === "contact.html") {
    x.title = "Navigate to Our Contact Page";
  }
}

console.log("components.js is completed");
