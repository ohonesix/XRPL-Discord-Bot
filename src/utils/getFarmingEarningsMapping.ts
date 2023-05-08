import SETTINGS from '../settings';

const getFarmingEarningsMapping = (userPoints: number): any => {
  let farmable: number = null;
  let pointsNeeded: number = null;

  for (const mapping of Object.entries(SETTINGS.FARMING.EARNINGS_MAPPING)) {
    if (userPoints && userPoints >= parseInt(mapping[0], 10)) {
      farmable = mapping[1];
      pointsNeeded = parseInt(mapping[0], 10);
    }
  }

  return { farmable, pointsNeeded };
};

export default getFarmingEarningsMapping;
