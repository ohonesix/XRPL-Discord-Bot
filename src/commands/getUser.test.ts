import getUser from './getUser';
import isAdmin from '../utils/isAdmin';
import getWalletAddress from '../utils/getWalletAddress';
import { getUsersForWallet } from '../data/getUsersForWallet';
import { Message } from 'discord.js';

jest.mock('../utils/isAdmin', () => jest.fn());
jest.mock('../utils/getWalletAddress');
jest.mock('../data/getUsersForWallet');

const mockWallet = 'rnruxxaTbJUMNtFNBJ7X2xSiy1KE7ajUuH';

describe('getUser command logic', () => {
  let message: Message;
  let payload: any;

  beforeEach(() => {
    message = {
      author: { id: '123' },
      content: 'get user ' + mockWallet,
      reply: jest.fn(),
    } as unknown as Message;

    payload = {
      handled: false,
      message,
      messageLowered: 'get user ' + mockWallet,
    };

    (isAdmin as jest.MockedFunction<typeof isAdmin>).mockReturnValue(true);
    (
      getWalletAddress as jest.MockedFunction<typeof getWalletAddress>
    ).mockReturnValue(mockWallet);
    (
      getUsersForWallet as jest.MockedFunction<typeof getUsersForWallet>
    ).mockReturnValue(
      Promise.resolve([
        {
          discordId: '1234',
          discordUsername: 'userone',
          discordDiscriminator: '123',
          previousDiscordUsername: 'Prev',
          previousDiscordDiscriminator: '333',
          totalPoints: 0,
          wallets: [{ address: mockWallet, points: 42, verified: false }],
        },
        {
          discordId: '32113',
          discordUsername: 'usertwo',
          discordDiscriminator: '999',
          previousDiscordUsername: 'Other',
          previousDiscordDiscriminator: '123',
          totalPoints: 0,
          wallets: [{ address: mockWallet, points: 42, verified: false }],
        },
      ])
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('does not reply when payload.handled is true', async () => {
    payload.handled = true;

    await getUser(payload);

    expect(message.reply).not.toHaveBeenCalled();
  });

  it('replies with error message when isAdmin returns false', async () => {
    (isAdmin as jest.MockedFunction<typeof isAdmin>).mockReturnValue(false);

    await getUser(payload);

    expect(message.reply).toHaveBeenCalledWith(
      'Sorry you are not authorised to do that.'
    );
  });

  it('replies with error message when user wallet not correct', async () => {
    (
      getWalletAddress as jest.MockedFunction<typeof getWalletAddress>
    ).mockReturnValue(null);

    await getUser(payload);

    expect(message.reply).toHaveBeenCalledWith(
      `Could not parse user wallet address, use format getuser WALLETADDRESSHERE`
    );
  });

  it('replies with error message when no user for wallet address', async () => {
    (
      getUsersForWallet as jest.MockedFunction<typeof getUsersForWallet>
    ).mockReturnValue(null);

    await getUser(payload);

    expect(message.reply).toHaveBeenCalledWith(
      `No stored users for ${mockWallet}, ask them to link their wallet first`
    );
  });

  it('replies with users for wallet address when all okay', async () => {
    await getUser(payload);

    expect(message.reply).toHaveBeenCalledWith(
      `Users(s) for ${mockWallet}:\n  userone#123\t\t Previous Username: Prev#333\n  usertwo#999\t\t Previous Username: Other#123`
    );
  });
});
