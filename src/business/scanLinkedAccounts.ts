import sleep from '../utils/sleep';
import { getAllUsers } from '../data/getAllUsers';
import { updateUserAccount } from '../data/updateUserAccount';
import { getUserAccountById } from '../integration/discord/getUserAccountById';
import { Client } from 'discord.js';

// Tracks users changing their Discord username
const scanLinkedAccounts = async (client: Client, LOGGER: any) => {
  // Get all wallets
  const allUsers = await getAllUsers();

  let changes = 0;
  let usersMissing = 0;
  for (let index = 0; index < allUsers.length; index++) {
    await sleep(100);

    const storedUser = allUsers[index];

    // Get user Discord account
    const userAccount = await getUserAccountById(storedUser.discordId, client);

    // User might have left the server, nothing to do then
    if (!userAccount?.user?.username) {
      usersMissing = usersMissing + 1;

      continue;
    }

    // Update Mongo if changes to username/tag
    if (
      storedUser.discordUsername !== userAccount.user.username ||
      storedUser.discordDiscriminator !== userAccount.user.discriminator
    ) {
      changes = changes + 1;

      // Store update in Mongo
      const updateResult = await updateUserAccount(
        storedUser.discordId,
        storedUser.discordUsername,
        storedUser.discordDiscriminator,
        userAccount.user.username,
        userAccount.user.discriminator
      );

      // Track issues with saving
      if (updateResult !== 0 && LOGGER !== null) {
        LOGGER.trackException({
          exception: new Error(
            `Something went wrong updating id ${storedUser.discordId} name change from ${storedUser.discordUsername} to ${userAccount.user.username}`
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
  return `All done for ${allUsers.length} users with ${changes} changes and ${usersMissing} missing`;
};

export { scanLinkedAccounts };
