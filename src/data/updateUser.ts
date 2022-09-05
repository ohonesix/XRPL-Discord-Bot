import SETTINGS from '../settings.js';
import mongodb from 'mongodb';
import { WalletUpdateResponse } from '../models/enum/walletUpdateResponse.js';
const { MongoClient } = mongodb;

const updateUser = async (user: IBotUser): Promise<WalletUpdateResponse> => {
  const client = await MongoClient.connect(SETTINGS.MONGODB.SERVER_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(SETTINGS.MONGODB.DATABASE_NAME);

  await db.collection(SETTINGS.MONGODB.USERS_TABLE).updateOne(
    { discordId: user.discordId },
    {
      $set: {
        discordUsername: user.discordUsername,
        discordDiscriminator: user.discordDiscriminator,
        totalPoints: user.totalPoints,
        wallets: user.wallets,
        timestamp: new Date().toISOString(),
      },
    },
    { upsert: true }
  );

  client.close();
  // ERR code 0 = all good
  return WalletUpdateResponse.Ok;
};

export { updateUser };
