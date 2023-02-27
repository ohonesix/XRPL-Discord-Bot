import getWallet from './getWallet';
import isAdmin from '../utils/isAdmin';
import getUserNameFromGetWalletCommand from '../utils/getUserNameFromGetWalletCommand';
import { getWalletsForUser } from '../data/getWalletsForUser';
import { getUserAccountIdByUsername } from '../integration/discord/getUserAccountIdByUsername';
import { Message } from 'discord.js';

jest.mock('../utils/isAdmin', () => jest.fn());
jest.mock('../utils/getUserNameFromGetWalletCommand');
jest.mock('../data/getWalletsForUser');
jest.mock('../integration/discord/getUserAccountIdByUsername');

const testUser = 'test';
const testTag = '123';
const testUserFormatted = `${testUser}#${testTag}`;
const mockWallet = 'rnruxxaTbJUMNtFNBJ7X2xSiy1KE7ajUuH';

describe('getWallet command logic', () => {
  let message: Message;
  let payload: any;

  beforeEach(() => {
    message = {
      author: { id: '123' },
      content: 'get wallet ' + testUserFormatted,
      reply: jest.fn(),
    } as unknown as Message;

    payload = {
      handled: false,
      message,
      messageLowered: 'get wallet ' + testUserFormatted,
    };

    (isAdmin as jest.MockedFunction<typeof isAdmin>).mockReturnValue(true);
    (
      getUserNameFromGetWalletCommand as jest.MockedFunction<
        typeof getUserNameFromGetWalletCommand
      >
    ).mockReturnValue({ username: testUser, tag: testTag });
    (
      getWalletsForUser as jest.MockedFunction<typeof getWalletsForUser>
    ).mockReturnValue(
      Promise.resolve([
        {
          discordId: testUserFormatted,
          discordUsername: testUser,
          discordDiscriminator: testTag,
          previousDiscordUsername: 'Prev',
          previousDiscordDiscriminator: '333',
          totalPoints: 0,
          wallets: [
            { address: mockWallet, points: 42, verified: false },
            { address: mockWallet + '1', points: 12, verified: true },
          ],
        },
      ])
    );
    (
      getUserAccountIdByUsername as jest.MockedFunction<
        typeof getUserAccountIdByUsername
      >
    ).mockReturnValue(Promise.resolve(testUserFormatted));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('does not reply when payload.handled is true', async () => {
    payload.handled = true;

    await getWallet(payload);

    expect(message.reply).not.toHaveBeenCalled();
  });

  it('replies with error message when isAdmin returns false', async () => {
    (isAdmin as jest.MockedFunction<typeof isAdmin>).mockReturnValue(false);

    await getWallet(payload);

    expect(message.reply).toHaveBeenCalledWith(
      'Sorry you are not authorised to do that.'
    );
  });

  it('replies with error message when user not found', async () => {
    (
      getWalletsForUser as jest.MockedFunction<typeof getWalletsForUser>
    ).mockReturnValue(null);

    await getWallet(payload);

    expect(message.reply).toHaveBeenCalledWith(
      `No stored users for ${testUserFormatted}, ask them to link their wallet first`
    );
  });

  it('replies with error message when user doesnt match stored user', async () => {
    (
      getUserAccountIdByUsername as jest.MockedFunction<
        typeof getUserAccountIdByUsername
      >
    ).mockReturnValue(Promise.resolve('Someone else'));

    await getWallet(payload);

    expect(message.reply).toHaveBeenCalledWith(
      `⚠ Something weird going on here! The stored wallet details we have don't match the current Discord user ID for ${testUserFormatted}. Proceed with caution`
    );
  });

  it('replies with user wallets when all okay', async () => {
    await getWallet(payload);

    expect(message.reply).toHaveBeenCalledWith(
      `Wallet(s) for ${testUserFormatted}:\n   42\t -> \t${mockWallet}\n   12\t -> \t${
        mockWallet + '1'
      }\t\t Previous Username: Prev#333`
    );
  });
});
