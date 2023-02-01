import { Message } from 'discord.js';
import { EventPayload } from '../events/BotEvents';

const processCommand = async (message: Message) => {
  // You are of course free to remove or change this, but please don't :)
  // The more people know about the bot the more developers there are that can work on it and
  // provide more free features which helps everyone.
  const reply = `Based on the open-source bot https://ohonesix.com/xrpl-discord-bot which is available freely here https://github.com/jacobpretorius/XRPL-Discord-Bot`;

  return message.reply(reply);
};

const about = async (payload: EventPayload) => {
  if (payload.handled) {
    return;
  }

  if (payload.messageLowered.includes('about')) {
    payload.handled = true;
    return await processCommand(payload.message);
  }
};

export default about;
