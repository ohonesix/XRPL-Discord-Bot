import getRole from './getRole';

describe('getRole util', () => {
  it('should return null if message is null', () => {
    expect(getRole(null)).toBe(null);
  });

  it('should return the role from the message', () => {
    expect(getRole('getroleusers admins')).toEqual('admins');
    expect(getRole('get role users admins')).toEqual('admins');
  });
});
