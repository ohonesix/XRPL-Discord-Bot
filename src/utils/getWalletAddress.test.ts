import getWalletAddress from './getWalletAddress';

describe('getWalletAddress util', () => {
  it('should return null if input is null', () => {
    expect(getWalletAddress(null)).toBe(null);
  });

  it('should return null if input does not contain a valid wallet address', () => {
    expect(getWalletAddress('not an address')).toBe(null);
  });

  it('should return the wallet address if it is found in the input', () => {
    expect(
      getWalletAddress('link wallet rnruxxaTbJUMNtFNBJ7X2xSiy1KE7ajUuH')
    ).toBe('rnruxxaTbJUMNtFNBJ7X2xSiy1KE7ajUuH');
    expect(
      getWalletAddress('linkwallet rnruxxaTbJUMNtFNBJ7X2xSiy1KE7ajUuH ')
    ).toBe('rnruxxaTbJUMNtFNBJ7X2xSiy1KE7ajUuH');
  });
});
