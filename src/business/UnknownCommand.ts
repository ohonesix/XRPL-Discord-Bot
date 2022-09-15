import EventWrapper from '../events/EventWrapper.js';
import { EventTypes } from '../events/EventTypes.js';

const eventCallback = (eventWrapper: EventWrapper) => {
  if (eventWrapper.handled) {
    return;
  }

  return eventWrapper.payload.reply(
    "I don't know what to do with that, type !commands for help"
  );
};

export default class UnknownCommand {
  public static setup(eventEmitter: any): void {
    eventEmitter.addListener(EventTypes.MESSAGE, eventCallback);
  }
}
