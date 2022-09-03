import isAdmin from '../utils/isAdmin.js';
import getWalletAddress from '../utils/getWalletAddress.js';
import getUserNameFromVerifyWalletCommand from '../utils/getUserNameFromVerifyWalletCommand.js';
import { getUserAccountIdByUsername } from '../integration/discord/getUserAccountIdByUsername.js';
import { getWalletForAddress } from '../data/getWalletForAddress.js';
import { Client, Message } from 'discord.js';

const verifyWallet = async (message: Message, client: Client) => {
  if (!isAdmin(message.author.id)) {
    return message.reply(`Sorry you are not autorised to do that.`);
  }

  // Get address
  const walletAddress = getWalletAddress(message.content);

  if (!walletAddress) {
    // Message for this error is sent in getWalletAddress
    return;
  }

  // Get that stored wallet info
  const linkedWallet = await getWalletForAddress(walletAddress);

  if (!linkedWallet) {
    return message.reply(
      `Could not find wallet ${walletAddress} in our database. Did the user link it?`
    );
  }

  // Get username from message content
  const usernameParsed = getUserNameFromVerifyWalletCommand(
    message.content,
    walletAddress
  );

  // Get Discord userId for that username
  const userAccountId = await getUserAccountIdByUsername(
    usernameParsed.username,
    usernameParsed.tag,
    client
  );

  if (!userAccountId) {
    return message.reply(
      `Could not find user ${usernameParsed.username}#${usernameParsed.tag} in the Discord server.`
    );
  }

  if (linkedWallet.discordId === userAccountId) {
    return message.reply(
      `✅ The wallet ${walletAddress} is linked to ${usernameParsed.username}#${usernameParsed.tag}`
    );
  }

  return message.reply(
    `❌ The wallet ${walletAddress} is NOT linked to ${usernameParsed.username}#${usernameParsed.tag}. It is linked to ${linkedWallet.discordUsername}#${linkedWallet.discordDiscriminator}.`
  );
};

export { verifyWallet };
