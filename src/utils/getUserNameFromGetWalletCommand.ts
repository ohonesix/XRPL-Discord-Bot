const getUserNameFromGetWalletCommand = (message: string) => {
  if (message === null) {
    return null;
  }

  const username = message
    .replace('getwallet', '')
    .replace('Getwallet', '')
    .replace('get wallet', '')
    .replace('Get wallet', '')
    .trim();

  return {
    username: username.split('#')[0],
    tag: username.split('#')[1],
  };
};

export default getUserNameFromGetWalletCommand;
