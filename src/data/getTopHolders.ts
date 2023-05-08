import SETTINGS from '../settings';
import mongodb from 'mongodb';
const { MongoClient } = mongodb;

const getTopHolders = async (): Promise<IBotUser[]> => {
  const client = await MongoClient.connect(SETTINGS.MONGODB.SERVER_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(SETTINGS.MONGODB.DATABASE_NAME);

  const topHolders = (await db
    .collection(SETTINGS.MONGODB.USERS_TABLE)
    .find({})
    .sort({ totalPoints: -1 })
    .limit(10)
    .toArray()) as IBotUser[];

  client.close();
  return topHolders;
};

export { getTopHolders };
