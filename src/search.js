/**
 * Search functionality for the search bar.
 */

function normalizeQuery(query) {
  if (typeof query !== 'string') {
    return '';
  }
  return query.trim().toLowerCase();
}

function isEmptyQuery(query) {
  return normalizeQuery(query) === '';
}

function filterItems(items, query) {
  if (!Array.isArray(items)) {
    return [];
  }
  const normalized = normalizeQuery(query);
  if (normalized === '') {
    return [...items];
  }
  return items.filter((item) => {
    if (typeof item === 'string') {
      return item.toLowerCase().includes(normalized);
    }
    if (item && typeof item.label === 'string') {
      return item.label.toLowerCase().includes(normalized);
    }
    return false;
  });
}

function highlightMatch(text, query) {
  if (typeof text !== 'string' || typeof query !== 'string') {
    return text || '';
  }
  const normalized = normalizeQuery(query);
  if (normalized === '') {
    return text;
  }
  const regex = new RegExp(`(${normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function buildSearchResultsHTML(results) {
  if (!Array.isArray(results) || results.length === 0) {
    return '<div class="no-results">No results found</div>';
  }
  const items = results
    .map((result) => `<div class="search-result">${result}</div>`)
    .join('');
  return `<div class="search-results">${items}</div>`;
}

module.exports = {
  normalizeQuery,
  isEmptyQuery,
  filterItems,
  highlightMatch,
  buildSearchResultsHTML,
};
