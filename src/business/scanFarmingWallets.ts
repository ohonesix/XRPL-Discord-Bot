import SETTINGS from '../settings';
import sleep from '../utils/sleep';
import { getFarmingWallets } from '../data/getFarmingWallets';
import { getUserByDiscordId } from '../data/getUserByDiscordId';
import { updateWalletFarming } from '../data/updateWalletFarming';
import { deleteWalletFarming } from '../data/deleteWalletFarming';
import { setWalletEarned } from '../data/setWalletEarned';

import { Client, TextChannel } from 'discord.js';

const scanFarmingWallets = async (
  client: Client,
  LOGGER: any,
  forceRefreshHours: boolean
) => {
  // Get all wallets
  const farmingWallets = await getFarmingWallets();

  let changes = 0;
  let paused = 0;
  for (let i = 0; i < farmingWallets.length; i++) {
    const farmingProgress = farmingWallets[i];
    const farmingUser = await getUserByDiscordId(farmingProgress?.discordId);

    if (!farmingProgress || !farmingUser) {
      continue;
    }

    await sleep(100);

    // Check holdings
    if (farmingUser.totalPoints < farmingProgress.rewardPointsRequired) {
      // They don't have enough anymore, pause their farming.
      paused += 1;
      await updateWalletFarming(
        farmingProgress.discordId,
        farmingProgress.rewardPointsRequired,
        farmingProgress.rewardGoalAmount,
        farmingProgress.rewardGoalHoursRequired,
        farmingProgress.hoursFarmed,
        false, // Pause this wallet farming
        farmingProgress.dateStarted
      );
      continue;
    }

    // All good for this farmer
    changes += 1;
    let hoursFarmed = farmingProgress.hoursFarmed + 1;

    // Check if we have to refresh wallets with enough points to continue farming
    if (forceRefreshHours) {
      // If so, credit them for all hours since date farming started
      // this is for if there are network issues for a long time and we
      // want to be nice to the community users.
      const startedAt = new Date(farmingProgress.dateStarted).getTime();
      const now = new Date().getTime();
      hoursFarmed = Math.floor(Math.abs(now - startedAt) / 36e5);
    }

    // Check if they can claim now and save to other table
    const completed = hoursFarmed >= farmingProgress.rewardGoalHoursRequired;

    if (completed) {
      // Completed farming, save to earned table
      await setWalletEarned(
        farmingProgress.discordId,
        farmingUser.discordUsername,
        farmingUser.discordDiscriminator,
        farmingProgress.rewardGoalAmount,
        hoursFarmed,
        farmingProgress.dateStarted,
        new Date().toISOString()
      );

      // Delete from farmed table
      await deleteWalletFarming(farmingProgress.discordId);

      // Post in payout channel
      const channel = client.channels.cache.get(
        SETTINGS.DISCORD.FARMING_DONE_CHANNEL_ID
      ) as TextChannel;
      if (channel !== null) {
        channel.send(
          `🚨🚜 User finished farming: ${farmingUser.discordUsername}#${farmingUser.discordDiscriminator} with discord id ${farmingUser.discordId} has finished farming for ${farmingProgress.rewardGoalAmount} ${SETTINGS.FARMING.EARNINGS_NAME} with ${hoursFarmed} hours.`
        );
      }

      // DM user
      const walletUser = client.users.cache.get(farmingUser.discordId);

      if (walletUser) {
        await walletUser.send(
          `Congratulations! You have finished farming for ${farmingProgress.rewardGoalAmount} ${SETTINGS.FARMING.EARNINGS_NAME} at ${hoursFarmed} hours!`
        );
      }
    } else {
      // Didn't complete yet, save progress so far.
      await updateWalletFarming(
        farmingProgress.discordId,
        farmingProgress.rewardPointsRequired,
        farmingProgress.rewardGoalAmount,
        farmingProgress.rewardGoalHoursRequired,
        hoursFarmed,
        true,
        farmingProgress.dateStarted
      );
    }
  }

  if (LOGGER !== null) {
    LOGGER.trackMetric({ name: 'scanFarmers-changes', value: changes });
  }

  return `All done for ${farmingWallets.length} farmers with ${changes} changes and ${paused} paused`;
};

export { scanFarmingWallets };
