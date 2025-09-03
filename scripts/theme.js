let db;

const dexieScript = document.createElement("script");
dexieScript.type = "text/javascript";
dexieScript.src = "https://npmcdn.com/dexie@4.0.11/dist/dexie.min.js";
document
  .querySelector("body")
  .insertBefore(dexieScript, document.querySelector("body").firstChild);
dexieScript.onload = () => {
  db = new Dexie("Move It");
  db.version(1).stores({ themeTable: "theme" });
  setTheme();
};

// Load saved theme and apply it
async function setTheme() {
  try {
    const themeTable = await db.themeTable.toArray();
    if (themeTable.length > 0) {
      const theme = themeTable[0].theme;
      document.body.classList.add(theme);
    }
  } catch (error) {
    console.error("Error setting theme: ", error);
  }
}

const style = document.createElement("style");
style.textContent = `
/* Theme */

#theme {
  right: 120px;
  padding: 10px 15px;
}

.dark-mode #theme {
  background-color: #7a7a7a !important;
}

body.dark-mode  {
  background-color: #1f1f1f !important;
  color: #e0e0e0 !important;
}

.dark-mode nav,
.dark-mode nav *:not(.navbar-toggler, .navbar-toggler *),
.dark-mode #footerContainer,
.dark-mode #footerContainer *:not(button, #bmc-button) {
  background-color: #4f4f4f !important;
  color: #e0e0e0 !important;
}

.dark-mode .navbar-toggler {
  background-color: #888888 !important;
  border: 1px solid #3f3f3f;
}

.dark-mode main {
  background: #1f1f1f !important;
  color: #e0e0e0 !important;
}

.dark-mode
  main
  *:not(
    .row,
    .row.light *,
    .col-md-6,
    .col-md-6 *,
    button,
    .btn,
    .feature,
    .feature *,
    .feature-icon,
    .feature-icon-small,
    #chat-header,
    #availabilityNotice,
    .message,
    .message *,
    img,
    #carouselContainer span,
    .carousel-inner,
    .carousel-item,
    .testimonial,
    .testimonial strong,
    .carousel-indicators,
    #newsletter,
    #newsletter h2,
    #newsletter p,
    #newsletter form,
    #newsletter input,
    #responseMessage,
    ul,
    li,
    thead,
    thead *,
    tbody,
    tbody *,
    .aos-item,
    .aos-item *,
    .card-content,
    .card-content *
  ) {
  background-color: #1f1f1f !important;
  color: #e0e0e0 !important;
}

.dark-mode::-webkit-scrollbar-track,
.dark-mode #chat-body::-webkit-scrollbar-track {
  background: #373737;
}

.dark-mode .chevron-right {
  display: none;
}

.dark-mode .message * {
  color: #ffffff;
}

.dark-mode .row.light > .col,
.dark-mode .col-md-6 {
  background-color: #272727 !important;
  border: 1px solid #ffffff;
}

.dark-mode .aos-item * {
  background-color: #272727 !important;
}

.dark-mode .feature *:not(a, p),
.dark-mode button,
.dark-mode .row.light *,
.dark-mode .col-md-6 * {
  color: #e0e0e0 !important;
}

.dark-mode .feature,
.dark-mode #testimonialCarousel .carousel-inner,
.dark-mode .carousel-item,
.dark-mode .testimonial,
.dark-mode .testimonial:hover,
.dark-mode .testimonial strong,
.dark-mode #newsletter,
.dark-mode #newsletter h2,
.dark-mode #newsletter p,
.dark-mode #newsletter form,
.dark-mode #responseMessage,
.dark-mode .card-content,
.dark-mode .card-content * {
  background-color: #373737 !important;
}

.dark-mode #newsletter input,
.dark-mode #newsletter input::placeholder {
  background-color: #575757;
  color: #ffffff;
}

.dark-mode tbody tr:nth-child(odd) {
  background-color: #1f1f1f !important;
}

.dark-mode tr:nth-child(even) {
  background-color: #2a2a2a !important;
}`;
document.head.appendChild(style);

function toggleTheme() {
  const htmlElement = document.body;
  if (htmlElement.classList.contains("dark-mode")) {
    htmlElement.classList.remove("dark-mode");
    htmlElement.classList.add("light-mode");
  } else if (htmlElement.classList.contains("light-mode")) {
    htmlElement.classList.remove("light-mode");
    htmlElement.classList.add("dark-mode");
  } else {
    htmlElement.classList.add("dark-mode");
  }
  document.body.style.overflow = "hidden";
  void document.body.offsetHeight;
  document.body.style.overflow = "auto";
  const chatBody = document.querySelector("#chat-body");
  if (chatBody) {
    chatBody.style.overflow = "hidden";
    void chatBody.offsetHeight;
    chatBody.style.overflow = "auto";
  }
  const currentTheme = htmlElement.classList[0];
  if (currentTheme) {
    db.themeTable.clear(); // Clear existing themes to avoid duplicates
    db.themeTable.add({ theme: currentTheme });
  } else {
    console.log("Theme is undefined");
  }
}
