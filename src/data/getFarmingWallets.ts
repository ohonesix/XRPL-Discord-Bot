import SETTINGS from '../settings';
import mongodb from 'mongodb';
const { MongoClient } = mongodb;

const getFarmingWallets = async (): Promise<IFarming[]> => {
  const client = await MongoClient.connect(SETTINGS.MONGODB.SERVER_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(SETTINGS.MONGODB.DATABASE_NAME);

  const wallets = (await db
    .collection(SETTINGS.MONGODB.FARMING_PROGRESS_TABLE)
    .find({})
    .toArray()) as IFarming[];

  client.close();
  return wallets;
};

export { getFarmingWallets };
