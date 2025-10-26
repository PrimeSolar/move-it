/*
 * Image Zoom Script
 *
 * This script enhances the user experience by applying zoom and shadow effects to images
 * on a webpage when hovered over, unless specifically disabled.
 *
 * 1. **Event Listener on DOMContentLoaded**: the script runs once the entire DOM has finished loading.
 *
 * 2. **Image Selection**: it selects all images on a page to apply the hover effects.
 *
 * 3. **Scaling Effect**: images without the class "no-zoom" will scale up when hovered over.
 * A transition duration is set for smooth scaling and shadow effects.
 *
 * 4. **Shadow and Brightness Effect**: for images with the class "zoom-with-shadow",
 * a shadow is added and brightness is slightly reduced on hover.
 * These styles are reset when the mouse leaves the image.
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
  const img = document.querySelectorAll("img");
  const scaleAmount = 1.07; // Scale factor
  const transitionDuration = "0.27s"; // Transition duration

  for (let x of img) {
    if (x.classList.contains("no-zoom") !== true) {
      x.style.transition = `transform ${transitionDuration} ease, box-shadow ${transitionDuration} ease`; // Set transition for both transform and shadow

      x.addEventListener("mouseover", () => {
        x.style.transform = `scale(${scaleAmount})`; // Scale up
      });

      x.addEventListener("mouseout", () => {
        x.style.transform = "scale(1)"; // Reset scale
      });
    }

    if (x.classList.contains("zoom-with-shadow")) {
      x.addEventListener("mouseover", () => {
        x.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.3)"; // Add shadow
        x.style.filter = "brightness(0.9)"; // Darken the image slightly
      });

      x.addEventListener("mouseout", () => {
        x.style.boxShadow = "none"; // Remove extra shadow
        x.style.filter = "none"; // Reset filter
      });
    }
  }
});
