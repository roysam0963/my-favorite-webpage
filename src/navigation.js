/**
 * Navigation menu management for the navbar.
 */

const NAV_ITEMS = ['HOME', 'ABOUT', 'SERVICE', 'DESIGN', 'CONTACT'];

function getNavItems() {
  return [...NAV_ITEMS];
}

function isValidNavItem(item) {
  return typeof item === 'string' && NAV_ITEMS.includes(item.toUpperCase());
}

function createNavLink(label, href) {
  if (typeof label !== 'string' || label.trim() === '') {
    throw new Error('Navigation label is required');
  }
  if (typeof href !== 'string' || href.trim() === '') {
    throw new Error('Navigation href is required');
  }
  return {
    label: label.trim().toUpperCase(),
    href: href.trim(),
    isActive: false,
  };
}

function setActiveNavItem(navLinks, activeLabel) {
  if (!Array.isArray(navLinks)) {
    throw new Error('navLinks must be an array');
  }
  return navLinks.map((link) => ({
    ...link,
    isActive: link.label.toUpperCase() === activeLabel.toUpperCase(),
  }));
}

function buildNavHTML(navLinks) {
  if (!Array.isArray(navLinks) || navLinks.length === 0) {
    return '<ul></ul>';
  }
  const items = navLinks
    .map((link) => {
      const activeClass = link.isActive ? ' class="active"' : '';
      return `<li${activeClass}><a href="${link.href}">${link.label}</a></li>`;
    })
    .join('');
  return `<ul>${items}</ul>`;
}

module.exports = {
  NAV_ITEMS,
  getNavItems,
  isValidNavItem,
  createNavLink,
  setActiveNavItem,
  buildNavHTML,
};
