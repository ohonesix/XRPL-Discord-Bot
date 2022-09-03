const getRole = (input: string) => {
  if (input === null) {
    return null;
  }

  return input.substring(9).trim();
};

export default getRole;
