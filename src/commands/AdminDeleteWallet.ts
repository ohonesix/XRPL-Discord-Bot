import getWalletAddress from '../utils/getWalletAddress.js';
import isAdmin from '../utils/isAdmin.js';
import { deleteWallet } from '../data/deleteWallet.js';
import { Message } from 'discord.js';
import { EventTypes, EventPayload } from '../events/BotEvents.js';

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

const eventCallback = async (payload: EventPayload) => {
  if (
    payload.messageLowered.includes('admin delete wallet') ||
    payload.messageLowered.includes('admindeletewallet')
  ) {
    payload.handled = true;
    return await adminDeleteWallet(payload.message);
  }
};

export default class AdminDeleteWallet {
  public static setup(eventEmitter: any): void {
    eventEmitter.addListener(EventTypes.MESSAGE, eventCallback);
  }
}
