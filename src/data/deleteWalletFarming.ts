import SETTINGS from '../settings';
import mongodb from 'mongodb';
const { MongoClient } = mongodb;

const deleteWalletFarming = async (discordId: string): Promise<number> => {
  const client = await MongoClient.connect(SETTINGS.MONGODB.SERVER_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(SETTINGS.MONGODB.DATABASE_NAME);

  await db
    .collection(SETTINGS.MONGODB.FARMING_PROGRESS_TABLE)
    .deleteOne({ discordId });

  client.close();
  // ERR code 0 = all good
  return 0;
};

export { deleteWalletFarming };
