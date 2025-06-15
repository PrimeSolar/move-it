document.addEventListener("DOMContentLoaded", () => {
  // Set the <html> element `lang` property
  const html = document.querySelector("html");
  html.lang = "en";

  // Set `dir="ltr"` for the <html> element
  html.dir = "ltr";

  // Set <meta name="viewport" content="width=device-width, initial-scale=1" />
  const metaViewport = document.createElement("meta");
  metaViewport.name = "viewport";
  metaViewport.content = "width=device-width, initial-scale=1";
  document.querySelector("head").appendChild(metaViewport);

  // Set `title` for the <html> element based on a webpage's content
  const title = document.querySelector("h1");
  document.title = title.textContent + " | Move It";

  // Insert <meta name="author" content="Vladislav Kazantsev">
  const metaAuthor = document.createElement("meta");
  metaAuthor.name = "author";
  metaAuthor.content = "Vladislav Kazantsev";
  document.querySelector("head").appendChild(metaAuthor);

  // Insert <meta name="copyright" content="© `Current Year` Vladislav Kazantsev">
  const metaCopyright = document.createElement("meta");
  metaCopyright.name = "copyright";
  metaCopyright.content =
    "© " + new Date().getFullYear() + " Vladislav Kazantsev";
  document.querySelector("head").appendChild(metaCopyright);

  // Insert the custom CSS
  const linkStyle = document.createElement("link");
  const linkMediaQueries = document.createElement("link");
  function insertStyle() {
    // Insert "style.css"
    linkStyle.rel = "stylesheet";
    linkStyle.type = "text/css";
    linkStyle.href = "styles/style-min.css";
    document.querySelector("head").appendChild(linkStyle);

    // Insert "media-queries-min.css"
    linkMediaQueries.rel = "stylesheet";
    linkMediaQueries.type = "text/css";
    linkMediaQueries.href = "styles/media-queries-min.css";
    document.querySelector("head").appendChild(linkMediaQueries);
  }

  // Insert "bootstrap.min.css"
  const linkBootstrap = document.createElement("link");
  linkBootstrap.rel = "stylesheet";
  linkBootstrap.type = "text/css";
  linkBootstrap.href =
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
  linkBootstrap.crossorigin = "anonymous";
  document.querySelector("head").appendChild(linkBootstrap);
  linkBootstrap.onload = function () {
    insertStyle(); // Insert the custom CSS after the bootstrap.min.css is loaded
    linkStyle.onload = function () {
      document.body.style.display = "block"; // Show the body after the CSS is loaded
    };
  };
  linkBootstrap.onerror = function () {
    console.error("Failed to load bootstrap.min.css");
    // Show an informational message
    document.body.insertAdjacentHTML(
      "afterbegin",
      "<p>Error loading styles. Please try again later.</p>"
    );
    insertStyle(); // Insert the custom CSS even if the bootstrap.min.css fails
    linkStyle.onload = function () {
      document.body.style.display = "block"; // Show the body even if the bootstrap.min.css fails
    };
  };

  // Insert <link rel="icon" href="pics/logos/favicon.jpg">
  const linkImage = document.createElement("link");
  linkImage.rel = "icon";
  linkImage.href = "assets/favicon.svg";
  document.querySelector("head").appendChild(linkImage);

  // Set `type="text/javascript"` for all <script> elements for better compatibility
  for (let x of document.querySelectorAll("script")) {
    x.type = "text/javascript";
  }

  // Insert <meta http-equiv="Pragma" content="no-cache">
  // var metaPragma = document.createElement("meta");
  // metaPragma.httpEquiv = "Pragma";
  // metaPragma.content = "no-cache";
  // document.querySelector("head").appendChild(metaPragma);
});
