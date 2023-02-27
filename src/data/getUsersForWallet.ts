import SETTINGS from '../settings';
import mongodb from 'mongodb';
const { MongoClient } = mongodb;

const getUsersForWallet = async (address: string): Promise<IBotUser[]> => {
  const client = await MongoClient.connect(SETTINGS.MONGODB.SERVER_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(SETTINGS.MONGODB.DATABASE_NAME);

  const storedWallets = (await db
    .collection(SETTINGS.MONGODB.USERS_TABLE)
    .find({ 'wallets.address': address })
    .toArray()) as IBotUser[];

  client.close();
  return storedWallets;
};

export { getUsersForWallet };
