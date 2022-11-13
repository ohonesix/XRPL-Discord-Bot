import getWalletAddress from '../utils/getWalletAddress.js';
import { Client, User, MessagePayload, MessageOptions } from 'discord.js';
import { EventTypes, EventPayload } from '../events/BotEvents.js';
import { linkWalletToDiscordAccount } from '../business/linkWalletToDiscordAccount.js';
import signIn from '../integration/xumm/signIn.js';
import SETTINGS from '../settings.js';

const linkWallet = async (
  message: string,
  user: User,
  client: Client,
  LOGGER: any
): Promise<string> => {
  if (SETTINGS.XUMM.ENABLED) {
    const loginResponse = await signIn(user.id);
    if (loginResponse.signInQrUrl) {
      return loginResponse.signInQrUrl;
    }

    return null;
  } else {
    // Get their address
    const walletAddress = getWalletAddress(message);

    if (!walletAddress) {
      return `Could not get your wallet address, please check the format and try again for example '/linkwallet WALLETADDRESSHERE'`;
    }

    return await linkWalletToDiscordAccount(
      walletAddress,
      false, // not verified using typed address approach
      user,
      client,
      LOGGER
    );
  }
};

const eventCallbackOnMessage = async (payload: EventPayload) => {
  if (payload.handled) {
    return;
  }

  if (
    payload.messageLowered.includes('link wallet') ||
    payload.messageLowered.includes('linkwallet')
  ) {
    payload.handled = true;

    const result = await linkWallet(
      payload.message.content,
      payload.message.author,
      payload.client,
      payload.logger
    );

    // Standard text based flow
    if (!SETTINGS.XUMM.ENABLED) {
      return payload.message.reply(result);
    }

    // Error with xumm setup
    if (result === null) {
      return payload.message.reply(
        'Error connecting to xumm, please try again later.'
      );
    }

    // We have a QR code url to return for the xumm login
    const options: MessageOptions = {
      content: 'Scan the QR code using your xumm wallet',
      embeds: [
        {
          image: {
            url: result,
          },
        },
      ],
      reply: { messageReference: payload.message },
    };
    const replyPayload = new MessagePayload(payload.message, options);
    return payload.message.reply(replyPayload);
  }
};

const eventCallbackOnInteraction = async (payload: EventPayload) => {
  if (payload.handled) {
    return;
  }

  if (payload.interaction.commandName === 'linkwallet') {
    payload.handled = true;

    await payload.interaction.reply({
      content: await linkWallet(
        payload.interaction.options.getString('wallet-address'),
        payload.interaction.user,
        payload.client,
        payload.logger
      ),
      ephemeral: true,
    });
    return;
  }
};

export default class LinkWallet {
  public static setup(eventEmitter: any): void {
    eventEmitter.addListener(EventTypes.MESSAGE, eventCallbackOnMessage);

    eventEmitter.addListener(
      EventTypes.INTERACTION,
      eventCallbackOnInteraction
    );
  }
}
