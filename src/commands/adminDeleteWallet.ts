import getWalletAddress from '../utils/getWalletAddress';
import isAdmin from '../utils/isAdmin';
import { deleteWallet } from '../data/deleteWallet';
import { Message } from 'discord.js';
import { EventPayload } from '../events/BotEvents';

const processCommand = async (message: Message) => {
  if (!isAdmin(message.author.id)) {
    return message.reply(`Sorry you are not authorised to do that.`);
  }

  // Get address
  const walletAddress = getWalletAddress(message.content);

  if (!walletAddress) {
    return message.reply(
      `Could not get the wallet address, please check the format and try again for example 'admindeletewallet WALLETADDRESSHERE'`
    );
  }

  // Save in Mongo
  const mongoUpdateResult = await deleteWallet(walletAddress);

  // Send confirmation to the user
  return message.reply(`Deleted ${walletAddress} from my records.`);
};

const adminDeleteWallet = async (payload: EventPayload) => {
  if (payload.handled) {
    return;
  }

  if (
    payload.messageLowered.includes('admin delete wallet') ||
    payload.messageLowered.includes('admindeletewallet')
  ) {
    payload.handled = true;
    return await processCommand(payload.message);
  }
};

export default adminDeleteWallet;
