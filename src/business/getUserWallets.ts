import { Client, Message } from 'discord.js';
import isAdmin from '../utils/isAdmin.js';
import truncate from '../utils/truncate.js';
import getWalletAddress from '../utils/getWalletAddress.js';
import getUserNameFromGetWalletCommand from '../utils/getUserNameFromGetWalletCommand.js';
import { getWalletsForUser } from '../data/getWalletsForUser.js';
import { getUserAccountIdByUsername } from '../integration/discord/getUserAccountIdByUsername.js';
import { getWalletForAddress } from '../data/getWalletForAddress.js';

const getUserWallets = async (message: Message, client: Client) => {
  if (!isAdmin(message.author.id)) {
    return message.reply(`Sorry you are not autorised to do that.`);
  }

  let userDiscordName = '';
  let userDiscordTag = '';

  // Check if we are using the "get by address method"
  const walletAddress = getWalletAddress(message.content);
  if (walletAddress && walletAddress?.length > 5) {
    const linkedWallet = await getWalletForAddress(walletAddress);

    if (!linkedWallet?.discordUsername && !linkedWallet?.discordDiscriminator) {
      return message.reply(`Could not get a user linked to ${walletAddress}`);
    }

    userDiscordName = linkedWallet.discordUsername;
    userDiscordTag = linkedWallet.discordDiscriminator;
  } else {
    // If not it's "get by username"
    const usernameParsed = getUserNameFromGetWalletCommand(message.content);
    userDiscordName = usernameParsed?.username;
    userDiscordTag = usernameParsed?.tag;
  }

  const users = await getWalletsForUser(userDiscordName, userDiscordTag);

  if (!users || users?.length === 0) {
    return message.reply(
      `No stored users for ${userDiscordName}#${userDiscordTag}, ask them to link their wallet first`
    );
  }

  // Ensure the tag references the same stored account ID to prevent name change scamming
  const usernameDiscordId = await getUserAccountIdByUsername(
    userDiscordName,
    userDiscordTag,
    client
  );

  if (users.filter((user) => user.discordId !== usernameDiscordId).length > 0) {
    return message.reply(
      `⚠ Something weird going on here! The stored wallet details we have don't match the current Discord user ID for ${userDiscordName}#${userDiscordTag}. Proceed with caution`
    );
  }

  let result = `Wallet(s) for ${userDiscordName}#${userDiscordTag}:`;

  users.forEach((user) => {
    user.wallets.forEach((wallet) => {
      result += `\n   ${truncate(wallet.points ?? 0, 2)}\t -> \t${
        wallet.address
      }`;
    });

    if (user?.previousDiscordUsername) {
      result += `\t\t Previous Username: ${user.previousDiscordUsername}#${user.previousDiscordDiscriminator}`;
    }
  });

  return message.reply(result);
};

export { getUserWallets };
