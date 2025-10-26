/*
 * Referral Identifier and Link Management Script
 *
 * This script handles the generation and management of unique referral identifiers and links,
 * providing users with a way to share referrals effectively.
 *
 * 1. **generateIdentifier Function**: generates a unique identifier.
 *
 * 2. **getReferralIdentifier Function** checks for an existing referral identifier in the local storage.
 * If not found, it generates a new identifier using **generateIdentifier** and stores it
 * in local storage for future access.
 *
 * 3. **updateReferralLink Function**: retrieves the referral identifier using **getReferralIdentifier**,
 * constructs a full referral link using the identifier,
 * and updates the value of the input element with identifier "referralLink" to display the complete
 * referral link for a user to copy.
 *
 * 4. **copyReferralLink Function**: selects the referral link text and copies it to the clipboard
 * using the `execCommand` method,
 * changes the text of the button that was clicked to "Copied!" to provide feedback to a user,
 * and rresets the button text back to "Copy" after a 1-second timeout for clarity.
 *
 * 5. **Initialization**: automatically updates the referral link when the page loads.
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

// Function to generate a unique identifier
function generateIdentifier() {
  return Math.random().toString(36).substr(2, 9);
}

// Function to get or create a unique referral identifier
function getReferralIdentifier() {
  let identifier = localStorage.getItem("referralId");
  if (!identifier) {
    identifier = generateIdentifier();
    localStorage.setItem("referralId", identifier);
  }
  return identifier;
}

// Function to update the referral link with the unique identifier
const link = document.getElementById("referralLink");
function updateReferralLink() {
  const referralId = getReferralIdentifier();
  const referralLink = `https://primesolar.github.io/move-it/?referralId=${referralId}`;
  link.value = referralLink;
}

// Function to copy the referral link to the clipboard
function copyReferralLink() {
  link.select();
  document.execCommand("copy");

  // Change button text to "Copied!"
  const button = event.target; // Get the button that was clicked
  button.textContent = "Copied!";

  //Change button text back to "Copy" after a few seconds
  setTimeout(() => {
    button.textContent = "Copy";
  }, 1000);
}

// Initialize the referral link on page load
window.onload = updateReferralLink;
