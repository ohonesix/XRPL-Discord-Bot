// tslint:disable-next-line
const EventEmitter = require('eventemitter3');
import { EventTypes, EventPayload } from './BotEvents';
import { Message, Client, CommandInteraction } from 'discord.js';

// A simple wrapper that extends the default EventEmitter so
// that we can ensure all emitted events using our EventPayload.
export default class CustomEmitter extends EventEmitter {
  emitPayload(
    eventType: EventTypes,
    message: Message,
    messageLowered: string,
    client: Client,
    interaction: CommandInteraction,
    logger: any
  ) {
    const wrapper = new EventPayload(
      message,
      messageLowered,
      client,
      interaction,
      logger
    );
    this.emit(eventType, wrapper);
    return wrapper;
  }
}
