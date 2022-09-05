const SETTINGS = {
  APP: {
    PORT: process.env.PORT || 5880,
    // MAX_WALLETS
    // How many wallets each user can have at the same time.
    MAX_WALLETS: process.env.MAX_WALLETS || 1,
  },
  DISCORD: {
    SERVER_ID: process.env.DISCORD_SERVER_ID || 'replace-me',
    APP_ID: process.env.DISCORD_APP_ID || 'replace-me',
    BOT_TOKEN: process.env.DISCORD_BOT_TOKEN || 'replace-me',
    ADMIN_IDS: process.env.DISCORD_ADMIN_IDS || ['replace-me'],
  },
  MONGODB: {
    // SERVER_URL
    // You will need a Mongodb to store user info. You can use a free MongoDb hosted instance with Mongodb Atlas.
    SERVER_URL: process.env.MONGO_SERVER_URL || 'mongodb://127.0.0.1',
    // DATABASE_NAME
    // The name of the database you want the bot to use.
    DATABASE_NAME: process.env.MONGO_DATABASE_NAME || 'XRPL-Discord-Bot-DB',
    // USERS_TABLE
    // The main table where all of the user and wallet data goes.
    USERS_TABLE: process.env.MONGO_USERS_TABLE || 'Users',
  },
  XRPL: {
    // SERVER_URL: The XRPL server addess to use, MUST BE A WEBSOCKET CONNECTION.
    // It is advisable to run your own server and use that instead as the free cluster has
    // quite low rate limits.
    SERVER_URL: process.env.XRPL_SERVER_URL || 'wss://xrplcluster.com/',
    // TOKEN_HASH
    // The token to track. Ideally in the future more than one token will be possible.
    TOKEN_HASH: process.env.XRPL_TOKEN_HASH || 'replace-me',
  },
  SOLOGENIC: {
    // API_URL
    // This should not have to change unless Sologenic change their API.
    API_URL: 'https://api.sologenic.org/api/v1/tickers/24h',
    // FORMATTED_TOKEN
    // In the format "TOKENHASH+ISSUERWALLET/XRP" e.g. "7850697A7A610000000000000000000000000000+rUMwLWFzwcD2topAKsg5NBbhq7dtu4gRCU/XRP"
    FORMATTED_TOKEN: process.env.SOLOGENIC_FORMATTED_TOKEN || 'replace-me',
  },
  DISCORD_ROLES: {
    // ROLES_BY_POINTS
    // Add roles to users based on amount/points holdings
    // Format is an array of objects in the format of { Discord Role ID : points required for that role }
    // For example: [ { '123': 1 }, { '111' : 2 }, { '321' : 99 } ]
    ROLES_BY_POINTS: [
      { '911568176842678302': 1 },
      { '912293092751724564': 8 },
      { '911568252692471838': 25 },
    ],
    // ROLES_BY_TOKEN
    // Reserved for future use.
    ROLES_BY_TOKEN: 'RESERVED FOR FUTURE USE ;)',
  },
  // Using Application Insights is completely optional.
  APPLICATION_INSIGHTS: {
    // ENABLED
    // Turn logging to Application Insights ON/OFF with 'true' or false.
    ENABLED: process.env.AZURE_AI_ENABLED === 'true' ? true : false,
    // KEY
    // Your Application Insights connection string. Required if 'ENABLED' is 'true'.
    KEY: process.env.AZURE_AI_TOKEN || '',
  },
};

export default SETTINGS;
