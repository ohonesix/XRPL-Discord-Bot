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

  const wallets = await getWalletsForUser(userDiscordName, userDiscordTag);

  if (!wallets || wallets?.length === 0) {
    return message.reply(
      `No stored wallet for ${userDiscordName}#${userDiscordTag}, ask them to link their wallet first`
    );
  }

  // Ensure the tag references the same stored account ID to prevent name change scamming
  const usernameDiscordId = await getUserAccountIdByUsername(
    userDiscordName,
    userDiscordTag,
    client
  );

  if (wallets.includes((entry: any) => entry.discordId !== usernameDiscordId)) {
    return message.reply(
      `⚠ Something weird going on here! The stored wallet details we have don't match the current Discord user ID for ${userDiscordName}#${userDiscordTag}. Proceed with caution`
    );
  }

  let result = `Wallet(s) for ${userDiscordName}#${userDiscordTag}:`;

  wallets.forEach((wallet) => {
    result += `\n   ${truncate(wallet.amount ?? 0, 2)}\t -> \t${
      wallet.address
    }`;

    if (wallet?.previousDiscordUsername) {
      result += `\t\t Previous Username: ${wallet.previousDiscordUsername}#${wallet.previousDiscordDiscriminator}`;
    }
  });

  return message.reply(result);
};

export { getUserWallets };
