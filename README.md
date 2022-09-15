# XRPL Discord Bot

WARNING:

This is under active development and is NOT READY to be used in production. There will be fundamental data structure changes which will cause data loss. Rather wait a bit for the stable beta release.

## Setup instructions

See above, it is not that time yet.

## Node

Requires node 16.6.0+ and ca be run with the standard `npm run start` in the root folder. This will start and run the Discord bot only.

The bot project:
listens on port 5880 for

/status

/updateWallets

/updateAccounts

## Docker

More on that once it is ready for use.

## Secrets

Are all saved in /src/settings.ts (although ideally you shouldn't be checking these in to your repo, better to set them as environment variables)

## Adding to your Discord

Use the URL below to add the bot to your Discord server. Notice the client_id needs to be updated

https://discord.com/api/oauth2/authorize?client_id=replace-me&permissions=545394228336&scope=applications.commands%20bot

# Naming

Trying to stick to https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines as long as it makes sense for naming. Although rule 2 is to be ignored IInterface names are preferred.
