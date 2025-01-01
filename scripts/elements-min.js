function navigationBarContainerF(n){null!=n&&(n.innerHTML+='\n      <nav class="navbar navbar-expand-lg bg-body-tertiary">\n        <div class="container-fluid">\n          <a href="index.html" name="start" aria-label="Move It Home Page" class="navbar-brand"><img alt="Logo" title="Move It Logo" id="logo" name="move-it-logo" src="assets/box-seam-black.svg" />Move It</a>\n          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">\n            <span class="navbar-toggler-icon"></span>\n          </button>\n          <div class="collapse navbar-collapse" id="navbarNav">\n            <ul class="nav navbar-nav">\n              <li class="nav-item">\n                <a class="nav-link" aria-current="page" href="index.html">Home</a>\n              </li>\n              <li class="nav-item">\n                <a class="nav-link" href="about.html">About</a>\n              </li>\n              <li class="nav-item dropdown">\n                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">\n                  Services\n                </a>\n                <ul class="dropdown-menu">\n                  <li><a class="dropdown-item" href="local-moving.html">Local Moving</a></li>\n                  <li><a class="dropdown-item" href="long-distance-moving.html">Long-Distance Moving</a></li>\n                  <li><a class="dropdown-item" href="commercial-moving.html">Commercial Moving</a></li>\n                </ul>\n              </li>\n              <li class="nav-item">\n                <a class="nav-link" href="pricing.html">Pricing</a>\n              </li>\n              <li class="nav-item">\n                <a class="nav-link" href="faqs.html">FAQs</a>\n              </li>\n              <li class="nav-item">\n                <a class="nav-link" href="glossary.html">Glossary</a>\n              </li>\n              <li class="nav-item">\n                <a class="nav-link link-primary" href="contact.html">Contact</a>\n              </li>\n            </ul>\n          </div>\n          \x3c!--\n          <form class="d-flex" role="search">\n            <input class="form-control me-2" type="search" placeholder="Postcode" aria-label="Search">\n            <button class="btn btn-outline-success" type="submit">Check</button>\n          </form>--\x3e\n        </div>\n      </nav>\n      ')}navigationBarContainer=document.querySelector("#navigationBarContainer"),navigationBarContainerF(navigationBarContainer);class ToTop extends HTMLElement{connectedCallback(){this.innerHTML+='\n    <a href="#" aria-label="Scroll to top" title="Scroll to top">\n      <svg width="45px" height="45px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n        <path d="M6 15L12 9L18 15" stroke="#fff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>\n      </svg>\n    </a>\n    '}}customElements.define("to-top",ToTop);const toTop=document.querySelector("body").appendChild(document.createElement("to-top"));window.addEventListener("scroll",(()=>{window.pageYOffset>100?toTop.classList.add("active"):toTop.classList.remove("active")}));class CheckCircle extends HTMLElement{connectedCallback(){this.innerHTML+='\n    <img alt="Check circle" title="Included" id="check-circle" name="check-circle" src="assets/check-circle.svg" />\n    '}}function footerContainerF(n){null!=n&&(n.innerHTML+='\n    <div class="container pt-1 mt-1">\n      <footer class="pt-1 mt-5 mb-3">\n        <ul class="nav justify-content-center border-bottom pb-3 mb-3">\n          <li class="nav-item"><a class="nav-link px-2 text-body-secondary" href="index.html">Home</a></li>\n          <li class="nav-item"><a class="nav-link px-2 text-body-secondary" href="about.html">About</a></li>\n          <li class="nav-item"><a class="nav-link px-2 text-body-secondary" href="pricing.html">Pricing</a></li>\n          <li class="nav-item"><a class="nav-link px-2 text-body-secondary" href="faqs.html">FAQs</a></li>\n          <li class="nav-item"><a class="nav-link px-2 text-body-secondary" href="glossary.html">Glossary</a></li>\n          <li class="nav-item"><a class="nav-link px-2" href="contact.html">Contact</a></li>\n        </ul>\n        <p class="text-center">Copyright © <a href="https://firstsolar.github.io/web-developer/">Vladislav Kazantsev</a> 2024</p>\n      </footer>\n    </div>\n      ')}customElements.define("check-circle",CheckCircle),footerContainer=document.querySelector("#footerContainer"),footerContainerF(footerContainer);
