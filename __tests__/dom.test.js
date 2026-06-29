/**
 * @jest-environment jsdom
 */

const {
  createElementWithClass,
  buildLoginForm,
  buildNavbar,
  queryFormInputs,
  getNavLinks,
} = require('../src/dom');

describe('createElementWithClass', () => {
  it('creates an element with the given tag', () => {
    const el = createElementWithClass('div', 'test');
    expect(el.tagName).toBe('DIV');
  });

  it('applies the given class name', () => {
    const el = createElementWithClass('span', 'highlight');
    expect(el.className).toBe('highlight');
  });

  it('sets text content when provided', () => {
    const el = createElementWithClass('p', 'text', 'Hello');
    expect(el.textContent).toBe('Hello');
  });

  it('creates element without class when className is null', () => {
    const el = createElementWithClass('h1', null, 'Title');
    expect(el.className).toBe('');
    expect(el.textContent).toBe('Title');
  });

  it('creates element without text when textContent is null', () => {
    const el = createElementWithClass('div', 'box');
    expect(el.textContent).toBe('');
  });

  it('throws for empty tag name', () => {
    expect(() => createElementWithClass('', 'test')).toThrow('Tag name is required');
  });

  it('throws for non-string tag', () => {
    expect(() => createElementWithClass(null, 'test')).toThrow('Tag name is required');
  });
});

describe('buildLoginForm', () => {
  let form;

  beforeEach(() => {
    form = buildLoginForm();
  });

  it('creates a div with class "form"', () => {
    expect(form.tagName).toBe('DIV');
    expect(form.className).toBe('form');
  });

  it('contains a heading with "Login here"', () => {
    const h2 = form.querySelector('h2');
    expect(h2).not.toBeNull();
    expect(h2.textContent).toBe('Login here');
  });

  it('contains an email input', () => {
    const email = form.querySelector('input[type="email"]');
    expect(email).not.toBeNull();
    expect(email.name).toBe('email');
    expect(email.placeholder).toBe('Enter Email Here');
  });

  it('contains a password input', () => {
    const password = form.querySelector('input[type="password"]');
    expect(password).not.toBeNull();
    expect(password.name).toBe('password');
    expect(password.placeholder).toBe('Enter password Here');
  });

  it('contains a login button with class "btnn"', () => {
    const btn = form.querySelector('button.btnn');
    expect(btn).not.toBeNull();
  });

  it('login button contains a link with text "Login"', () => {
    const link = form.querySelector('button.btnn a');
    expect(link).not.toBeNull();
    expect(link.textContent).toBe('Login');
    expect(link.href).toContain('#');
  });
});

describe('buildNavbar', () => {
  const menuItems = ['HOME', 'ABOUT', 'CONTACT'];
  let navbar;

  beforeEach(() => {
    navbar = buildNavbar('RoySam', menuItems);
  });

  it('creates a div with class "navbar"', () => {
    expect(navbar.tagName).toBe('DIV');
    expect(navbar.className).toBe('navbar');
  });

  it('contains the logo text', () => {
    const logo = navbar.querySelector('.logo');
    expect(logo).not.toBeNull();
    expect(logo.textContent).toBe('RoySam');
  });

  it('contains the correct number of menu items', () => {
    const items = navbar.querySelectorAll('.menu ul li');
    expect(items).toHaveLength(3);
  });

  it('each menu item has a link with correct text', () => {
    const links = navbar.querySelectorAll('.menu ul li a');
    expect(links[0].textContent).toBe('HOME');
    expect(links[1].textContent).toBe('ABOUT');
    expect(links[2].textContent).toBe('CONTACT');
  });

  it('all links point to #', () => {
    const links = navbar.querySelectorAll('.menu ul li a');
    links.forEach((link) => {
      expect(link.getAttribute('href')).toBe('#');
    });
  });
});

describe('queryFormInputs', () => {
  it('returns email and password inputs from a form container', () => {
    const form = buildLoginForm();
    const inputs = queryFormInputs(form);
    expect(inputs.email).not.toBeNull();
    expect(inputs.email.type).toBe('email');
    expect(inputs.password).not.toBeNull();
    expect(inputs.password.type).toBe('password');
  });

  it('returns nulls for missing inputs', () => {
    const div = document.createElement('div');
    const inputs = queryFormInputs(div);
    expect(inputs.email).toBeNull();
    expect(inputs.password).toBeNull();
  });

  it('returns nulls for null container', () => {
    const inputs = queryFormInputs(null);
    expect(inputs.email).toBeNull();
    expect(inputs.password).toBeNull();
  });

  it('returns nulls for non-element container', () => {
    const inputs = queryFormInputs('not-an-element');
    expect(inputs.email).toBeNull();
    expect(inputs.password).toBeNull();
  });
});

describe('getNavLinks', () => {
  it('extracts nav links from navbar', () => {
    const navbar = buildNavbar('RoySam', ['HOME', 'ABOUT']);
    const links = getNavLinks(navbar);
    expect(links).toHaveLength(2);
    expect(links[0]).toEqual({ label: 'HOME', href: '#' });
    expect(links[1]).toEqual({ label: 'ABOUT', href: '#' });
  });

  it('returns empty array for null container', () => {
    expect(getNavLinks(null)).toEqual([]);
  });

  it('returns empty array for non-element', () => {
    expect(getNavLinks('not-element')).toEqual([]);
  });

  it('returns empty array when no nav links exist', () => {
    const div = document.createElement('div');
    expect(getNavLinks(div)).toEqual([]);
  });
});
