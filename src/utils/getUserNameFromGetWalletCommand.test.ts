import getUserNameFromGetWalletCommand from './getUserNameFromGetWalletCommand';

describe('getUserNameFromGetWalletCommand util', () => {
  it('should return null if message is null', () => {
    expect(getUserNameFromGetWalletCommand(null)).toBe(null);
  });

  it('should return an object with username and tag properties', () => {
    expect(getUserNameFromGetWalletCommand('getwallet user#1234')).toEqual({
      username: 'user',
      tag: '1234',
    });
    expect(getUserNameFromGetWalletCommand('Getwallet user#1234')).toEqual({
      username: 'user',
      tag: '1234',
    });
    expect(getUserNameFromGetWalletCommand('get wallet user#1234')).toEqual({
      username: 'user',
      tag: '1234',
    });
    expect(getUserNameFromGetWalletCommand('Get wallet user#1234')).toEqual({
      username: 'user',
      tag: '1234',
    });
  });
  it('should return an object with username with new format', () => {
    expect(getUserNameFromGetWalletCommand('getwallet user')).toEqual({
      username: 'user',
      tag: '0',
    });
    expect(getUserNameFromGetWalletCommand('Getwallet user')).toEqual({
      username: 'user',
      tag: '0',
    });
    expect(getUserNameFromGetWalletCommand('get wallet user')).toEqual({
      username: 'user',
      tag: '0',
    });
    expect(getUserNameFromGetWalletCommand('Get wallet user')).toEqual({
      username: 'user',
      tag: '0',
    });
  });
});
