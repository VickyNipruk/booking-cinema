export const PRICE = 220;

export function validateName(name) {
  return name.trim().length >= 5;
}

export function validatePhone(phone) {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.trim());
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function calculatePrice(count) {
  return count * PRICE;
}

export function getStorageKey(movie, hall) {
  return `${movie}_${hall}`;
}

export function saveBookedSeats(savedSeats, selectedIndexes) {
  return [...savedSeats, ...selectedIndexes];
}