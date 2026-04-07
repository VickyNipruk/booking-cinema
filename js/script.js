const seatsContainer = document.getElementById('seats');
const PRICE = 220;

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

  const result = document.getElementById('result');

  if (name.length < 5) {
    result.innerText = 'Введіть коректне ім’я та прізвище';
    return;
  }

  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    result.innerText = 'Телефон має містити 10 цифр';
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    result.innerText = 'Введіть коректний email';
    return;
  }

  if (selected.length === 0) {
    result.innerText = 'Оберіть хоча б одне місце';
    return;
  }

  let saved = JSON.parse(localStorage.getItem(getKey())) || [];

  selected.forEach((seat) => {
    saved.push([...seatsContainer.children].indexOf(seat));
  });

  localStorage.setItem(getKey(), JSON.stringify(saved));

  result.innerText =
    `${name}, ви забронювали ${selected.length} місць. Сума: ${selected.length * PRICE} грн`;

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
