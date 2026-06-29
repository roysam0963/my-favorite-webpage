/**
 * DOM utilities for building and querying page structure.
 */

function createElementWithClass(tag, className, textContent) {
  if (typeof tag !== 'string' || tag.trim() === '') {
    throw new Error('Tag name is required');
  }
  const el = document.createElement(tag);
  if (className) {
    el.className = className;
  }
  if (textContent) {
    el.textContent = textContent;
  }
  return el;
}

function buildLoginForm() {
  const form = createElementWithClass('div', 'form');

  const heading = createElementWithClass('h2', null, 'Login here');
  form.appendChild(heading);

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.placeholder = 'Enter Email Here';
  form.appendChild(emailInput);

  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.name = 'password';
  passwordInput.placeholder = 'Enter password Here';
  form.appendChild(passwordInput);

  const loginBtn = createElementWithClass('button', 'btnn');
  const loginLink = document.createElement('a');
  loginLink.href = '#';
  loginLink.textContent = 'Login';
  loginBtn.appendChild(loginLink);
  form.appendChild(loginBtn);

  return form;
}

function buildNavbar(logoText, menuItems) {
  const navbar = createElementWithClass('div', 'navbar');

  const iconDiv = createElementWithClass('div', 'icon');
  const logo = createElementWithClass('h2', 'logo', logoText);
  iconDiv.appendChild(logo);
  navbar.appendChild(iconDiv);

  const menuDiv = createElementWithClass('div', 'menu');
  const ul = document.createElement('ul');
  menuItems.forEach((item) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = item;
    li.appendChild(a);
    ul.appendChild(li);
  });
  menuDiv.appendChild(ul);
  navbar.appendChild(menuDiv);

  return navbar;
}

function queryFormInputs(container) {
  if (!container || typeof container.querySelectorAll !== 'function') {
    return { email: null, password: null };
  }
  const email = container.querySelector('input[type="email"]');
  const password = container.querySelector('input[type="password"]');
  return { email, password };
}

function getNavLinks(container) {
  if (!container || typeof container.querySelectorAll !== 'function') {
    return [];
  }
  const links = container.querySelectorAll('.menu ul li a');
  return Array.from(links).map((a) => ({
    label: a.textContent,
    href: a.getAttribute('href'),
  }));
}

module.exports = {
  createElementWithClass,
  buildLoginForm,
  buildNavbar,
  queryFormInputs,
  getNavLinks,
};
