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
    const seconds = Math.floor((timeLeft / 1000) % 60);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    countdownElement.innerText = `Hurry! ${minutes}m ${seconds}s left for 15% off!`;
    setTimeout(updateDiscountCountdown, 1000);
  } else {
    countdownElement.innerText = "Discount period has ended!";
    discountEndTime = null;
    setTimeout(startDiscountCountdown, 1000);
  }
}

startDiscountCountdown();
