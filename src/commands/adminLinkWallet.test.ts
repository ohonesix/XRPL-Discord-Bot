import adminLinkWallet from './adminLinkWallet';
import isAdmin from '../utils/isAdmin';
import getWalletAddress from '../utils/getWalletAddress';
import { getWalletHoldings } from '../integration/xrpl/getWalletHoldings';
import { getUserAccountIdByUsername } from '../integration/discord/getUserAccountIdByUsername';
import { updateUserWallet } from '../data/updateUserWallet';
import { updateUserRoles } from '../integration/discord/updateUserRoles';
import getUserNameFromAdminLinkWalletCommand from '../utils/getUserNameFromAdminLinkWalletCommand';

import { Message } from 'discord.js';
import { jest } from '@jest/globals';

jest.mock('../utils/isAdmin');
jest.mock('../integration/discord/getUserAccountIdByUsername');
jest.mock('../data/updateUserWallet');
jest.mock('../integration/discord/updateUserRoles');
jest.mock('../utils/getWalletAddress');
jest.mock('../integration/xrpl/getWalletHoldings');
jest.mock('../utils/getUserNameFromAdminLinkWalletCommand');

const testUser = 'test';
const testTag = '123';
const mockUser = `${testUser}#${testTag}`;
const mockWallet = 'rnruxxaTbJUMNtFNBJ7X2xSiy1KE7ajUuH';
const mockHoldings = 42;

describe('adminLinkWallet command logic', () => {
  let message: Message;
  let payload: any;

  beforeEach(() => {
    message = {
      author: { id: '123' },
      content: `admin link wallet ${mockUser} ${mockWallet}`,
      reply: jest.fn(),
    } as unknown as Message;

    payload = {
      handled: false,
      message,
      messageLowered: `admin link wallet ${mockUser} ${mockWallet}`,
    };

    (isAdmin as jest.MockedFunction<typeof isAdmin>).mockReturnValue(true);
    (
      getWalletAddress as jest.MockedFunction<typeof getWalletAddress>
    ).mockReturnValue(mockWallet);
    (
      getWalletHoldings as jest.MockedFunction<typeof getWalletHoldings>
    ).mockReturnValue(Promise.resolve(mockHoldings));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('does not reply when payload.handled is true', async () => {
    payload.handled = true;

    await adminLinkWallet(payload);

    expect(message.reply).not.toHaveBeenCalled();
  });

  it('replies with error message when isAdmin returns false', async () => {
    (isAdmin as jest.MockedFunction<typeof isAdmin>).mockReturnValue(false);

    await adminLinkWallet(payload);

    expect(message.reply).toHaveBeenCalledWith(
      'Sorry you are not authorised to do that.'
    );
  });

  it('replies with error message when wallet address not found', async () => {
    (
      getWalletAddress as jest.MockedFunction<typeof getWalletAddress>
    ).mockReturnValue(null);

    await adminLinkWallet(payload);

    expect(message.reply).toHaveBeenCalledWith(
      `Could not get their wallet address, please check the format and try again for example 'linkwallet WALLETADDRESSHERE'`
    );
  });

  it('replies with success message when all okay', async () => {
    (
      getUserNameFromAdminLinkWalletCommand as jest.MockedFunction<
        typeof getUserNameFromAdminLinkWalletCommand
      >
    ).mockReturnValue({
      username: testUser,
      tag: testTag,
    });
    (
      updateUserWallet as jest.MockedFunction<typeof updateUserWallet>
    ).mockReturnValue(Promise.resolve(null));
    (
      updateUserRoles as jest.MockedFunction<typeof updateUserRoles>
    ).mockReturnValue(Promise.resolve(null));

    await adminLinkWallet(payload);

    expect(message.reply).toHaveBeenCalledWith(
      `I see their ${mockHoldings} points admin! Linked 🚀`
    );
  });
});
