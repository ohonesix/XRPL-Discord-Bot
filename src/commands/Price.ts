import { getTradingDetails } from '../integration/sologenic/getTradingDetails';
import truncate from '../utils/truncate';
import SETTINGS from '../settings';
import { EventPayload } from '../events/BotEvents';

const processCommand = async (): Promise<string> => {
  const details = await getTradingDetails(SETTINGS.SOLOGENIC.FORMATTED_TOKEN);

  if (!details || !details.price || !details.volume) {
    return `Something went wrong getting the details from Sologenic, try 👉 https://sologenic.org/trade?market=${SETTINGS.SOLOGENIC.FORMATTED_TOKEN}&network=mainnet`;
  }

  return `Last traded price: ${truncate(
    details.price,
    2
  )} XRP (volume past 24 hours: ${truncate(details.volume, 2)})`;
};

const price = async (payload: EventPayload) => {
  if (payload.handled) {
    return;
  }

  if (payload.interaction.commandName === 'price') {
    payload.handled = true;

    await payload.interaction.reply({
      content: await processCommand(),
    });
    return;
  }
};

export default price;
