const getWalletAddress = (input: string) => {
  if (input === null) {
    return null;
  }

  const addressMatch = /r[^0OIl\s]{24,34}\b/;
  const address = addressMatch.exec(input);
  if (address === null || address[0] === null) {
    return null;
  }

  return address[0].trim();
};

export default getWalletAddress;
