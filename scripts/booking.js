/*
 * Booking System Functionality Script
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

// Function to update booked moves display
function updateBookedMoves() {
  const currentHour = new Date().getHours();
  const totalBookedMoves = 50 + currentHour;
  const bookedMovesElement = document.getElementById("bookedMoves");
  bookedMovesElement.innerText = `Moves booked today: ${totalBookedMoves}`;

  const availableSlots = 24 - currentHour;
  const availabilityNotice = document.getElementById("availabilityNotice");
  availabilityNotice.innerText = `Only ${availableSlots} slot${
    availableSlots !== 1 ? "s" : ""
  } are available for today!`;
  availabilityNotice.style.display = "block";
}

// Call the function when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", updateBookedMoves);

// Function to start the discount countdown
let discountEndTime = null;
function startDiscountCountdown() {
  const now = new Date();
  const currentMinutes = now.getMinutes();

  const nextTenMinute = Math.ceil(currentMinutes / 10) * 10;
  const nextTenMinuteDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    nextTenMinute,
    0,
    0
  );

  if (nextTenMinute === 60) {
    nextTenMinuteDate.setHours(nextTenMinuteDate.getHours() + 1);
    nextTenMinuteDate.setMinutes(0);
  }

  discountEndTime = nextTenMinuteDate.getTime();
  updateDiscountCountdown();
}

// Function to update the countdown display
function updateDiscountCountdown() {
  const now = Date.now();
  const timeLeft = discountEndTime - now;

  const countdownElement = document.getElementById("countdown");

  if (timeLeft > 0) {
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);
    countdownElement.innerText = `Hurry! ${minutes}m ${seconds}s left for 15% off!`;
    setTimeout(updateDiscountCountdown, 1000);
  } else {
    countdownElement.innerText = "Discount period has ended!";
    discountEndTime = null;
    setTimeout(startDiscountCountdown, 1000);
  }
}

// Call the function when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", startDiscountCountdown);
