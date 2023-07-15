import getUserNameFromAdminLinkWalletCommand from './getUserNameFromAdminLinkWalletCommand';

describe('getUserNameFromAdminLinkWalletCommand util', () => {
  it('should return null if message is null', () => {
    expect(getUserNameFromAdminLinkWalletCommand(null, '0x1234')).toBe(null);
  });

  it('should return an object with username and tag properties', () => {
    expect(
      getUserNameFromAdminLinkWalletCommand(
        'adminlinkwallet rnruxxaTbJUMNtFNBJ7X2xSiy1KE7ajUuH user#1234',
        'rnruxxaTbJUMNtFNBJ7X2xSiy1KE7ajUuH'
      )
    ).toEqual({ username: 'user', tag: '1234' });
    expect(
      getUserNameFromAdminLinkWalletCommand(
        'Adminlinkwallet  user#1234 rnruxxaTbJUMNtFNBJ7X2xSiy1KE7ajUuH',
        'rnruxxaTbJUMNtFNBJ7X2xSiy1KE7ajUuH'
      )
    ).toEqual({ username: 'user', tag: '1234' });
  });
  it('should return an object with username and tag with new format', () => {
    expect(
      getUserNameFromAdminLinkWalletCommand(
        'adminlinkwallet rnruxxaTbJUMNtFNBJ7X2xSiy1KE7ajUuH user',
        'rnruxxaTbJUMNtFNBJ7X2xSiy1KE7ajUuH'
      )
    ).toEqual({ username: 'user', tag: '0' });
  });
});
