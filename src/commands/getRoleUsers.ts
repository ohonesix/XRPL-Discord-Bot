import { Client, Message, Role } from 'discord.js';
import isAdmin from '../utils/isAdmin';
import getRole from '../utils/getRole';
import { getUsersInRole } from '../integration/discord/getUsersInRole';

import { EventPayload } from '../events/BotEvents';

const processCommand = async (message: Message, client: Client) => {
  if (!isAdmin(message.author.id)) {
    return message.reply(`Sorry you are not authorised to do that.`);
  }

  const roleName = getRole(message.content);

  const usersResult = await getUsersInRole(roleName, client);

  if (usersResult === null || usersResult.members.length === 0) {
    return message.reply(
      'Cant find a role with that name, please check the spelling and try again with command as "getusersforole ROLENAME"'
    );
  }

  let result = `Users in ${usersResult.role.name}:\n`;

  usersResult.members.forEach((member: string) => {
    result += `\n${member}`;
  });

  return message.reply(result);
};

const getRoleUsers = async (payload: EventPayload) => {
  if (payload.handled) {
    return;
  }

  if (
    payload.messageLowered.includes('get role users') ||
    payload.messageLowered.includes('getroleusers')
  ) {
    payload.handled = true;
    return await processCommand(payload.message, payload.client);
  }
};

export default getRoleUsers;
