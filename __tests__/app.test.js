/**
 * @jest-environment jsdom
 */

const {
  initializeNavigation,
  handleLoginSubmit,
  handleSearch,
  createPage,
  getFormValues,
} = require('../src/app');
const { buildLoginForm } = require('../src/dom');

describe('initializeNavigation', () => {
  it('returns nav links with HOME set as active', () => {
    const links = initializeNavigation();
    expect(links).toHaveLength(5);
    expect(links[0].isActive).toBe(true);
    expect(links[0].label).toBe('HOME');
  });

  it('all other items are inactive', () => {
    const links = initializeNavigation();
    links.slice(1).forEach((link) => {
      expect(link.isActive).toBe(false);
    });
  });

  it('each link has an href', () => {
    const links = initializeNavigation();
    links.forEach((link) => {
      expect(link.href).toBe('#');
    });
  });
});

describe('handleLoginSubmit', () => {
  it('returns valid result for correct inputs', () => {
    const result = handleLoginSubmit('user@example.com', 'password123');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.sanitizedEmail).toBe('user@example.com');
  });

  it('sanitizes email input', () => {
    const result = handleLoginSubmit('<script>@evil.com', 'password123');
    expect(result.sanitizedEmail).toBe('&lt;script&gt;@evil.com');
  });

  it('returns errors for invalid email', () => {
    const result = handleLoginSubmit('not-email', 'password123');
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('returns errors for short password', () => {
    const result = handleLoginSubmit('user@example.com', 'abc');
    expect(result.isValid).toBe(false);
  });

  it('returns errors for empty fields', () => {
    const result = handleLoginSubmit('', '');
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(2);
  });
});

describe('handleSearch', () => {
  const items = ['HOME', 'ABOUT', 'SERVICE', 'DESIGN', 'CONTACT'];

  it('returns all items for empty query', () => {
    const result = handleSearch('', items);
    expect(result.query).toBe('');
    expect(result.results).toEqual(items);
  });

  it('filters items matching the query', () => {
    const result = handleSearch('des', items);
    expect(result.query).toBe('des');
    expect(result.results).toEqual(['DESIGN']);
  });

  it('returns empty results for non-matching query', () => {
    const result = handleSearch('xyz', items);
    expect(result.results).toEqual([]);
  });

  it('normalizes query to lowercase', () => {
    const result = handleSearch('  HOME  ', items);
    expect(result.query).toBe('home');
    expect(result.results).toEqual(['HOME']);
  });
});

describe('createPage', () => {
  it('creates navbar and login form elements', () => {
    const page = createPage('RoySam');
    expect(page.navbar).toBeDefined();
    expect(page.navbar.className).toBe('navbar');
    expect(page.loginForm).toBeDefined();
    expect(page.loginForm.className).toBe('form');
  });

  it('uses default logo when none provided', () => {
    const page = createPage();
    const logo = page.navbar.querySelector('.logo');
    expect(logo.textContent).toBe('RoySam');
  });

  it('uses custom logo text', () => {
    const page = createPage('MyBrand');
    const logo = page.navbar.querySelector('.logo');
    expect(logo.textContent).toBe('MyBrand');
  });

  it('navbar contains all 5 nav items', () => {
    const page = createPage('RoySam');
    const items = page.navbar.querySelectorAll('.menu ul li');
    expect(items).toHaveLength(5);
  });
});

describe('getFormValues', () => {
  it('extracts email and password values from form', () => {
    const form = buildLoginForm();
    const emailInput = form.querySelector('input[type="email"]');
    const passwordInput = form.querySelector('input[type="password"]');
    emailInput.value = 'test@example.com';
    passwordInput.value = 'secret';

    const values = getFormValues(form);
    expect(values.email).toBe('test@example.com');
    expect(values.password).toBe('secret');
  });

  it('returns empty strings when inputs are not found', () => {
    const div = document.createElement('div');
    const values = getFormValues(div);
    expect(values.email).toBe('');
    expect(values.password).toBe('');
  });

  it('returns empty strings for null container', () => {
    const values = getFormValues(null);
    expect(values.email).toBe('');
    expect(values.password).toBe('');
  });
});
