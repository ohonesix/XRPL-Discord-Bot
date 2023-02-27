import truncate from './truncate';

describe('truncate util', () => {
  it('should truncate the input to the specified number of decimal places', () => {
    expect(truncate(123.456, 0)).toBe(123);
    expect(truncate(123.456, 1)).toBe(123.4);
    expect(truncate(123.456, 2)).toBe(123.45);
    expect(truncate(123.456, 3)).toBe(123.456);
  });
});
