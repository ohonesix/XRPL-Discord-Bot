import SETTINGS from '../../settings.js';
import { Client, Role, GuildMember } from 'discord.js';

const updateUserRoles = async (
  prevHoldings: number,
  newHoldings: number,
  userId: string,
  client: Client,
  forceRefreshRoles: boolean
): Promise<GuildMember> => {
  try {
    // Get server for context
    const server = client.guilds.cache.get(SETTINGS.DISCORD.SERVER_ID);

    // Get the role objects
    const r1 = server.roles.cache.find(
      (role: Role) => role.id === SETTINGS.DISCORD_ROLES.r1
    );
    const r2 = server.roles.cache.find(
      (role: Role) => role.id === SETTINGS.DISCORD_ROLES.r2
    );


    const userAccount = await server.members.fetch(userId);

    // Check if the user has left the server
    if (!userAccount || userAccount === null) {
      return;
    }

    // Remove roles on holdings decrease
    if (newHoldings !== prevHoldings || forceRefreshRoles) {

      if (r2) {
        await userAccount.roles.remove(r2);
      }
      if (r1) {
        await userAccount.roles.remove(r1);
      }
    }

    // Role mappings

    if (newHoldings >= 1 && r2) {
      await userAccount.roles.add(r2);
      return userAccount;
    }
    if (newHoldings >= 0 && r1) {
      await userAccount.roles.add(r1);
    }

    return userAccount;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { updateUserRoles };
