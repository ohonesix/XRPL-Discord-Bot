import getWalletAddress from '../utils/getWalletAddress';
import getUserNameFromAdminLinkWalletCommand from '../utils/getUserNameFromAdminLinkWalletCommand';
import isAdmin from '../utils/isAdmin';
import { getWalletHoldings } from '../integration/xrpl/getWalletHoldings';
import { getUserAccountIdByUsername } from '../integration/discord/getUserAccountIdByUsername';
import { updateUserWallet } from '../data/updateUserWallet';
import { updateUserRoles } from '../integration/discord/updateUserRoles';
import { EventPayload } from '../events/BotEvents';
import { Client, Message } from 'discord.js';

const processCommand = async (message: Message, client: Client) => {
  if (!isAdmin(message.author.id)) {
    return message.reply(`Sorry you are not autorised to do that.`);
  }

  // Get address
  const walletAddress = getWalletAddress(message.content);

  if (!walletAddress) {
    return message.reply(
      `Could not get their wallet address, please check the format and try again for example 'linkwallet WALLETADDRESSHERE'`
    );
  }

  const holdings = await getWalletHoldings(walletAddress, null);

  // Get user details
  const messageParsed = getUserNameFromAdminLinkWalletCommand(
    message.content,
    walletAddress
  );
  const userAccountId = await getUserAccountIdByUsername(
    messageParsed.username,
    messageParsed.tag,
    client
  );

  const newWallet: IWallet = {
    address: walletAddress,
    points: holdings,
    verified: false,
  };

  const newUser: IBotUser = {
    discordId: userAccountId,
    discordUsername: messageParsed.username,
    discordDiscriminator: messageParsed.tag,
    previousDiscordUsername: '',
    previousDiscordDiscriminator: '',
    totalPoints: holdings,
    wallets: [],
  };

  // Save in Mongo
  const mongoUpdateResult = await updateUserWallet(newUser, newWallet, false);

  // Set role
  await updateUserRoles(0, holdings, userAccountId, client, null, false);

  // Send confirmation to the user
  return message.reply(`I see their ${holdings} points admin! Linked 🚀`);
};

const adminLinkWallet = async (payload: EventPayload) => {
  if (payload.handled) {
    return;
  }

  if (
    payload.messageLowered.includes('admin link wallet') ||
    payload.messageLowered.includes('adminlinkwallet')
  ) {
    payload.handled = true;
    return await processCommand(payload.message, payload.client);
  }
};

export default adminLinkWallet;
