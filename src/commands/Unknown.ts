import { EventTypes, EventPayload } from '../events/BotEvents.js';

const eventCallback = async (payload: EventPayload) => {
  if (payload.handled) {
    return;
  }

  return await payload.message.reply(
    "I don't know what to do with that, type !commands for help"
  );
};

// This is the default response when no other command handled up the event.
export default class Unknown {
  public static setup(eventEmitter: any): void {
    eventEmitter.addListener(EventTypes.MESSAGE, eventCallback);
  }
}
