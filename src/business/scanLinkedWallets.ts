import sleep from '../utils/sleep.js';
import { getWallets } from '../data/getWallets.js';
import { getWalletHoldings } from '../integration/xrpl/getWalletHoldings.js';
import { updateUserWallet } from '../data/updateUserWallet.js';
import { updateUserRoles } from '../integration/discord/updateUserRoles.js';
import { Client } from 'discord.js';

const scanLinkedWallets = async (
  client: Client,
  LOGGER: any,
  forceRefreshRoles: boolean,
  forceUpsertRoles: boolean
) => {
  // Get all wallets
  const linkedWallets = await getWallets();

  let changes = 0;
  let walletIssues = 0;
  for (let index = 0; index < linkedWallets.length; index++) {
    await sleep(500);

    const storedLinkedWallet = linkedWallets[index];

    // Get updated holdings
    const updatedHoldings = await getWalletHoldings(
      storedLinkedWallet.address,
      LOGGER
    );

    // Rate limited, requeue for later
    if (updatedHoldings === null || updatedHoldings === -1) {
      await sleep(1000);
      linkedWallets.push(storedLinkedWallet);
      continue;
    }

    // Check if something went wrong
    // Error with network or no holdings
    if (updatedHoldings === null || updatedHoldings === -1) {
      walletIssues = walletIssues + 1;
      continue;
    }

    // Check if there was a change in holdings
    if (
      storedLinkedWallet.amount === updatedHoldings &&
      !forceRefreshRoles &&
      !forceUpsertRoles
    ) {
      continue;
    }
    changes = changes + 1;

    // Update server role based on new holdings
    await updateUserRoles(
      storedLinkedWallet.amount,
      updatedHoldings,
      storedLinkedWallet.discordId,
      client,
      forceRefreshRoles
    );

    // Store update in Mongo
    // const updateResult = await updateUserWallet(
    //   storedLinkedWallet.address,
    //   updatedHoldings,
    //   storedLinkedWallet.discordId,
    //   storedLinkedWallet.discordUsername,
    //   storedLinkedWallet.discordDiscriminator,
    //   storedLinkedWallet.verified,
    //   true
    // );

    // // Track issues with saving
    // if (updateResult !== 0) {
    //   console.log(
    //     `Something went wrong updating ${storedLinkedWallet.address} with ${updatedHoldings} for ${storedLinkedWallet.discordUsername}`
    //   );
    //   if (LOGGER !== null) {
    //     LOGGER.trackException({
    //       exception: new Error(
    //         `Something went wrong updating ${storedLinkedWallet.address} with ${updatedHoldings} for ${storedLinkedWallet.discordUsername}`
    //       ),
    //     });
    //   }
    // }
  }

  if (LOGGER !== null) {
    LOGGER.trackMetric({
      name: 'scanLinkedWallets-count-total',
      value: linkedWallets.length,
    });
    LOGGER.trackMetric({ name: 'scanLinkedWallets-changes', value: changes });
    LOGGER.trackMetric({
      name: 'scanLinkedWallets-errors',
      value: walletIssues,
    });
  }
  return `All done for ${linkedWallets.length} wallets with ${changes} changes`;
};

export { scanLinkedWallets };
