import SETTINGS from './settings.js';

// tslint:disable-next-line
let appInsights = require('applicationinsights');
if (SETTINGS.APPLICATION_INSIGHTS.ENABLED) {
  appInsights.setup(SETTINGS.APPLICATION_INSIGHTS.KEY).start();
}
const LOGGER = appInsights?.defaultClient ?? null;

import express from 'express';
import { Client, Intents, Message, Interaction } from 'discord.js';
import EventFactory from './events/EventFactory';
import { EventTypes } from './events/BotEvents';

import { scanLinkedWallets } from './business/scanLinkedWallets.js';
import { scanLinkedAccounts } from './business/scanLinkedAccounts.js';

// Discord Client
const discordClient = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
  partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'USER', 'REACTION'],
});

// tslint:disable-next-line
const { REST } = require('@discordjs/rest');
// tslint:disable-next-line
const { Routes } = require('discord-api-types/v9');

// Discord slash commands
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

// Discord /Slash Events
discordClient.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isCommand()) return;

  // Emit the interaction so our registered commands can respond
  EventFactory.getInstance().eventEmitter.emitPayload(
    EventTypes.INTERACTION,
    null, // no Message for Interactions
    null,
    discordClient,
    interaction,
    LOGGER
  );
});

// Discord Message Events
discordClient.on('messageCreate', async (message: Message) => {
  // Only listen for DM's and not self messages
  if (message.guildId !== null || message.author.bot) {
    return;
  }

  // Emit the message so our registered commands can respond
  EventFactory.getInstance().eventEmitter.emitPayload(
    EventTypes.MESSAGE,
    message,
    message.content.toLowerCase(),
    discordClient,
    null, // no Interaction in DM's
    LOGGER
  );
});

discordClient.on('ready', async () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.login(SETTINGS.DISCORD.BOT_TOKEN);

// Webserver
const webServer = express();

webServer.get('/', async (req, res) => {
  res.send(
    'The XRPL Discord Bot is running! See <a href="https://github.com/jacobpretorius/XRPL-Discord-Bot">here for updates</a>'
  );
});

webServer.get('/status', async (req, res) => {
  res.send('Ok');
});

webServer.get('/updateWallets', async (req, res) => {
  req.setTimeout(9999999);
  const forceRefreshRoles =
    req.query.forceRefreshRoles === 'true' ? true : false;
  const forceUpsertRoles = req.query.forceUpsertRoles === 'true' ? true : false;

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
