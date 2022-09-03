import isAdmin from '../utils/isAdmin.js';
import { Message } from 'discord.js';

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

export { helpCommands };
