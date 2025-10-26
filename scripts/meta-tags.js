/*
 * Configuration Script for Move It
 *
 * This script sets up the essential HTML structure for the Move It web application.
 * It dynamically inserts metadata, styles, and scripts to configure the document's head and body
 * elements for optimal SEO, accessibility, and user experience.
 *
 * Key Features:
 * - Sets the default language of the document to English (`lang = "en"`).
 * - Defines the default text direction as left-to-right (`dir = "ltr"`).
 * - Configures the document title for a web page.
 * - Inserts viewport settings to ensure responsive design.
 * - Includes metadata for author and copyright to enhance SEO.
 * - Links to the stylesheet for styling the application.
 * - Adds a badge to enhance brand identity.
 * - Specifies the type attribute for all script elements for better compatibility.
 *
 * Copyright © Vladislav Kazantsev
 * All rights reserved.
 * This code is the intellectual property of Vladislav Kazantsev.
 * You are welcome to clone the related repository and use the code for exploratory purposes.
 * However, unauthorized reproduction, modification, or redistribution of this code (including cloning of related repository or altering it for activities beyond exploratory use) is strictly prohibited.
 * Code snippets may be shared only when the original author is explicitly credited and a direct link to the original source of the code is provided alongside the code snippet.
 * Sharing the link to the file is permitted, except when directed toward retrieval purposes.
 * Any form of interaction with this file is strictly prohibited when facilitated by the code, except when such interaction is for discussion or exchange purposes with others.
 * This copyright notice applies globally.
 * For inquiries about collaboration, usage outside exploratory purposes, or permissions, please contact: hypervisor7@pm.me
 */

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
  const noTypingTitle = document.querySelector(".no-typing");
  const title = document.querySelector("h1");
  if (noTypingTitle) {
    document.title = noTypingTitle.textContent + " | Move It";
  } else if (title) {
    document.title = title.textContent + " | Move It";
  } else {
    document.title = "Move It";
  }

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

  // Connect "bootstrap.min.css"
  const linkBootstrap = document.createElement("link");
  linkBootstrap.rel = "stylesheet";
  linkBootstrap.type = "text/css";
  linkBootstrap.href =
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css";
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

  // Connect "bootstrap.bundle.min.js"
  const scriptBootstrap = document.createElement("script");
  scriptBootstrap.type = "text/javascript";
  scriptBootstrap.src =
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js";
  scriptBootstrap.crossorigin = "anonymous";
  document.querySelector("body").appendChild(scriptBootstrap);
  scriptBootstrap.onerror = function () {
    console.error("Failed to load bootstrap.min.css");
    // Show an informational message
    document.body.insertAdjacentHTML(
      "afterbegin",
      "<p>Error loading scripts. Please try again later.</p>"
    );
  };

  // Insert <link rel="icon" href="pics/logos/logo.svg">
  const linkImage = document.createElement("link");
  linkImage.rel = "icon";
  linkImage.href = "assets/logo.svg";
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
