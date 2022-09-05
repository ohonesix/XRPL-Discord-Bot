import SETTINGS from '../settings.js';
import mongodb from 'mongodb';
const { MongoClient } = mongodb;

const getWalletForAddress = async (address: string) => {
  const client = await MongoClient.connect(SETTINGS.MONGODB.SERVER_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(SETTINGS.MONGODB.DATABASE_NAME);

  const wallet = await db
    .collection(SETTINGS.MONGODB.USERS_TABLE)
    .findOne({ 'wallet.address': address });

  client.close();
  return wallet;
};

export { getWalletForAddress };
