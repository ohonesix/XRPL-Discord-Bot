import SETTINGS from '../settings.js';
import mongodb from 'mongodb';
import { WalletUpdateResponse } from '../models/enum/walletUpdateResponse.js';
const { MongoClient } = mongodb;

const updateUserWallet = async (
  user: IBotUser,
  wallet: IWallet,
  skipChecks: boolean
): Promise<WalletUpdateResponse> => {
  const client = await MongoClient.connect(SETTINGS.MONGODB.SERVER_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(SETTINGS.MONGODB.DATABASE_NAME);

  let existingUser = (await db
    .collection(SETTINGS.MONGODB.USERS_TABLE)
    .findOne({ discordId: user.discordId })) as IBotUser;

  // The user doesn't exist, use the passed in user
  if (!existingUser) existingUser = user;

  if (!skipChecks) {
    // Check this user hasn't claimed more than the max amount
    if (existingUser?.wallets?.length >= SETTINGS.APP.MAX_WALLETS) {
      client.close();
      return WalletUpdateResponse.ErrorTooManyAccountClaims;
    }

    const existingWalletOwner = (await db
      .collection(SETTINGS.MONGODB.USERS_TABLE)
      .findOne({ wallets: { address: wallet.address } })) as IBotUser;

    // Check if the address has been claimed before
    if (
      existingWalletOwner &&
      existingWalletOwner.discordId !== existingUser.discordId
    ) {
      client.close();
      return WalletUpdateResponse.ErrorAddressAlreadyClaimed;
    }
  }

  // See if they have this wallet already
  const existingWallet = existingUser.wallets?.filter(
    (w) => w.address === wallet.address
  )[0];
  if (existingWallet) {
    // They do, update the values
    existingWallet.points = wallet.points;
    existingWallet.verified = wallet.verified;
  } else {
    // They don't have this wallet, add it
    existingUser.wallets.push(wallet);
  }

  await db.collection(SETTINGS.MONGODB.USERS_TABLE).updateOne(
    { discordId: existingUser.discordId },
    {
      $set: {
        discordId: existingUser.discordId,
        discordUsername: existingUser.discordUsername,
        discordDiscriminator: existingUser.discordDiscriminator,
        totalPoints: existingUser.totalPoints,
        wallets: existingUser.wallets,
        timestamp: new Date().toISOString(),
      },
    },
    { upsert: true }
  );

  client.close();
  // ERR code 0 = all good
  return WalletUpdateResponse.Ok;
};

export { updateUserWallet };
