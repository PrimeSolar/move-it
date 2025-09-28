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
