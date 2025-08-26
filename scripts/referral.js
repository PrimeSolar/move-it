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
