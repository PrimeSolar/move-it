/*
 * Slide Animation Script
 *
 * This script manages slide animations for specific elements on the webpage
 * and includes a custom logging module to monitor currently active animations.
 *
 * 1. **Style Use**: on DOMContentLoaded, a <style> element is created and appended to the document head,
 * defining CSS styles for slide animations.
 *  - **.slide-animation**: sets initial styles for opacity and vertical translation.
 *  - **.slide-animation.visible**: defines the final state of visibility and original position.
 *
 * 2. **Element Selection and Animation Class Application**:
 *  - Selects all <img> (excluding those with classes "d-block", "w-100", "rounded-5"), <h2>, and <p> elements.
 *  - Applies the "slide-animation" class to these elements to prepare them for animation.
 *
 * 3. **Intersection Observer**:
 *  - Sets up an "IntersectionObserver" to track the visibility of animated elements.
 *  - When an observed element comes into view, the "visible" class is added, triggering the slide animation.
 *
 * 4. **Custom Logger Module**: a code is created to watch for animations of elements.
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
  const style = document.createElement("style");
  style.textContent = `
/* Slide Animation */

.slide-animation {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.57s ease-out, transform 0.57s ease-out;
}

.slide-animation.visible {
  opacity: 1;
  transform: translateY(0);
}`;
  document.head.appendChild(style);

  const animatedElements = document.querySelectorAll(
    "img:not(.d-block.w-100.rounded-5), h2, p"
  );
  // Add initial animation class to each element
  for (let x of animatedElements) {
    x.classList.add("slide-animation");
  }

  // Create an IntersectionObserver to trigger animation when elements are in view
  const observer = new IntersectionObserver(
    (entries) => {
      for (let x of entries) {
        if (x.isIntersecting) {
          x.target.classList.add("visible");
          observer.unobserve(x.target);
        }
      }
    },
    { threshold: 0.25 }
  );

  for (let x of animatedElements) {
    observer.observe(x);
  }

  /******************************
   * Custom Logger Module
   ******************************/
  const Logger = (() => {
    const debugMode = true; // Toggle debug logs

    const log = (...args) => {
      if (debugMode) console.log("[DEBUG]", ...args);
    };

    return { log };
  })();

  const logActiveAnimations = () => {
    const currentlyVisible = [];
    document.querySelectorAll(".slide-animation").forEach((el) => {
      if (el.classList.contains("visible")) {
        currentlyVisible.push(el);
      }
    });
    Logger.log(
      `Currently ${currentlyVisible.length} out of ${
        document.querySelectorAll(".slide-animation").length
      } animated elements are visible.`
    );
  };

  // Log active animations every 5 seconds
  setInterval(logActiveAnimations, 5000);
});
