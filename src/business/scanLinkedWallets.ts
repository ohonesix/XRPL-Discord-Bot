import sleep from '../utils/sleep.js';
import { getAllUsers } from '../data/getAllUsers.js';
import { getWalletHoldings } from '../integration/xrpl/getWalletHoldings.js';
import { updateUser } from '../data/updateUser.js';
import { updateUserRoles } from '../integration/discord/updateUserRoles.js';
import { Client } from 'discord.js';

// Scans user wallets and updates their roles
const scanLinkedWallets = async (
  client: Client,
  LOGGER: any,
  forceRefreshRoles: boolean,
  forceUpsertRoles: boolean
) => {
  // Get all wallets
  const allUsers = await getAllUsers();

  let changes = 0;
  let walletIssues = 0;
  for (let index = 0; index < allUsers.length; index++) {
    await sleep(500);

    const storedUser = allUsers[index] as IBotUser;

    let updatedHoldings = 0;
    let requeue = false;

    // Check all their wallets
    if (storedUser.wallets?.length > 0) {
      for (const wallet of storedUser.wallets) {
        // Get updated holdings
        const currentWalletHoldings = await getWalletHoldings(
          wallet.address,
          LOGGER
        );

        // Rate limited, requeue user for later
        if (currentWalletHoldings === null || currentWalletHoldings === -1) {
          await sleep(1000);
          allUsers.push(storedUser);
          requeue = true;
          break;
        }

        // Update our running total
        updatedHoldings += currentWalletHoldings;
        // And the wallet to be stored
        wallet.points = currentWalletHoldings;
      }
    }

    // Check if we need to redo this user
    if (requeue) {
      walletIssues += 1;
      continue;
    }

    // Check if there was a change in holdings
    if (
      storedUser.totalPoints === updatedHoldings &&
      !forceRefreshRoles &&
      !forceUpsertRoles
    ) {
      continue;
    }

    // We've got a change to make
    changes = changes + 1;

    // Update server role based on new holdings
    await updateUserRoles(
      storedUser.totalPoints,
      updatedHoldings,
      storedUser.discordId,
      client,
      LOGGER,
      forceRefreshRoles
    );

    // Store update in Mongo
    storedUser.totalPoints = updatedHoldings;
    const updateResult = await updateUser(storedUser);

    // Track issues with saving
    if (updateResult !== 0) {
      console.log(
        `Something went wrong updating ${storedUser.discordId} with ${updatedHoldings} for ${storedUser.discordUsername}`
      );
      if (LOGGER !== null) {
        LOGGER.trackException({
          exception: new Error(
            `Something went wrong updating ${storedUser.discordId} with ${updatedHoldings} for ${storedUser.discordUsername}`
          ),
        });
      }
    }
  }

  if (LOGGER !== null) {
    LOGGER.trackMetric({
      name: 'scanLinkedWallets-count-total',
      value: allUsers.length,
    });
    LOGGER.trackMetric({ name: 'scanLinkedWallets-changes', value: changes });
    LOGGER.trackMetric({
      name: 'scanLinkedWallets-errors',
      value: walletIssues,
    });
  }
  return `All done for ${allUsers.length} wallets with ${changes} changes`;
};

export { scanLinkedWallets };
