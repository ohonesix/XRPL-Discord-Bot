const getUserNameFromAdminLinkWalletCommand = (
  message: string,
  wallet: string
) => {
  if (message === null) {
    return null;
  }

  const username = message
    .replace(wallet, '')
    .replace('adminlinkwallet', '')
    .replace('Adminlinkwallet', '')
    .trim();

  return {
    username: username.split('#')[0],
    tag: username.split('#')[1] ?? '0',
  };
};

export default getUserNameFromAdminLinkWalletCommand;
