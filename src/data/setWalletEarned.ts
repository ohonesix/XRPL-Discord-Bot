import SETTINGS from '../settings';
import mongodb from 'mongodb';
const { MongoClient } = mongodb;

const setWalletEarned = async (
  discordId: string,
  discordUsername: string,
  discordDiscriminator: string,
  rewardAmountEarned: number,
  hoursFarmed: number,
  dateStarted: string,
  dateEnded: string
): Promise<number> => {
  const client = await MongoClient.connect(SETTINGS.MONGODB.SERVER_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(SETTINGS.MONGODB.DATABASE_NAME);

  await db.collection(SETTINGS.MONGODB.FARMING_DONE_TABLE).insertOne({
    discordId,
    discordUsername,
    discordDiscriminator,
    rewardAmountEarned,
    hoursFarmed,
    dateStarted,
    dateEnded,
    timestamp: new Date().toISOString(),
  });

  client.close();
  // ERR code 0 = all good
  return 0;
};

export { setWalletEarned };
