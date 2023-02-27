import checkWallet from './checkWallet';
import { getWalletHoldings } from '../integration/xrpl/getWalletHoldings';
import getWalletAddress from '../utils/getWalletAddress';
import { Message } from 'discord.js';
import { jest } from '@jest/globals';

jest.mock('../utils/getWalletAddress', () => jest.fn());
jest.mock('../integration/xrpl/getWalletHoldings');
const mockWallet = 'rnruxxaTbJUMNtFNBJ7X2xSiy1KE7ajUuH';

describe('checkWallet command logic', () => {
  let message: Message;
  let payload: any;

  beforeEach(() => {
    message = {
      author: { id: '123' },
      content: 'check wallet ' + mockWallet,
      reply: jest.fn(),
    } as unknown as Message;

    payload = {
      handled: false,
      message,
      messageLowered: 'check wallet ' + mockWallet,
    };

    (
      getWalletAddress as jest.MockedFunction<typeof getWalletAddress>
    ).mockReturnValue(mockWallet);
    (
      getWalletHoldings as jest.MockedFunction<typeof getWalletHoldings>
    ).mockReturnValue(Promise.resolve(42));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('calls message.reply when payload.handled is false', async () => {
    payload.handled = false;

    await checkWallet(payload);

    expect(message.reply).toHaveBeenCalled();
  });

  it('does not reply when payload.handled is true', async () => {
    payload.handled = true;

    await checkWallet(payload);

    expect(message.reply).not.toHaveBeenCalled();
  });

  it('calls message.reply with error message when trustline not set', async () => {
    (
      getWalletHoldings as jest.MockedFunction<typeof getWalletHoldings>
    ).mockReturnValue(Promise.resolve(-1));

    await checkWallet(payload);

    expect(message.reply).toHaveBeenCalledWith(
      `Seems like the wallet doesn't have the project trustline, please verify the trustline is set and try again 👉 https://xrpscan.com/account/${mockWallet}`
    );
  });

  it('calls message.reply with error message when network issue', async () => {
    (
      getWalletHoldings as jest.MockedFunction<typeof getWalletHoldings>
    ).mockReturnValue(Promise.resolve(null));

    await checkWallet(payload);

    expect(message.reply).toHaveBeenCalledWith(
      `There was an issue getting the wallet holdings from XRPL network, please try later or use 👉 https://xrpscan.com/account/${mockWallet}`
    );
  });

  it('calls message.reply with wallet points message if all ok', async () => {
    await checkWallet(payload);

    expect(message.reply).toHaveBeenCalledWith(
      'The wallet has 42 points 👉 https://xrpscan.com/account/' + mockWallet
    );
  });
});
