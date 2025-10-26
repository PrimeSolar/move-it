/*
 * Typing Animation Script
 *
 * This script provides a typing animation effect for elements with a specific class on a webpage,
 * showing the appearance of text being typed out character by character.
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
  const TYPING_VELOCITY = 100; // Velocity of typing in milliseconds per character
  const TYPING_CLASS = "typing";
  const FINISHED_CLASS = "typing-finished";

  const typingElements = document.querySelectorAll(`.${TYPING_CLASS}`);

  // Function to type out text
  const typeText = (element, text, velocity, callback) => {
    let index = 0;

    const typeNextCharacter = () => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(typeNextCharacter, velocity);
      } else {
        element.classList.add(FINISHED_CLASS);
        if (callback) callback();
      }
    };

    typeNextCharacter();
  };

  // Check if there are typing elements
  if (typingElements.length > 0) {
    typingElements.forEach((element) => {
      let clone = element.cloneNode(true);
      clone.classList.remove("typing");
      clone.classList.add("no-typing");
      element.parentElement.insertBefore(clone, element.nextSibling);
      const text = element.textContent; // Get the text content
      element.textContent = ""; // Clear the text content for typing effect

      // Start typing effect
      typeText(element, text, TYPING_VELOCITY, () => {
        console.log(`Finished typing: "${text}"`);
      });
    });
  } else {
    console.warn(`No elements with class "${TYPING_CLASS}" found.`);
  }
});
