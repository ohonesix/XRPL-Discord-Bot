import SETTINGS from '../settings';
import mongodb from 'mongodb';
const { MongoClient } = mongodb;

const getAllUsers = async () => {
  const client = await MongoClient.connect(SETTINGS.MONGODB.SERVER_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(SETTINGS.MONGODB.DATABASE_NAME);

  const wallets = (await db
    .collection(SETTINGS.MONGODB.USERS_TABLE)
    .find({})
    .toArray()) as IBotUser[];

  client.close();
  return wallets;
};

export { getAllUsers };
