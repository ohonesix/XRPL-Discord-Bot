import { EventPayload } from '../events/BotEvents';

const unknown = async (payload: EventPayload) => {
  if (payload.handled) {
    return;
  }

  return await payload.message.reply(
    "I don't know what to do with that, type help or !commands for help"
  );
};

// This is the default response when no other command handled up the event.
export default unknown;
