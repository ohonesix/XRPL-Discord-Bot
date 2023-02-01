import { Client, Message } from 'discord.js';
import isAdmin from '../utils/isAdmin';
import getWalletAddress from '../utils/getWalletAddress';
import { getUsersForWallet } from '../data/getUsersForWallet';
import { EventPayload } from '../events/BotEvents';

const processCommand = async (message: Message, client: Client) => {
  if (!isAdmin(message.author.id)) {
    return message.reply(`Sorry you are not autorised to do that.`);
  }

  const walletAddress = getWalletAddress(message.content);
  if (!walletAddress || walletAddress?.length < 5) {
    return message.reply(
      `Could not parse user wallet address, use format getuser WALLETADDRESSHERE`
    );
  }

  const users = await getUsersForWallet(walletAddress);

  if (!users || users?.length === 0) {
    return message.reply(
      `No stored users for ${walletAddress}, ask them to link their wallet first`
    );
  }

  let result = `Users(s) for ${walletAddress}:`;

  users.forEach((user) => {
    result += `\n  ${user.discordUsername}#${user.discordDiscriminator}`;

    if (user?.previousDiscordUsername) {
      result += `\t\t Previous Username: ${user.previousDiscordUsername}#${user.previousDiscordDiscriminator}`;
    }
  });

  return message.reply(result);
};

const getUser = async (payload: EventPayload) => {
  if (payload.handled) {
    return;
  }

  if (
    payload.messageLowered.includes('get user') ||
    payload.messageLowered.includes('getuser')
  ) {
    payload.handled = true;
    return await processCommand(payload.message, payload.client);
  }
};

export default getUser;
