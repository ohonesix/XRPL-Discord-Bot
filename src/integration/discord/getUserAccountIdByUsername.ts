import SETTINGS from '../../settings';
import { Client } from 'discord.js';

const getUserAccountIdByUsername = async (
  username: string,
  tag: string,
  client: Client
): Promise<string> => {
  // Get server for context
  const server = client.guilds.cache.get(SETTINGS.DISCORD.SERVER_ID);
  const users = await server.members.search({ query: username, cache: true });

  if (!users) {
    return null;
  }

  const user = users.filter((entry) => entry.user.discriminator === tag);

  if (!user?.firstKey()) {
    return null;
  }

  return user.firstKey();
};

export { getUserAccountIdByUsername };
