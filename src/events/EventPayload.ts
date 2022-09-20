// The main reason for this is if we want some events to only
// be handled once, it is then possible as the first handling
// listener can set 'handled' to true.
// However this does mean other listeners need to respect if the
// event has been handled.
import { Client, Message, CommandInteraction } from 'discord.js';
export default class EventPayload {
  public message: Message;
  public messageLowered: string; // used to trigger commands
  public client: Client;
  public interaction: CommandInteraction; // For when 'message' is not given
  public logger: any; // Optional

  // If this event has been handled
  public handled: boolean;

  public constructor(
    message: Message,
    messageLowered: string,
    client: Client,
    interaction: CommandInteraction,
    logger: any,
    handled = false
  ) {
    this.message = message;
    this.messageLowered = messageLowered;
    this.client = client;
    this.interaction = interaction;
    this.logger = logger;
    this.handled = handled;
  }
}
