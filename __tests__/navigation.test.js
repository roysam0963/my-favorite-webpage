const {
  NAV_ITEMS,
  getNavItems,
  isValidNavItem,
  createNavLink,
  setActiveNavItem,
  buildNavHTML,
} = require('../src/navigation');

describe('NAV_ITEMS', () => {
  it('contains the expected navigation items', () => {
    expect(NAV_ITEMS).toEqual(['HOME', 'ABOUT', 'SERVICE', 'DESIGN', 'CONTACT']);
  });

  it('has exactly 5 items', () => {
    expect(NAV_ITEMS).toHaveLength(5);
  });
});

describe('getNavItems', () => {
  it('returns a copy of NAV_ITEMS', () => {
    const items = getNavItems();
    expect(items).toEqual(NAV_ITEMS);
    expect(items).not.toBe(NAV_ITEMS);
  });

  it('does not allow mutation of original array', () => {
    const items = getNavItems();
    items.push('EXTRA');
    expect(NAV_ITEMS).toHaveLength(5);
  });
});

describe('isValidNavItem', () => {
  it('returns true for valid nav items (case-insensitive)', () => {
    expect(isValidNavItem('HOME')).toBe(true);
    expect(isValidNavItem('home')).toBe(true);
    expect(isValidNavItem('Home')).toBe(true);
  });

  it('returns true for all defined nav items', () => {
    NAV_ITEMS.forEach((item) => {
      expect(isValidNavItem(item)).toBe(true);
    });
  });

  it('returns false for invalid items', () => {
    expect(isValidNavItem('BLOG')).toBe(false);
    expect(isValidNavItem('PORTFOLIO')).toBe(false);
  });

  it('returns false for non-string input', () => {
    expect(isValidNavItem(null)).toBe(false);
    expect(isValidNavItem(undefined)).toBe(false);
    expect(isValidNavItem(123)).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isValidNavItem('')).toBe(false);
  });
});

describe('createNavLink', () => {
  it('creates a nav link object with uppercase label', () => {
    const link = createNavLink('home', '/index.html');
    expect(link).toEqual({
      label: 'HOME',
      href: '/index.html',
      isActive: false,
    });
  });

  it('trims whitespace from label and href', () => {
    const link = createNavLink('  about  ', '  /about  ');
    expect(link.label).toBe('ABOUT');
    expect(link.href).toBe('/about');
  });

  it('throws for empty label', () => {
    expect(() => createNavLink('', '#')).toThrow('Navigation label is required');
  });

  it('throws for non-string label', () => {
    expect(() => createNavLink(null, '#')).toThrow('Navigation label is required');
  });

  it('throws for empty href', () => {
    expect(() => createNavLink('Home', '')).toThrow('Navigation href is required');
  });

  it('throws for non-string href', () => {
    expect(() => createNavLink('Home', null)).toThrow('Navigation href is required');
  });
});

describe('setActiveNavItem', () => {
  const links = [
    { label: 'HOME', href: '#', isActive: false },
    { label: 'ABOUT', href: '#', isActive: false },
    { label: 'CONTACT', href: '#', isActive: false },
  ];

  it('sets the correct item as active', () => {
    const result = setActiveNavItem(links, 'ABOUT');
    expect(result[0].isActive).toBe(false);
    expect(result[1].isActive).toBe(true);
    expect(result[2].isActive).toBe(false);
  });

  it('is case-insensitive', () => {
    const result = setActiveNavItem(links, 'about');
    expect(result[1].isActive).toBe(true);
  });

  it('returns a new array (no mutation)', () => {
    const result = setActiveNavItem(links, 'HOME');
    expect(result).not.toBe(links);
    expect(links[0].isActive).toBe(false);
  });

  it('sets no items active if label does not match', () => {
    const result = setActiveNavItem(links, 'BLOG');
    result.forEach((link) => {
      expect(link.isActive).toBe(false);
    });
  });

  it('throws if navLinks is not an array', () => {
    expect(() => setActiveNavItem('not-array', 'HOME')).toThrow(
      'navLinks must be an array'
    );
  });
});

describe('buildNavHTML', () => {
  it('builds HTML for nav links', () => {
    const links = [
      { label: 'HOME', href: '#', isActive: true },
      { label: 'ABOUT', href: '#about', isActive: false },
    ];
    const html = buildNavHTML(links);
    expect(html).toContain('<ul>');
    expect(html).toContain('</ul>');
    expect(html).toContain('<li class="active">');
    expect(html).toContain('<a href="#">HOME</a>');
    expect(html).toContain('<a href="#about">ABOUT</a>');
  });

  it('returns empty ul for empty array', () => {
    expect(buildNavHTML([])).toBe('<ul></ul>');
  });

  it('returns empty ul for non-array input', () => {
    expect(buildNavHTML(null)).toBe('<ul></ul>');
    expect(buildNavHTML(undefined)).toBe('<ul></ul>');
  });

  it('does not add active class to inactive items', () => {
    const links = [{ label: 'HOME', href: '#', isActive: false }];
    const html = buildNavHTML(links);
    expect(html).not.toContain('class="active"');
  });
});
