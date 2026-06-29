const {
  isValidEmail,
  isValidPassword,
  validateLoginForm,
  sanitizeInput,
} = require('../src/validation');

describe('isValidEmail', () => {
  it('accepts a standard email address', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  it('accepts email with subdomain', () => {
    expect(isValidEmail('user@mail.example.co.uk')).toBe(true);
  });

  it('accepts email with plus addressing', () => {
    expect(isValidEmail('user+tag@example.com')).toBe(true);
  });

  it('rejects empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });

  it('rejects whitespace-only string', () => {
    expect(isValidEmail('   ')).toBe(false);
  });

  it('rejects null', () => {
    expect(isValidEmail(null)).toBe(false);
  });

  it('rejects undefined', () => {
    expect(isValidEmail(undefined)).toBe(false);
  });

  it('rejects number', () => {
    expect(isValidEmail(12345)).toBe(false);
  });

  it('rejects email without @', () => {
    expect(isValidEmail('userexample.com')).toBe(false);
  });

  it('rejects email without domain', () => {
    expect(isValidEmail('user@')).toBe(false);
  });

  it('rejects email without local part', () => {
    expect(isValidEmail('@example.com')).toBe(false);
  });

  it('rejects email with spaces', () => {
    expect(isValidEmail('user @example.com')).toBe(false);
  });

  it('trims surrounding whitespace before validating', () => {
    expect(isValidEmail('  user@example.com  ')).toBe(true);
  });
});

describe('isValidPassword', () => {
  it('accepts password with 6 characters', () => {
    expect(isValidPassword('abc123')).toBe(true);
  });

  it('accepts long passwords', () => {
    expect(isValidPassword('a'.repeat(100))).toBe(true);
  });

  it('rejects password shorter than 6 characters', () => {
    expect(isValidPassword('abc')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidPassword('')).toBe(false);
  });

  it('rejects null', () => {
    expect(isValidPassword(null)).toBe(false);
  });

  it('rejects undefined', () => {
    expect(isValidPassword(undefined)).toBe(false);
  });

  it('rejects number', () => {
    expect(isValidPassword(123456)).toBe(false);
  });
});

describe('validateLoginForm', () => {
  it('returns valid for correct email and password', () => {
    const result = validateLoginForm('user@example.com', 'password123');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('returns error for missing email', () => {
    const result = validateLoginForm('', 'password123');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Email is required');
  });

  it('returns error for null email', () => {
    const result = validateLoginForm(null, 'password123');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Email is required');
  });

  it('returns error for invalid email format', () => {
    const result = validateLoginForm('not-an-email', 'password123');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Please enter a valid email address');
  });

  it('returns error for missing password', () => {
    const result = validateLoginForm('user@example.com', '');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password is required');
  });

  it('returns error for null password', () => {
    const result = validateLoginForm('user@example.com', null);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password is required');
  });

  it('returns error for short password', () => {
    const result = validateLoginForm('user@example.com', 'abc');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 6 characters');
  });

  it('returns multiple errors when both fields are invalid', () => {
    const result = validateLoginForm('', '');
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(2);
  });
});

describe('sanitizeInput', () => {
  it('escapes ampersands', () => {
    expect(sanitizeInput('a & b')).toBe('a &amp; b');
  });

  it('escapes less-than signs', () => {
    expect(sanitizeInput('<script>')).toBe('&lt;script&gt;');
  });

  it('escapes greater-than signs', () => {
    expect(sanitizeInput('a > b')).toBe('a &gt; b');
  });

  it('escapes double quotes', () => {
    expect(sanitizeInput('"hello"')).toBe('&quot;hello&quot;');
  });

  it('escapes single quotes', () => {
    expect(sanitizeInput("it's")).toBe('it&#x27;s');
  });

  it('returns empty string for non-string input', () => {
    expect(sanitizeInput(null)).toBe('');
    expect(sanitizeInput(undefined)).toBe('');
    expect(sanitizeInput(123)).toBe('');
  });

  it('handles empty string', () => {
    expect(sanitizeInput('')).toBe('');
  });

  it('passes through safe strings unchanged', () => {
    expect(sanitizeInput('hello world')).toBe('hello world');
  });

  it('handles multiple special characters', () => {
    expect(sanitizeInput('<div class="test">&</div>')).toBe(
      '&lt;div class=&quot;test&quot;&gt;&amp;&lt;/div&gt;'
    );
  });
});
