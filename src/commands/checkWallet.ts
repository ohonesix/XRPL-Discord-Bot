import getWalletAddress from '../utils/getWalletAddress';
import { getWalletHoldings } from '../integration/xrpl/getWalletHoldings';
import { Message } from 'discord.js';
import { EventPayload } from '../events/BotEvents';

const processCommand = async (message: Message) => {
  // Get address
  const walletAddress = getWalletAddress(message.content);

  if (!walletAddress) {
    // Message for this error is sent in getWalletAddress
    return;
  }

  // Get holdings
  const holdings = await getWalletHoldings(walletAddress, null);
  if (holdings === -1) {
    return message.reply(
      `Seems like the wallet doesn't have the project trustline, please verify the trustline is set and try again 👉 https://xrpscan.com/account/${walletAddress}`
    );
  }

  if (holdings === null) {
    return message.reply(
      `There was an issue getting the wallet holdings from XRPL network, please try later or use 👉 https://xrpscan.com/account/${walletAddress}`
    );
  }

  return message.reply(
    `The wallet has ${holdings} points 👉 https://xrpscan.com/account/${walletAddress}`
  );
};

const checkWallet = async (payload: EventPayload) => {
  if (payload.handled) {
    return;
  }

  if (
    payload.messageLowered.includes('check wallet') ||
    payload.messageLowered.includes('checkwallet')
  ) {
    payload.handled = true;
    return await processCommand(payload.message);
  }
};

export default checkWallet;
