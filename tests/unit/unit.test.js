import { describe, it, expect, vi } from 'vitest';
import {
  validateName,
  validatePhone,
  validateEmail,
  calculatePrice,
  getStorageKey,
  saveBookedSeats,
  PRICE
} from '../../js/cinemaLogic.js';

describe('Тестування бізнес-логіки кінотеатру', () => {
  it('коректно перевіряє правильне ім’я користувача', () => {
    expect(validateName('Іван Петренко')).toBe(true);
  });

  it('відхиляє занадто коротке ім’я', () => {
    expect(validateName('Іра')).toBe(false);
  });

  it('приймає номер телефону з 10 цифр', () => {
    expect(validatePhone('0971234567')).toBe(true);
  });

  it('відхиляє некоректний номер телефону', () => {
    expect(validatePhone('12345')).toBe(false);
  });

  it('приймає коректний email', () => {
    expect(validateEmail('test@gmail.com')).toBe(true);
  });

  it('відхиляє некоректний email', () => {
    expect(validateEmail('testgmail.com')).toBe(false);
  });

  it('правильно обчислює суму бронювання', () => {
    expect(calculatePrice(3)).toBe(3 * PRICE);
  });

  it('правильно формує ключ localStorage', () => {
    expect(getStorageKey('Аватар', 'Зал 1')).toBe('Аватар_Зал 1');
  });

  it('правильно додає нові місця до списку заброньованих', () => {
    expect(saveBookedSeats([1, 2], [5, 6])).toEqual([1, 2, 5, 6]);
  });
});

describe('Mock localStorage', () => {
  it('перевіряє виклик setItem', () => {
    const setItemMock = vi.fn();

    const fakeLocalStorage = {
      setItem: setItemMock
    };

    fakeLocalStorage.setItem('test_key', '123');

    expect(setItemMock).toHaveBeenCalled();
    expect(setItemMock).toHaveBeenCalledWith('test_key', '123');
  });
});