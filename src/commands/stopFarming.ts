import { Message } from 'discord.js';
import { EventPayload } from '../events/BotEvents';
import SETTINGS from '../settings';
import { getFarmingProgressByDiscordId } from '../data/getFarmingProgressByDiscordId';
import { deleteWalletFarming } from '../data/deleteWalletFarming';
import isFarmingEnabled from '../utils/isFarmingEnabled';

const processCommand = async (message: Message) => {
  if (!isFarmingEnabled()) {
    return message.reply('Sorry farming is not currently enabled.');
  }

  // Get farming progress
  const farmingProgress = await getFarmingProgressByDiscordId(
    message.author.id
  );
  if (farmingProgress === null) {
    return message.reply('You are not farming for anything.');
  }

  const deleteResult = await deleteWalletFarming(message.author.id);
  if (deleteResult !== 0) {
    return message.reply(
      'Something went wrong trying to delete your farming progress, please contact a mod.'
    );
  }

  return message.reply(
    `Deleted your farming for ${farmingProgress.rewardGoalAmount} ${SETTINGS.FARMING.EARNINGS_NAME} at ${farmingProgress.hoursFarmed} hours farmed.`
  );
};

const stopFarming = async (payload: EventPayload) => {
  if (payload.handled) {
    return;
  }

  if (
    payload.messageLowered.includes('stopfarming') ||
    payload.messageLowered.includes('stop farming')
  ) {
    payload.handled = true;
    return await processCommand(payload.message);
  }
};

export default stopFarming;
