const SETTINGS = {
  APPLICATION_INSIGHTS: {
    ENABLED: process.env.AZURE_AI_ENABLED === 'true' ? true : false,
    KEY: process.env.AZURE_AI_TOKEN || '',
  },
  DISCORD: {
    SERVER_ID: process.env.DISCORD_SERVER_ID || 'replace-me',
    APP_ID: process.env.DISCORD_APP_ID || 'replace-me',
    BOT_TOKEN: process.env.DISCORD_BOT_TOKEN || 'replace-me',
    ADMIN_IDS: ['replace-me'],
  },
  MONGODB: {
    SERVER_URL: process.env.MONGO_SERVER_URL || 'mongodb://127.0.0.1',
    DATABASE_NAME: 'XRPL-Discord-Bot-DB',
    USERS_TABLE: 'Users',
  },
  XRPL: {
    SERVER_URL: 'wss://xrplcluster.com/',
    TOKEN_HASH: 'replace-me',
  },
  DISCORD_ROLES: {
    r1: '123',
    r2: '456',
  },
};

export default SETTINGS;
