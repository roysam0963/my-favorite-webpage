/**
 * Form validation utilities for the login form.
 */

function isValidEmail(email) {
  if (typeof email !== 'string' || email.trim() === '') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

function isValidPassword(password) {
  if (typeof password !== 'string') {
    return false;
  }
  return password.length >= 6;
}

function validateLoginForm(email, password) {
  const errors = [];

  if (!email || email.trim() === '') {
    errors.push('Email is required');
  } else if (!isValidEmail(email)) {
    errors.push('Please enter a valid email address');
  }

  if (!password || password === '') {
    errors.push('Password is required');
  } else if (!isValidPassword(password)) {
    errors.push('Password must be at least 6 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return '';
  }
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

module.exports = {
  isValidEmail,
  isValidPassword,
  validateLoginForm,
  sanitizeInput,
};
