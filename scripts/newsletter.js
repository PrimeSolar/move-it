/*
 * Newsletter Handling Script
 * 
 * This script manages the newsletter subscription process for users, allowing them to enter their email 
 * addresses and receive confirmation of their subscription state.
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
