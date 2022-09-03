import getWalletAddress from '../utils/getWalletAddress.js';
import isAdmin from '../utils/isAdmin.js';
import { deleteWallet } from '../data/deleteWallet.js';
import { Message } from 'discord.js';

const adminDeleteWallet = async (message: Message) => {
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

export { adminDeleteWallet };
