import SETTINGS from '../../settings';
import { Client, GuildMember } from 'discord.js';

const getUserAccountById = async (
  userId: string,
  client: Client
): Promise<GuildMember> => {
  try {
    // Get server for context
    const server = client.guilds.cache.get(SETTINGS.DISCORD.SERVER_ID);

    return await server.members.fetch(userId);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { getUserAccountById };
