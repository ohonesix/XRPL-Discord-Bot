import { getWalletHoldings } from '../integration/xrpl/getWalletHoldings.js';
import { updateUserWallet } from '../data/updateUserWallet.js';
import { updateUserRoles } from '../integration/discord/updateUserRoles.js';
import { Client, User } from 'discord.js';
import truncate from '../utils/truncate.js';
import { WalletUpdateResponse } from '../models/enum/WalletUpdateResponse.js';

const linkWalletToDiscordAccount = async (
  walletAddress: string,
  verified: boolean,
  user: User,
  client: Client,
  LOGGER: any
): Promise<string> => {
  if (!walletAddress) {
    return null;
  }

  // Get holdings
  let holdings = await getWalletHoldings(walletAddress, null);
  if (holdings === -1) {
    if (LOGGER !== null) {
      LOGGER.trackEvent({
        name: 'linkWallet-no-trustline',
        properties: { walletAddress },
      });
    }

    return `Seems like you don't have the project trustline yet, please retry once it has been added 👉 https://xrpscan.com/account/${walletAddress}`;
  }

  // Allow them to set it even with network error
  let hadError = false;
  if (holdings === null) {
    hadError = true;
    holdings = 0;
  }

  const newWallet: IWallet = {
    address: walletAddress,
    points: holdings,
    verified,
  };

  const newUser: IBotUser = {
    discordId: user.id,
    discordUsername: user.username,
    discordDiscriminator: user.discriminator,
    previousDiscordUsername: '',
    previousDiscordDiscriminator: '',
    totalPoints: holdings,
    wallets: [],
  };

  // Save in Mongo
  const mongoUpdateResult = await updateUserWallet(newUser, newWallet, false);

  // The wallet has been claimed before, needs to be set by admin
  if (mongoUpdateResult === WalletUpdateResponse.ErrorAddressAlreadyClaimed) {
    if (LOGGER !== null) {
      LOGGER.trackEvent({
        name: 'linkWallet-claimed-by-another-user',
        properties: {
          walletAddress,
          activeUserId: user.id,
          activeUserName: user.username,
        },
      });
    }

    return `This address has been claimed before, if it wasn't done by you please message a mod with ownership proof to claim it`;
  }

  // If the user has set too many addresses an admin has to do it
  if (mongoUpdateResult === WalletUpdateResponse.ErrorTooManyAccountClaims) {
    if (LOGGER !== null) {
      LOGGER.trackEvent({
        name: 'linkWallet-too-many-claimed',
        properties: {
          walletAddress,
          activeUserId: user.id,
          activeUserName: user.username,
        },
      });
    }
    return `You seem to have claimed too many addresses, please message a mod with ownership proof to claim more`;
  }

  // Set role
  await updateUserRoles(0, holdings, user.id, client, LOGGER, false);

  if (LOGGER !== null) {
    LOGGER.trackEvent({
      name: 'linkWallet-success',
      properties: {
        walletAddress,
        activeUserId: user.id,
        activeUserName: user.username,
      },
    });
  }

  // Send confirmation to the user
  if (hadError) {
    return `Wallet linked! There was an error trying to get your holdings from the XRPL network. Your role will be updated automatically once the network is working. You do not need to do anything else.`;
  }

  return `Found your ${truncate(
    holdings,
    2
  )} points! Updated server roles set 🚀`;
};

export { linkWalletToDiscordAccount };
