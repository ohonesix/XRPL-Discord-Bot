import isAdmin from './isAdmin';

jest.mock('../settings', () => ({
  DISCORD: {
    ADMIN_IDS: ['123'],
  },
}));

describe('isAdmin util', () => {
  it('should return false if userId is null', () => {
    expect(isAdmin(null)).toBe(false);
  });

  it('should return true if userId is found in DISCORD.ADMIN_IDS', () => {
    expect(isAdmin('123')).toBe(true);
  });

  it('should return false if userId is not found in DISCORD.ADMIN_IDS', () => {
    expect(isAdmin('456')).toBe(false);
  });
});
