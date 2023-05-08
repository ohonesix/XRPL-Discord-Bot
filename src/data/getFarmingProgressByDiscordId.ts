import SETTINGS from '../settings';
import mongodb from 'mongodb';
const { MongoClient } = mongodb;

const getFarmingProgressByDiscordId = async (
  discordId: string
): Promise<IFarming> => {
  const client = await MongoClient.connect(SETTINGS.MONGODB.SERVER_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(SETTINGS.MONGODB.DATABASE_NAME);

  const farmingProgress = (await db
    .collection(SETTINGS.MONGODB.FARMING_PROGRESS_TABLE)
    .findOne({ discordId })) as IFarming;

  client.close();
  return farmingProgress;
};

export { getFarmingProgressByDiscordId };
