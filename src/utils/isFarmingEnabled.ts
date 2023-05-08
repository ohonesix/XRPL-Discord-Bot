import SETTINGS from '../settings';

// This is here to help with testing as we can then mock its return value directly
const isFarmingEnabled = () => {
  return SETTINGS.FARMING.ENABLED;
};

export default isFarmingEnabled;
