/**
 * Main application entry point that wires up all modules.
 */

const { validateLoginForm, sanitizeInput } = require('./validation');
const { getNavItems, setActiveNavItem, createNavLink } = require('./navigation');
const { filterItems, normalizeQuery } = require('./search');
const { buildLoginForm, buildNavbar, queryFormInputs } = require('./dom');

function initializeNavigation() {
  const items = getNavItems();
  const navLinks = items.map((item) => createNavLink(item, '#'));
  return setActiveNavItem(navLinks, 'HOME');
}

function handleLoginSubmit(emailValue, passwordValue) {
  const sanitizedEmail = sanitizeInput(emailValue);
  const sanitizedPassword = sanitizeInput(passwordValue);
  const result = validateLoginForm(sanitizedEmail, sanitizedPassword);

  return {
    ...result,
    sanitizedEmail,
  };
}

function handleSearch(query, searchableItems) {
  const normalized = normalizeQuery(query);
  if (!normalized) {
    return { query: '', results: searchableItems };
  }
  const results = filterItems(searchableItems, normalized);
  return { query: normalized, results };
}

function createPage(logoText) {
  const navItems = getNavItems();
  const navbar = buildNavbar(logoText || 'RoySam', navItems);
  const loginForm = buildLoginForm();
  return { navbar, loginForm };
}

function getFormValues(formContainer) {
  const inputs = queryFormInputs(formContainer);
  return {
    email: inputs.email ? inputs.email.value : '',
    password: inputs.password ? inputs.password.value : '',
  };
}

module.exports = {
  initializeNavigation,
  handleLoginSubmit,
  handleSearch,
  createPage,
  getFormValues,
};
