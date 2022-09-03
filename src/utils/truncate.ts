const truncate = (input: number, places: number) => {
  return Math.trunc(input * Math.pow(10, places)) / Math.pow(10, places);
};

export default truncate;
