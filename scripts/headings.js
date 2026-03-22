/**
 * Document Headings Enumerator
 *
 * Collect all heading elements (h1 - h6) from the current webpage, enumerate them,
 * and log their tag names and trimmed text contents.
 *
 * Behavior details:
 *
 * document.querySelectorAll("h1, h2, h3, h4, h5, h6") returns a static NodeList of heading elements in document order. Spreading into an array ensures array methods (like forEach) are available.
 * forEach iterates through the headings array with an index. Index is zero-based, so 1 is added to present a human-friendly ordinal in logs.
 * heading.tagName specifies the tag name in uppercase (for example, "H1"), clearly identifying the heading level in output.
 * heading.textContent includes all descendant text; trim() removes accidental leading/trailing whitespace for cleaner output.
 * Console output format: ": - " - concise, line-by-line listing suitable for content auditing.
 * The final console.log confirms the script finished running.
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

/** Select the headings and log them. */
const headings = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")];
headings.forEach((heading, index) => {
  console.log(
    `${index + 1}: ${heading.tagName} - ${heading.textContent.trim()}`
  );
});

console.log("headings.js is completed");
