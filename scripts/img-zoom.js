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
