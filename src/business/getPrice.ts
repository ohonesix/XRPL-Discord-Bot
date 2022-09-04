import { getTradingDetails } from '../integration/sologenic/getTradingDetails.js';
import truncate from '../utils/truncate.js';
import SETTINGS from '../settings.js';

const getPrice = async (): Promise<string> => {
  const details = await getTradingDetails(SETTINGS.SOLOGENIC.FORMATTED_TOKEN);

  if (!details || !details.price || !details.volume) {
    return `Something went wrong getting the details from Sologenic, try 👉 https://sologenic.org/trade?market=${SETTINGS.SOLOGENIC.FORMATTED_TOKEN}&network=mainnet`;
  }

  return `Last traded price: ${truncate(
    details.price,
    2
  )} XRP (volume past 24 hours: ${truncate(details.volume, 2)})`;
};

export { getPrice };
