import { getTopHolders } from '../data/getTopHolders';
import truncate from '../utils/truncate';
import { EventPayload } from '../events/BotEvents';

const processCommand = async (): Promise<string> => {
  const topHolders = await getTopHolders();

  let result = 'Top 10 community holders:';

  topHolders?.forEach((holder) => {
    result += `\n   ${truncate(holder.totalPoints ?? 0, 0)}\t\t->\t\t${
      holder.discordUsername
    }#${holder.discordDiscriminator}`;
  });

  return result;
};

const richlist = async (payload: EventPayload) => {
  if (payload.handled) {
    return;
  }

  if (payload.interaction.commandName === 'richlist') {
    payload.handled = true;

    await payload.interaction.reply({
      content: await processCommand(),
    });
    return;
  }
};

export default richlist;
