const {
  normalizeQuery,
  isEmptyQuery,
  filterItems,
  highlightMatch,
  buildSearchResultsHTML,
} = require('../src/search');

describe('normalizeQuery', () => {
  it('trims and lowercases a query', () => {
    expect(normalizeQuery('  Hello World  ')).toBe('hello world');
  });

  it('returns empty string for empty input', () => {
    expect(normalizeQuery('')).toBe('');
  });

  it('returns empty string for whitespace-only input', () => {
    expect(normalizeQuery('   ')).toBe('');
  });

  it('returns empty string for non-string input', () => {
    expect(normalizeQuery(null)).toBe('');
    expect(normalizeQuery(undefined)).toBe('');
    expect(normalizeQuery(123)).toBe('');
  });
});

describe('isEmptyQuery', () => {
  it('returns true for empty string', () => {
    expect(isEmptyQuery('')).toBe(true);
  });

  it('returns true for whitespace-only string', () => {
    expect(isEmptyQuery('   ')).toBe(true);
  });

  it('returns true for non-string input', () => {
    expect(isEmptyQuery(null)).toBe(true);
    expect(isEmptyQuery(undefined)).toBe(true);
  });

  it('returns false for non-empty query', () => {
    expect(isEmptyQuery('test')).toBe(false);
  });
});

describe('filterItems', () => {
  const items = ['HOME', 'ABOUT', 'SERVICE', 'DESIGN', 'CONTACT'];

  it('returns all items when query is empty', () => {
    expect(filterItems(items, '')).toEqual(items);
  });

  it('filters items matching the query', () => {
    expect(filterItems(items, 'des')).toEqual(['DESIGN']);
  });

  it('is case-insensitive', () => {
    expect(filterItems(items, 'HOME')).toEqual(['HOME']);
    expect(filterItems(items, 'home')).toEqual(['HOME']);
  });

  it('returns empty array when nothing matches', () => {
    expect(filterItems(items, 'xyz')).toEqual([]);
  });

  it('returns empty array for non-array input', () => {
    expect(filterItems(null, 'test')).toEqual([]);
    expect(filterItems('not-array', 'test')).toEqual([]);
  });

  it('filters objects with label property', () => {
    const objectItems = [
      { label: 'Home Page' },
      { label: 'About Us' },
      { label: 'Contact' },
    ];
    expect(filterItems(objectItems, 'about')).toEqual([{ label: 'About Us' }]);
  });

  it('skips items without string or label property', () => {
    const mixed = ['HOME', 42, null, { label: 'ABOUT' }];
    expect(filterItems(mixed, 'o')).toEqual(['HOME', { label: 'ABOUT' }]);
  });

  it('returns copy of items when query is empty (no mutation)', () => {
    const result = filterItems(items, '');
    expect(result).not.toBe(items);
  });
});

describe('highlightMatch', () => {
  it('wraps matching text in <mark> tags', () => {
    expect(highlightMatch('Hello World', 'world')).toBe('Hello <mark>World</mark>');
  });

  it('highlights all occurrences', () => {
    expect(highlightMatch('banana', 'an')).toBe('b<mark>an</mark><mark>an</mark>a');
  });

  it('returns original text when query is empty', () => {
    expect(highlightMatch('Hello', '')).toBe('Hello');
  });

  it('returns empty string for non-string text', () => {
    expect(highlightMatch(null, 'test')).toBe('');
    expect(highlightMatch(undefined, 'test')).toBe('');
  });

  it('returns original text for non-string query', () => {
    expect(highlightMatch('Hello', null)).toBe('Hello');
  });

  it('escapes regex special characters in query', () => {
    expect(highlightMatch('price: $100', '$1')).toBe('price: <mark>$1</mark>00');
  });

  it('is case-insensitive', () => {
    expect(highlightMatch('Hello', 'hello')).toBe('<mark>Hello</mark>');
  });
});

describe('buildSearchResultsHTML', () => {
  it('builds HTML for search results', () => {
    const results = ['Result 1', 'Result 2'];
    const html = buildSearchResultsHTML(results);
    expect(html).toContain('<div class="search-results">');
    expect(html).toContain('<div class="search-result">Result 1</div>');
    expect(html).toContain('<div class="search-result">Result 2</div>');
  });

  it('returns no-results message for empty array', () => {
    const html = buildSearchResultsHTML([]);
    expect(html).toBe('<div class="no-results">No results found</div>');
  });

  it('returns no-results message for non-array input', () => {
    expect(buildSearchResultsHTML(null)).toBe(
      '<div class="no-results">No results found</div>'
    );
  });
});
