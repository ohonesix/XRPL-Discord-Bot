const getUserNameFromVerifyWalletCommand = (
  message: string,
  wallet: string
) => {
  if (message === null) {
    return null;
  }

  const username = message
    .replace('verifywallet', '')
    .replace('Verifywallet', '')
    .replace('verify wallet', '')
    .replace('Verify wallet', '')
    .replace(wallet, '')
    .trim();

  return {
    username: username.split('#')[0],
    tag: username.split('#')[1],
  };
};

export default getUserNameFromVerifyWalletCommand;
