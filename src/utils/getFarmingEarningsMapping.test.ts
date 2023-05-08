import getFarmingEarningsMapping from './getFarmingEarningsMapping';

describe('getFarmingEarningsMapping util', () => {
  it('should return null if points is null', () => {
    expect(getFarmingEarningsMapping(null).farmable).toBe(null);
  });

  it('should return 0.1 if points is 1', () => {
    expect(getFarmingEarningsMapping(1).farmable).toBe(0.1);
  });

  it('should return 1 if points is 5', () => {
    expect(getFarmingEarningsMapping(5.5).farmable).toBe(1);
  });

  it('should return 5 if points is greater than 15', () => {
    expect(getFarmingEarningsMapping(99.99).farmable).toBe(5);
  });
});
