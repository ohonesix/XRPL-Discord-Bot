import { Client, Message, Role } from 'discord.js';
import isAdmin from '../utils/isAdmin.js';
import getRole from '../utils/getRole.js';
import SETTINGS from '../settings.js';
import { EventTypes, EventPayload } from '../events/BotEvents.js';

const getRoleUsers = async (message: Message, client: Client) => {
  if (!isAdmin(message.author.id)) {
    return message.reply(`Sorry you are not autorised to do that.`);
  }

  const roleNameToGet = getRole(message.content);

  const server = client.guilds.cache.get(SETTINGS.DISCORD.SERVER_ID);

  // Refresh the cache
  await server.members.fetch();

  const guidRole = server.roles.cache.find(
    (role: Role) => role.name === roleNameToGet
  );

  const members = guidRole?.members.map(
    (m) => m.user.username + '#' + m.user.discriminator
  );

  if (members === null) {
    return message.reply(
      'Cant find a role with that name, please check the spelling and try again with command as "getusersforole ROLENAME"'
    );
  }

  let result = `Users in ${guidRole.name}:\n`;

  members.forEach((member) => {
    result += `\n${member}`;
  });

  return message.reply(result);
};

const eventCallback = async (payload: EventPayload) => {
  if (payload.handled) {
    return;
  }

  if (
    payload.messageLowered.includes('get role users') ||
    payload.messageLowered.includes('getroleusers')
  ) {
    payload.handled = true;
    return await getRoleUsers(payload.message, payload.client);
  }
};

export default class GetRoleUsers {
  public static setup(eventEmitter: any): void {
    eventEmitter.addListener(EventTypes.MESSAGE, eventCallback);
  }
}
