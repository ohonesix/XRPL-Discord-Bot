import sleep from '../utils/sleep.js';
import { getWallets } from '../data/getWallets.js';
import { updateUserAccount } from '../data/updateUserAccount.js';
import { getUserAccountById } from '../integration/discord/getUserAccountById.js';
import { Client } from 'discord.js';

const scanLinkedAccounts = async (client: Client, LOGGER: any) => {
  // Get all wallets
  const linkedWallets = await getWallets();

  let changes = 0;
  let usersMissing = 0;
  for (let index = 0; index < linkedWallets.length; index++) {
    await sleep(100);

    const storedLinkedWallet = linkedWallets[index];

    // Get user Discord account
    const userAccount = await getUserAccountById(
      storedLinkedWallet.discordId,
      client
    );

    // User might have left the server, nothing to do then
    if (!userAccount?.user?.username) {
      usersMissing = usersMissing + 1;

      continue;
    }

    // Update Mongo if changes to username/tag
    if (
      storedLinkedWallet.discordUsername !== userAccount.user.username ||
      storedLinkedWallet.discordDiscriminator !== userAccount.user.discriminator
    ) {
      changes = changes + 1;

      // Store update in Mongo
      const updateResult = await updateUserAccount(
        storedLinkedWallet.address,
        storedLinkedWallet.discordId,
        storedLinkedWallet.discordUsername,
        storedLinkedWallet.discordDiscriminator,
        userAccount.user.username,
        userAccount.user.discriminator
      );

      // Track issues with saving
      if (updateResult !== 0 && LOGGER !== null) {
        LOGGER.trackException({
          exception: new Error(
            `Something went wrong updating ${storedLinkedWallet.address} name change from ${storedLinkedWallet.discordUsername} to ${userAccount.user.username}`
          ),
        });
      }
    }
  }

  if (LOGGER !== null) {
    LOGGER.trackMetric({ name: 'scanLinkedWallets-changes', value: changes });
    LOGGER.trackMetric({
      name: 'scanLinkedWallets-UserId-missing',
      value: usersMissing,
    });
  }
  return `All done for ${linkedWallets.length} wallets with ${changes} changes and ${usersMissing} missing`;
};

export { scanLinkedAccounts };
