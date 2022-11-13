import SETTINGS from '../../settings.js';
import { XummTypes, XummSdk } from 'xumm-sdk';
import { Client, MessagePayload, MessageOptions } from 'discord.js';
import { linkWalletToDiscordAccount } from '../../business/linkWalletToDiscordAccount.js';

const xummWebhook = async (body: XummTypes.XummWebhookBody, client: Client) => {
  // Setup the xumm server session
  const xumm = new XummSdk(SETTINGS.XUMM.API_KEY, SETTINGS.XUMM.API_SECRET);

  // We don't trust any random request to the webhook endpoint, so we load the result directly from xumm using the passed in payload guid
  // which a user wouldn't be able to screw with without xumm servers being compromised.
  const resultLogin = await xumm.payload.get(
    body.payloadResponse.payload_uuidv4
  );

  // Decode our original custom meta
  const meta = resultLogin.payload.request_json.custom_meta as any;
  const blob = meta.blob as string;

  // Get the users DiscordId as this happens out of the message context
  const discordId = JSON.parse(blob).userId;

  // Get the Discord User
  const user = await client.users.cache.get(discordId);

  if (!user) {
    // Couldn't get them, nothing more to do here.
    return;
  }

  // The user didn't sign it with xumm, nothing more to do here.
  if (resultLogin.meta.signed === false) {
    return await user.send(
      'The xumm sign in request was rejected. Please try again'
    );
  }

  // Get the users linked wallet address
  const walletAddress = resultLogin.response.account;

  const message = await linkWalletToDiscordAccount(
    walletAddress,
    true, // User is verified when singed using XUMM
    user,
    client,
    null
  );

  return user.send(message);
};

export default xummWebhook;
