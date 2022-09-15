import isAdmin from '../utils/isAdmin.js';
import { Message } from 'discord.js';
import EventWrapper from '../events/EventWrapper.js';
import { EventTypes } from '../events/EventTypes.js';

const helpCommands = async (message: Message) => {
  let reply = `You can
  - Link a wallet to your account using: 'linkwallet WALLETADDRESSHERE'
  - Check wallet points using: 'checkwallet WALLETADDRESSHERE'
  `;

  if (isAdmin(message.author.id)) {
    reply += `\nAdmin commands
    - Link a wallet to user account using: 'adminlinkwallet WALLETADDRESSHERE DISCORDUSER#NUMBER'
    - Delete a wallet from the system using: 'admindeletewallet WALLETADDRESSHERE'
    - Get all users in a role using: 'getusers ROLENAME'
    - Get a users wallet address using: 'getwallet DISCORDUSER#NUMBER'
    - Get a wallet user by address using: 'getwallet WALLETADDRESSHERE'
    - Verify if a username is linked to a wallet using 'verifywallet WALLETADDRESSHERE DISCORDUSER#NUMBER'
    `;
  }

  return message.reply(reply);
};

const eventCallback = (eventWrapper: EventWrapper) => {
  const inputLower = eventWrapper.payload.content.toLowerCase();

  if (inputLower.includes('commands') || inputLower.includes('help')) {
    eventWrapper.handled = true;
    return helpCommands(eventWrapper.payload);
  }
};

export default class HelpCommands {
  public static setup(eventEmitter: any): void {
    eventEmitter.addListener(EventTypes.MESSAGE, eventCallback);
  }
}
