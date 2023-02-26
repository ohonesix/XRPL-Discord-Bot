import getWalletAddress from '../utils/getWalletAddress';
import { linkWalletToDiscordAccount } from '../business/linkWalletToDiscordAccount';
import signIn from '../integration/xumm/signIn';

import {
  eventCallbackOnMessage,
  eventCallbackOnInteraction,
} from './linkWallet';
import {
  CommandInteraction,
  Message,
  MessageOptions,
  MessagePayload,
} from 'discord.js';
import SETTINGS from '../settings';
import { jest } from '@jest/globals';

jest.mock('../utils/getWalletAddress', () => jest.fn());
jest.mock('../business/linkWalletToDiscordAccount');
jest.mock('../integration/xumm/signIn');

const mockWallet = 'rnruxxaTbJUMNtFNBJ7X2xSiy1KE7ajUuH';

describe('linkWallet message logic without XUMM login', () => {
  let message: Message;
  let payload: any;

  beforeEach(() => {
    message = {
      author: { id: '123' },
      content: 'linkwallet ' + mockWallet,
      reply: jest.fn(),
    } as unknown as Message;

    payload = {
      handled: false,
      message,
      messageLowered: 'linkwallet ' + mockWallet,
    };

    SETTINGS.XUMM.ENABLED = false;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('does not call message.reply when payload.handled is true', async () => {
    payload.handled = true;

    await eventCallbackOnMessage(payload);

    expect(message.reply).not.toHaveBeenCalled();
  });

  it('returns error message when wallet address not found', async () => {
    payload.message.content = 'linkwallet';
    payload.messageLowered = 'linkwallet';

    await eventCallbackOnMessage(payload);

    expect(message.reply).toHaveBeenCalledWith(
      `Could not get your wallet address, please check the format and try again for example '/linkwallet WALLETADDRESSHERE'`
    );
  });

  it('calls linkWalletToDiscordAccount when all ok', async () => {
    (
      getWalletAddress as jest.MockedFunction<typeof getWalletAddress>
    ).mockReturnValue(mockWallet);
    const mockSuccessLinked = 'linked ok';
    (
      linkWalletToDiscordAccount as jest.MockedFunction<
        typeof linkWalletToDiscordAccount
      >
    ).mockReturnValue(Promise.resolve(mockSuccessLinked));

    await eventCallbackOnMessage(payload);

    expect(linkWalletToDiscordAccount).toHaveBeenCalledWith(
      mockWallet,
      false,
      payload.message.author,
      payload.client,
      payload.logger
    );
    expect(message.reply).toHaveBeenCalledWith(mockSuccessLinked);
  });
});

describe('linkWallet message logic with XUMM login', () => {
  let message: Message;
  let payload: any;

  beforeEach(() => {
    message = {
      author: { id: '123' },
      content: 'linkwallet ' + mockWallet,
      reply: jest.fn(),
    } as unknown as Message;

    payload = {
      handled: false,
      message,
      messageLowered: 'linkwallet ' + mockWallet,
    };

    SETTINGS.XUMM.ENABLED = true;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('does not call message.reply when payload.handled is true', async () => {
    payload.handled = true;

    await eventCallbackOnMessage(payload);

    expect(message.reply).not.toHaveBeenCalled();
  });

  it('returns error message when no response from XUMM', async () => {
    (signIn as jest.MockedFunction<typeof signIn>).mockReturnValue(null);

    await eventCallbackOnMessage(payload);

    expect(message.reply).toHaveBeenCalledWith(
      'Error connecting to xumm, please try again later.'
    );
  });

  it('returns formatted QR code message when given from XUMM', async () => {
    const mockSignInUrl = 'https://ohonesix.com';
    (signIn as jest.MockedFunction<typeof signIn>).mockReturnValue(
      Promise.resolve({
        signInQrUrl: mockSignInUrl,
      })
    );

    const options: MessageOptions = {
      content: `Scan the QR code using your xumm wallet or visit ${mockSignInUrl}`,
      embeds: [
        {
          image: {
            url: mockSignInUrl,
          },
        },
      ],
      reply: { messageReference: payload.message },
    };
    const replyPayload = new MessagePayload(payload.message, options);

    await eventCallbackOnMessage(payload);

    expect(message.reply).toHaveBeenCalledWith(replyPayload);
  });
});

describe('linkWallet interaction logic without XUMM login', () => {
  let interaction: CommandInteraction;
  let payload: any;

  beforeEach(() => {
    interaction = {
      user: { id: '123' },
      commandName: 'linkwallet',
      options: {
        getString: jest.fn(),
      },
      reply: jest.fn(),
    } as unknown as CommandInteraction;

    payload = {
      handled: false,
      interaction,
    };

    SETTINGS.XUMM.ENABLED = false;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('does not call interaction.reply when payload.handled is true', async () => {
    payload.handled = true;

    await eventCallbackOnInteraction(payload);

    expect(interaction.reply).not.toHaveBeenCalled();
  });

  it('returns error message when wallet address not found', async () => {
    await eventCallbackOnInteraction(payload);

    expect(interaction.reply).toHaveBeenCalledWith({
      content: `Could not get your wallet address, please check the format and try again for example '/linkwallet WALLETADDRESSHERE'`,
      ephemeral: true,
    });
  });

  it('calls linkWalletToDiscordAccount when all ok', async () => {
    (
      getWalletAddress as jest.MockedFunction<typeof getWalletAddress>
    ).mockReturnValue(mockWallet);
    const mockSuccessLinked = 'linked ok';
    (
      linkWalletToDiscordAccount as jest.MockedFunction<
        typeof linkWalletToDiscordAccount
      >
    ).mockReturnValue(Promise.resolve(mockSuccessLinked));

    await eventCallbackOnInteraction(payload);

    expect(linkWalletToDiscordAccount).toHaveBeenCalledWith(
      mockWallet,
      false,
      payload.interaction.user,
      payload.client,
      payload.logger
    );
    expect(interaction.reply).toHaveBeenCalledWith({
      content: mockSuccessLinked,
      ephemeral: true,
    });
  });
});

describe('linkWallet interaction logic with XUMM login', () => {
  let interaction: CommandInteraction;
  let payload: any;

  beforeEach(() => {
    interaction = {
      user: { id: '123' },
      commandName: 'linkwallet',
      options: {
        getString: jest.fn(),
      },
      reply: jest.fn(),
    } as unknown as CommandInteraction;

    payload = {
      handled: false,
      interaction,
    };

    SETTINGS.XUMM.ENABLED = true;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('does not call interaction.reply when payload.handled is true', async () => {
    payload.handled = true;

    await eventCallbackOnInteraction(payload);

    expect(interaction.reply).not.toHaveBeenCalled();
  });

  it('returns error message when no response from XUMM', async () => {
    (signIn as jest.MockedFunction<typeof signIn>).mockReturnValue(null);

    await eventCallbackOnInteraction(payload);

    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'Error with XUMM, please try again later.',
      ephemeral: true,
    });
  });

  it('returns formatted QR code message when given from XUMM', async () => {
    const mockSignInUrl = 'https://ohonesix.com';
    (signIn as jest.MockedFunction<typeof signIn>).mockReturnValue(
      Promise.resolve({
        signInQrUrl: mockSignInUrl,
      })
    );

    await eventCallbackOnInteraction(payload);

    expect(interaction.reply).toHaveBeenCalledWith({
      content: `Scan the QR code using your xumm wallet or visit ${mockSignInUrl}`,
      embeds: [
        {
          image: {
            url: mockSignInUrl,
          },
        },
      ],
      ephemeral: true,
    });
  });
});
