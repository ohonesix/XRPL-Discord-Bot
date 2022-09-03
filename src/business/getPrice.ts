import { getTradingDetails } from '../integration/sologenic/getTradingDetails.js';
import truncate from '../utils/truncate.js';

const SOLOGENIC_API_INPUT_OUTPUT_FORMAT = 'todo';

const getPrice = async (): Promise<string> => {
  const details = await getTradingDetails(SOLOGENIC_API_INPUT_OUTPUT_FORMAT);

  if (!details || !details.price || !details.volume) {
    return `Something went wrong getting the details from Sologenic, try 👉 https://sologenic.org/trade?market=${SOLOGENIC_API_INPUT_OUTPUT_FORMAT}&network=mainnet`;
  }

  return `Last traded price: ${truncate(
    details.price,
    2
  )} XRP (volume past 24 hours: ${truncate(details.volume, 2)})`;
};

export { getPrice };
