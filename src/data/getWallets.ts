import SETTINGS from '../settings.js';
import mongodb from 'mongodb';
const { MongoClient } = mongodb;

const getWallets = async () => {
  const client = await MongoClient.connect(SETTINGS.MONGODB.SERVER_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(SETTINGS.MONGODB.DATABASE_NAME);

  const wallets = await db
    .collection(SETTINGS.MONGODB.USERS_TABLE)
    .find({})
    .toArray();

  client.close();
  return wallets;
};

export { getWallets };
