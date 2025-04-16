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
