function handleSubscription() {
  const email = document.getElementById("emailInput").value;
  event.preventDefault();

  // Validate the email format
  if (validateEmail(email)) {
    displayMessage(
      "Thank you for subscribing! Welcome to the Move It family!",
      "success"
    );
    document.getElementById("subscribeForm").reset();
  } else {
    displayMessage("Please enter a valid email address.", "danger");
  }
}

// Function to validate email format
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email regex
  return re.test(String(email).toLowerCase());
}

// Function to display messages to the user
function displayMessage(message, type) {
  const responseMessage = document.getElementById("responseMessage");
  responseMessage.textContent = message;
  responseMessage.className =
    type === "success" ? "text-success" : "text-danger";
}
