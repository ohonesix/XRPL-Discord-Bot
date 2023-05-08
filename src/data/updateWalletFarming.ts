import SETTINGS from '../settings';
import mongodb from 'mongodb';
const { MongoClient } = mongodb;

const updateWalletFarming = async (
  discordId: string,
  rewardPointsRequired: number,
  rewardGoalAmount: number,
  rewardGoalHoursRequired: number,
  hoursFarmed: number,
  isActive: boolean,
  dateStarted: string
): Promise<number> => {
  const client = await MongoClient.connect(SETTINGS.MONGODB.SERVER_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(SETTINGS.MONGODB.DATABASE_NAME);

  await db.collection(SETTINGS.MONGODB.FARMING_PROGRESS_TABLE).updateOne(
    { discordId },
    {
      $set: {
        rewardPointsRequired,
        rewardGoalAmount,
        rewardGoalHoursRequired,
        hoursFarmed,
        isActive,
        dateStarted,
        timestamp: new Date().toISOString(),
      },
    },
    { upsert: true }
  );

  client.close();
  // ERR code 0 = all good
  return 0;
};

export { updateWalletFarming };
