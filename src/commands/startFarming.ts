import { Message } from 'discord.js';
import { EventPayload } from '../events/BotEvents';
import SETTINGS from '../settings';
import { getUserByDiscordId } from '../data/getUserByDiscordId';
import getFarmingEarningsMapping from '../utils/getFarmingEarningsMapping';
import { getFarmingProgressByDiscordId } from '../data/getFarmingProgressByDiscordId';
import { updateWalletFarming } from '../data/updateWalletFarming';
import isFarmingEnabled from '../utils/isFarmingEnabled';

const processCommand = async (message: Message) => {
  if (!isFarmingEnabled()) {
    return message.reply('Sorry farming is not currently enabled.');
  }

  // Get user in DB
  const user = await getUserByDiscordId(message.author.id);
  if (user === null || user.wallets.length === 0) {
    return message.reply(
      'Could not find your wallet, please link it first with the "linkwallet" command'
    );
  }

  // Check if they are farming already
  const farmingProgress = await getFarmingProgressByDiscordId(
    message.author.id
  );
  if (farmingProgress !== null) {
    return message.reply(
      `You are farming for ${farmingProgress.rewardGoalAmount} ${SETTINGS.FARMING.EARNINGS_NAME} at ${farmingProgress.hoursFarmed} hours out of ${farmingProgress.rewardGoalHoursRequired} farmed.`
    );
  }

  // Get the highest holdings tier they qualify for (if any)
  const maxEarnable = getFarmingEarningsMapping(user.totalPoints);
  if (maxEarnable === null || maxEarnable.farmable === null) {
    return message.reply(
      "You don't have enough points to earn anything or you don't have a wallet linked. Please link your wallet or wait and try again later."
    );
  }

  // Start farming for this user
  const farmingResult = await updateWalletFarming(
    message.author.id,
    maxEarnable.pointsNeeded,
    maxEarnable.farmable,
    168, // 1 week goal as default
    0, // they start at 0
    true, // active to earn
    new Date().toISOString()
  );

  if (farmingResult !== 0) {
    return message.reply(`Something went wrong, please contact an admin`);
  }

  return message.reply(
    `Started your farming timer for ${maxEarnable.farmable} ${SETTINGS.FARMING.EARNINGS_NAME}!`
  );
};

const startFarming = async (payload: EventPayload) => {
  if (payload.handled) {
    return;
  }

  if (
    payload.messageLowered.includes('startfarming') ||
    payload.messageLowered.includes('start farming') ||
    payload.messageLowered.includes('checkfarming') ||
    payload.messageLowered.includes('check farming')
  ) {
    payload.handled = true;
    return await processCommand(payload.message);
  }
};

export default startFarming;
