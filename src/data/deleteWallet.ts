import SETTINGS from '../settings.js';
import mongodb from 'mongodb';
const { MongoClient } = mongodb;

const deleteWallet = async (address: string): Promise<number> => {
  const client = await MongoClient.connect(SETTINGS.MONGODB.SERVER_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(SETTINGS.MONGODB.DATABASE_NAME);

  await db.collection(SETTINGS.MONGODB.USERS_TABLE).deleteMany({ address });

  client.close();
  // ERR code 0 = all good
  return 0;
};

export { deleteWallet };
