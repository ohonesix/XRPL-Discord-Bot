import { Client, Message } from 'discord.js';
import isAdmin from '../utils/isAdmin';
import truncate from '../utils/truncate';
import getUserNameFromGetWalletCommand from '../utils/getUserNameFromGetWalletCommand';
import { getWalletsForUser } from '../data/getWalletsForUser';
import { getUserAccountIdByUsername } from '../integration/discord/getUserAccountIdByUsername';
import { EventPayload } from '../events/BotEvents';

const processCommand = async (message: Message, client: Client) => {
  if (!isAdmin(message.author.id)) {
    return message.reply(`Sorry you are not authorised to do that.`);
  }

  const usernameParsed = getUserNameFromGetWalletCommand(message.content);
  const userDiscordName = usernameParsed?.username;
  const userDiscordTag = usernameParsed?.tag;

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

const getWallet = async (payload: EventPayload) => {
  if (payload.handled) {
    return;
  }

  if (
    payload.messageLowered.includes('get wallet') ||
    payload.messageLowered.includes('getwallet')
  ) {
    payload.handled = true;
    return await processCommand(payload.message, payload.client);
  }
};

export default getWallet;
