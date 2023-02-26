import { Client, Role } from 'discord.js';
import SETTINGS from '../../settings';

const getUsersInRole = async (roleName: string, client: Client) => {
  const server = client.guilds.cache.get(SETTINGS.DISCORD.SERVER_ID);

  // Refresh the cache
  await server.members.fetch();

  const guidRole = server.roles.cache.find(
    (role: Role) => role.name === roleName
  );

  const members = guidRole?.members.map(
    (m) => m.user.username + '#' + m.user.discriminator
  );

  return {
    role: guidRole,
    members,
  };
};

export { getUsersInRole };
