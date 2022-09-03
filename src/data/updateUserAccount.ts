import SETTINGS from '../settings.js';
import mongodb from 'mongodb';
const { MongoClient } = mongodb;

const updateUserAccount = async (
  address: string,
  discordId: string,
  userName: string,
  userTag: string,
  newUserName: string,
  newUserTag: string
): Promise<number> => {
  const client = await MongoClient.connect(SETTINGS.MONGODB.SERVER_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(SETTINGS.MONGODB.DATABASE_NAME);

  await db.collection(SETTINGS.MONGODB.USERS_TABLE).updateOne(
    { address },
    {
      $set: {
        discordId,
        discordUsername: newUserName,
        discordDiscriminator: newUserTag,
        previousDiscordUsername: userName,
        previousDiscordDiscriminator: userTag,
        timestamp: new Date().toISOString(),
      },
    },
    { upsert: true }
  );

  client.close();
  // ERR code 0 = all good
  return 0;
};

export { updateUserAccount };
