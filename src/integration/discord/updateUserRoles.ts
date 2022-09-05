import SETTINGS from '../../settings.js';
import { Client, Role, GuildMember } from 'discord.js';

const updateUserRoles = async (
  prevHoldings: number,
  newHoldings: number,
  userId: string,
  client: Client,
  LOGGER: any,
  forceRefreshRoles: boolean
): Promise<GuildMember> => {
  try {
    // Get server for context
    const server = client.guilds.cache.get(SETTINGS.DISCORD.SERVER_ID);

    let userAccount;
    try {
      userAccount = await server.members.fetch(userId);
    } catch (error) {
      return;
    }

    // Check if the user has left the server, nothing to do then
    if (!userAccount || userAccount === null) {
      return;
    }

    const cachedRoles = [];

    // Get the role objects
    for (const roleRule of SETTINGS.DISCORD_ROLES.ROLES_BY_POINTS) {
      const [key] = Object.entries(roleRule);
      const roleId = key[0];
      const pointsNeeded = key[1];

      // Check if the role exists in Discord
      const discordRole = server.roles.cache.find(
        (role: Role) => role.id === roleId
      );

      // It does, store it
      if (discordRole) {
        cachedRoles.push({ discordRole, pointsNeeded });
      }
    }

    // Remove roles on points decrease or force refresh
    if (newHoldings < prevHoldings || forceRefreshRoles) {
      for (const role of cachedRoles) {
        await userAccount.roles.remove(role.discordRole);
      }
    }

    // Add roles based on points
    for (const role of cachedRoles) {
      if (newHoldings >= role.pointsNeeded) {
        await userAccount.roles.add(role.discordRole);
      }
    }

    return userAccount;
  } catch (error) {
    if (LOGGER !== null) {
      LOGGER.trackException({
        exception: new Error(error),
      });
    }
    return null;
  }
};

export { updateUserRoles };
