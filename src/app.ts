import SETTINGS from './settings.js';

// tslint:disable-next-line
let appInsights = require('applicationinsights');
if (SETTINGS.APPLICATION_INSIGHTS.ENABLED) {
  appInsights.setup(SETTINGS.APPLICATION_INSIGHTS.KEY).start();
}
const LOGGER = appInsights?.defaultClient ?? null;

import express from 'express';
import { Client, Intents, Message, Interaction } from 'discord.js';
import { linkWallet } from './business/linkWallet.js';
import { scanLinkedWallets } from './business/scanLinkedWallets.js';
import { scanLinkedAccounts } from './business/scanLinkedAccounts.js';
import { adminLinkWallet } from './business/adminLinkWallet.js';
import { checkWallet } from './business/checkWallet.js';
import { getPrice } from './business/getPrice.js';
import { getUsersForRole } from './business/getUsersForRole.js';
import { getUserWallets } from './business/getUserWallets.js';
import { helpCommands } from './business/helpCommands.js';
import { verifyWallet } from './business/verifyWallet.js';
import { adminDeleteWallet } from './business/adminDeleteWallet.js';

// Discord Client
const discordClient = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
  partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'USER', 'REACTION'],
});

// Discord slash commands
// tslint:disable-next-line
const { REST } = require('@discordjs/rest');
// tslint:disable-next-line
const { Routes } = require('discord-api-types/v9');

const commands = [
  {
    name: 'linkwallet',
    description: 'Link your wallet to get server roles',
    options: [
      {
        type: 3,
        name: 'wallet-address',
        description: 'Your XRP Wallet Address',
        required: true,
      },
    ],
  },
  {
    name: 'price',
    description: 'Shows the last trading price on Sologenic 💲',
  },
];

const rest = new REST({ version: '9' }).setToken(SETTINGS.DISCORD.BOT_TOKEN);
rest.put(
  Routes.applicationGuildCommands(
    SETTINGS.DISCORD.APP_ID,
    SETTINGS.DISCORD.SERVER_ID
  ),
  { body: commands }
);

// Discord Slash Events
discordClient.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'linkwallet') {
    await interaction.reply({
      content: await linkWallet(
        interaction.options.getString('wallet-address'),
        interaction.user,
        discordClient,
        LOGGER
      ),
      ephemeral: true,
    });
    return;
  }

  if (interaction.commandName === 'price') {
    await interaction.reply(await getPrice());
    return;
  }
});

// Discord Message Events
discordClient.on('messageCreate', async (message: Message) => {
  // Only listen for DM's and not self messages
  if (message.guildId !== null || message.author.bot) {
    return;
  }

  const inputLower = message.content.toLowerCase();

  if (inputLower.includes('adminlinkwallet')) {
    await adminLinkWallet(message, discordClient);
    return;
  }

  if (
    inputLower.includes('admindeletewallet') ||
    inputLower.includes('admin delete wallet')
  ) {
    await adminDeleteWallet(message);
    return;
  }

  if (inputLower.includes('linkwallet') || inputLower.includes('link wallet')) {
    message.reply(
      await linkWallet(message.content, message.author, discordClient, LOGGER)
    );
    return;
  }

  if (inputLower.includes('checkwallet')) {
    await checkWallet(message, discordClient);
    return;
  }

  if (inputLower.includes('getusers')) {
    await getUsersForRole(message, discordClient);
    return;
  }

  if (inputLower.includes('getwallet')) {
    await getUserWallets(message, discordClient);
    return;
  }

  if (inputLower.includes('verifywallet')) {
    await verifyWallet(message, discordClient);
    return;
  }

  if (inputLower.includes('commands') || inputLower.includes('help')) {
    await helpCommands(message);
    return;
  }

  message.reply(`I don't know what to do with that, type !commands for help`);
});

discordClient.on('ready', async () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.login(SETTINGS.DISCORD.BOT_TOKEN);

// Webserver
const webServer = express();

webServer.get('/', async (req, res) => {
  res.send('https://ohonesix.com/xrpl-discord-bot');
});

webServer.get('/status', async (req, res) => {
  res.send('Ok');
});

webServer.get('/updateWallets', async (req, res) => {
  req.setTimeout(9999999);
  const forceRefreshRoles = req.query.forceRefreshRoles != null ? true : false;
  const forceUpsertRoles = req.query.forceUpsertRoles != null ? true : false;

  res.send(
    await scanLinkedWallets(
      discordClient,
      LOGGER,
      forceRefreshRoles,
      forceUpsertRoles
    )
  );
});

webServer.get('/updateAccounts', async (req, res) => {
  res.send(await scanLinkedAccounts(discordClient, LOGGER));
});

webServer.listen(SETTINGS.APP.PORT, async () => {
  console.log(`Listening at http://localhost:${SETTINGS.APP.PORT}`);
});
