const getRole = (message: string) => {
  if (message === null) {
    return null;
  }

  const role = message
    .replace('getroleusers', '')
    .replace('get role users', '')
    .trim();
  return role;
};

export default getRole;
