import SETTINGS from '../settings';
import mongodb from 'mongodb';
const { MongoClient } = mongodb;

const getUserByDiscordId = async (discordId: string): Promise<IBotUser> => {
  const client = await MongoClient.connect(SETTINGS.MONGODB.SERVER_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(SETTINGS.MONGODB.DATABASE_NAME);

  const user = (await db
    .collection(SETTINGS.MONGODB.USERS_TABLE)
    .findOne({ discordId })) as IBotUser;

  client.close();
  return user;
};

export { getUserByDiscordId };
