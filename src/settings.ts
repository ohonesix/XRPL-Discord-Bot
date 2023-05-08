const SETTINGS = {
  APP: {
    PORT: process.env.PORT || 5880,
    // MAX_WALLETS
    // How many wallets each user can have at the same time.
    MAX_WALLETS: process.env.MAX_WALLETS || 1,
  },
  DISCORD: {
    // SERVER_ID
    // Your Discord server ID, you can this this by right clicking on the server
    // and choosing 'Copy ID'
    SERVER_ID: process.env.DISCORD_SERVER_ID || 'replace-me',
    // APP_ID
    // Your bot Application ID, you get this from the Discord developer portal
    APP_ID: process.env.DISCORD_APP_ID || 'replace-me',
    // BOT_TOKEN
    // Your bot token, you get this from the Discord developer portal
    BOT_TOKEN: process.env.DISCORD_BOT_TOKEN || 'replace-me',
    // ADMIN_IDS
    // An array of user Discord ID's you want to use the bot's admin commands
    // e.g. [ '123432423', '8754345', '675675375' ]
    ADMIN_IDS: process.env.DISCORD_ADMIN_IDS || ['replace-me'],
    // FARMING specific.
    // Only used if FARMING > ENABLED is set.
    //
    // FARMING_DONE_CHANNEL_ID
    // Where the bot posts the completed Farming messages.
    FARMING_DONE_CHANNEL_ID:
      process.env.DISCORD_FARM_DONE_CHANNEL_ID || 'replace-me',
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
    // FARMING specific.
    // Only used if FARMING > ENABLED is set.
    //
    // FARMING_PROGRESS_TABLE
    // Tracks the in-progress farming timers.
    FARMING_PROGRESS_TABLE:
      process.env.MONGO_FARM_PROGRESS_TABLE || 'FarmingProgress',
    // FARMING_DONE_TABLE
    // Stores the completed/earned farming. Useful for auditing and long term history.
    FARMING_DONE_TABLE: process.env.MONGO_FARM_DONE_TABLE || 'FarmingCompleted',
  },
  XRPL: {
    // SERVER_URL: The XRPL server addess to use, MUST BE A WEBSOCKET CONNECTION.
    // It is advisable to run your own server and use that instead as the free cluster has
    // quite low rate limits.
    SERVER_URL: process.env.XRPL_SERVER_URL || 'wss://xrplcluster.com/',
    // TOKEN_HASH
    // The token to track. Ideally in the future more than one token will be possible.
    // e.g. '7850697A7A610000000000000000000000000000' (or if your token is newer and only
    // has a friendly name use that for example 'GEN'). You can get this from your
    // setup trustline url
    TOKEN_HASH: process.env.XRPL_TOKEN_HASH || 'replace-me',
    // ENABLE_NFT: Turn on tracking NFTs along with tracking the TOKEN_HASH above for points/roles.
    ENABLE_NFT: process.env.XRPL_ENABLE_NFT === 'true' ? true : false,
    // NFT_ISSUER_ADDRESS: The wallet address that issued your NFTs e.g. 'rPmKjm8E4nXJbXiH8PVtBPcRHP8UJeZWhQ'.
    NFT_ISSUER_ADDRESS: process.env.XRPL_NFT_ISSUER_ADDRESS || 'replace-me',
  },
  SOLOGENIC: {
    // API_URL
    // This should not have to change unless Sologenic change their API.
    API_URL: 'https://api.sologenic.org/api/v1/tickers/24h',
    // FORMATTED_TOKEN
    // This is the same Token Hash used above in the XRPL section, followed by a '+' and
    // then the issuing wallet address, then add "/XRP" at the end.
    // In the format "TOKENHASH+ISSUERWALLET/XRP" e.g. "7850697A7A610000000000000000000000000000+rUMwLWFzwcD2topAKsg5NBbhq7dtu4gRCU/XRP"
    FORMATTED_TOKEN: process.env.SOLOGENIC_FORMATTED_TOKEN || 'replace-me',
  },
  XUMM: {
    // ENABLED
    // Turn on the ability to link wallets using XUMM
    ENABLED: process.env.XUMM_ENABLED === 'true' ? true : false,
    // API_KEY
    // You get this when you create the application in the XUMM Developer Console
    API_KEY: 'replace-me',
    // API_SECRET
    // You get this when you create the application in the XUMM Developer Console
    API_SECRET: 'replace-me',
  },
  DISCORD_ROLES: {
    // ROLES_BY_POINTS
    // The roles to give users based on amount/points holdings in their linked wallet(s)
    // Format is an array of objects in the format of { Discord Role ID : points required for that role }
    // For example: [ { '123': 1 }, { '111' : 2 }, { '321' : 99 } ]
    ROLES_BY_POINTS: [
      { 'replace-me': 1 },
      { 'replace-me': 8 },
      { 'replace-me': 25 },
    ],
    // ROLES_BY_TOKEN
    // Reserved for future use.
    ROLES_BY_TOKEN: 'RESERVED FOR FUTURE USE ;)',
  },
  FARMING: {
    // What is farming?
    // Users can be rewarded for keeping x amount of points in their wallet(s) for the farming period of 1 week.
    // For example, a user who has 50 points for 1 week can earn 1 $TOKEN; and a user who has 100 points for 1 week can earn 3 $TOKEN.
    // The bot tracks and checks each farming users' wallet every hour and credits them if their points/holdings match (or exceed) the needed amount
    // for the farming "level" they started the farming at.
    // Once they reach the 1 week point, the $TOKEN are not sent to users automatically, instead the bot posts in an admin/mod only channel so that it can
    // be manually processed by the admins/mods and/or used for other purposes custom to each project e.g. earning custom NFT's.
    //
    // ENABLED
    // Turn on the ability for users to farm for token rewards.
    // For this to work, also check the other farming related settings in the 'DISCORD' section and the 'MONGODB' section of this file.
    ENABLED: process.env.FARMING_ENABLED === 'true' ? true : false,
    // EARNINGS_MAPPING
    // Maps the points/holdings a user needs to keep in their wallet(s) to the amount of $TOKEN they earn after 1 full week of farming (168 hours)
    // e.g. below: 1 point to earn 0.1 $TOKEN, 5 points to earn 1 $TOKEN, and 15 points to earn 5 $TOKEN.
    EARNINGS_MAPPING: {
      1: 0.1,
      5: 1,
      15: 5,
    },
    // EARNINGS_NAME
    // What the bot calls the $TOKEN users earn in DMs to users and updates to the earnings channel.
    EARNINGS_NAME: '$TOKEN',
  },
  // Using Application Insights is completely optional.
  APPLICATION_INSIGHTS: {
    // ENABLED
    // Turn logging to Application Insights ON/OFF with 'true' or false set as environment variable.
    ENABLED: process.env.AZURE_AI_ENABLED === 'true' ? true : false,
    // KEY
    // Your Application Insights connection string. Required if 'ENABLED' above is 'true'.
    KEY: process.env.AZURE_AI_TOKEN || '',
  },
};

export default SETTINGS;
