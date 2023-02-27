import SETTINGS from '../settings';
import mongodb from 'mongodb';
const { MongoClient } = mongodb;

const deleteWallet = async (address: string): Promise<number> => {
  const client = await MongoClient.connect(SETTINGS.MONGODB.SERVER_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(SETTINGS.MONGODB.DATABASE_NAME);

  const storedWallets = (await db
    .collection(SETTINGS.MONGODB.USERS_TABLE)
    .find({ 'wallets.address': address })
    .toArray()) as IBotUser[];

  if (storedWallets.length > 0) {
    for (const user of storedWallets) {
      await db.collection(SETTINGS.MONGODB.USERS_TABLE).updateOne(
        { discordId: user.discordId },
        {
          $set: {
            wallets: user.wallets.filter((w) => w.address !== address),
            timestamp: new Date().toISOString(),
          },
        },
        { upsert: true }
      );
    }
  }

  client.close();
  // ERR code 0 = all good
  return 0;
};

export { deleteWallet };
