import posthog from 'posthog-js';

posthog.init('phc_rq7D5DpxdHkHoNxZAvCoDQhZMVh7x7Sg5Fv7RWCKcehF', {
  api_host: 'https://eu.posthog.com',
  autocapture: true,
  capture_pageview: true
});

posthog.onFeatureFlags(() => {
  if (posthog.isFeatureEnabled('show-urgent-filter')) {
    console.log('Feature ON');
    document.getElementById('urgent-btn').style.display = 'block';
  } else {
    console.log('Feature OFF');
    document.getElementById('urgent-btn').style.display = 'none';
  }
});

console.log('PostHog connected');

const seatsContainer = document.getElementById('seats');
const PRICE = 220;
const status = import.meta.env.VITE_APP_STATUS || 'local';
document.getElementById('status').textContent = status;
document.getElementById('bookBtn').addEventListener('click', book);

function getKey() {
  const movie = document.getElementById('movie').value;
  const hall = document.getElementById('hall').value;
  return movie + '_' + hall;
}

function loadSeats() {
  seatsContainer.innerHTML = '';
  const saved = JSON.parse(localStorage.getItem(getKey())) || [];

  for (let i = 0; i < 40; i++) {
    const seat = document.createElement('div');
    seat.classList.add('seat');

    if (saved.includes(i)) {
      seat.classList.add('occupied');
    }

    seat.addEventListener('click', () => {
      if (!seat.classList.contains('occupied')) {
        seat.classList.toggle('selected');
        updatePrice();

        posthog.capture('seat_selected', {
          movie: document.getElementById('movie').value,
          hall: document.getElementById('hall').value,
          seat_index: i,
          selected_count: document.querySelectorAll('.seat.selected').length
        });
      }
    });

    seatsContainer.appendChild(seat);
  }
}

function updatePrice() {
  const count = document.querySelectorAll('.seat.selected').length;
  document.getElementById('price').innerText = `Сума: ${count * PRICE} грн`;
}

function book() {
  const selected = document.querySelectorAll('.seat.selected');
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const movie = document.getElementById('movie').value;
  const hall = document.getElementById('hall').value;

  const result = document.getElementById('result');

  // Подія початку спроби бронювання
  posthog.capture('booking_attempt', {
    movie: movie,
    hall: hall,
    selected_count: selected.length
  });

  if (name.length < 5) {
    result.innerText = 'Введіть коректне ім’я та прізвище';

    posthog.capture('booking_failed', {
      movie: movie,
      hall: hall,
      reason: 'invalid_name',
      selected_count: selected.length
    });
    return;
  }

  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    result.innerText = 'Телефон має містити 10 цифр';

    posthog.capture('booking_failed', {
      movie: movie,
      hall: hall,
      reason: 'invalid_phone',
      selected_count: selected.length
    });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    result.innerText = 'Введіть коректний email';

    posthog.capture('booking_failed', {
      movie: movie,
      hall: hall,
      reason: 'invalid_email',
      selected_count: selected.length
    });
    return;
  }

  if (selected.length === 0) {
    result.innerText = 'Оберіть хоча б одне місце';

    posthog.capture('booking_failed', {
      movie: movie,
      hall: hall,
      reason: 'no_seats_selected',
      selected_count: 0
    });
    return;
  }

  let saved = JSON.parse(localStorage.getItem(getKey())) || [];

  selected.forEach((seat) => {
    saved.push([...seatsContainer.children].indexOf(seat));
  });

  localStorage.setItem(getKey(), JSON.stringify(saved));

  const totalPrice = selected.length * PRICE;

  result.innerText =
    `${name}, ви забронювали ${selected.length} місць. Сума: ${totalPrice} грн`;

  // Головна бізнес-подія: успішне бронювання
  posthog.capture('booking_completed', {
    movie: movie,
    hall: hall,
    seats_count: selected.length,
    total_price: totalPrice
  });

  document.getElementById('name').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('email').value = '';

  loadSeats();
  updatePrice();
}

function clearAll() {
  const password = prompt('Введіть пароль власника');
  if (password === 'admin123') {
    localStorage.clear();
    loadSeats();
    updatePrice();
    alert('Очищено');
  } else {
    alert('Невірний пароль');
  }
}

// Ctrl + Shift + X
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'x') {
    clearAll();
  }
});

document.getElementById('movie').addEventListener('change', loadSeats);
document.getElementById('hall').addEventListener('change', loadSeats);

loadSeats();
updatePrice();