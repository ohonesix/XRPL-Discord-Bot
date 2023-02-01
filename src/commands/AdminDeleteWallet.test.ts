import adminDeleteWallet from './adminDeleteWallet';
import getWalletAddress from '../utils/getWalletAddress';
import isAdmin from '../utils/isAdmin';
import { deleteWallet } from '../data/deleteWallet';
import { Message } from 'discord.js';

jest.mock('../utils/getWalletAddress', () => jest.fn());
jest.mock('../utils/isAdmin', () => jest.fn());
jest.mock('../data/deleteWallet', () => ({
  deleteWallet: jest.fn(),
}));

describe('adminDeleteWallet command logic', () => {
  let message: Message;
  let payload: any;

  beforeEach(() => {
    message = {
      author: { id: '123' },
      content: 'admin delete wallet rnruxxaTbJUMNtFNBJ7X2xSiy1KE7ajUuH',
      reply: jest.fn(),
    } as unknown as Message;

    payload = {
      handled: false,
      message,
      messageLowered: 'admin delete wallet rnruxxaTbJUMNtFNBJ7X2xSiy1KE7ajUuH',
    };

    (isAdmin as jest.MockedFunction<typeof isAdmin>).mockReturnValue(true);
    (
      getWalletAddress as jest.MockedFunction<typeof getWalletAddress>
    ).mockReturnValue('rnruxxaTbJUMNtFNBJ7X2xSiy1KE7ajUuH');
    (
      deleteWallet as jest.MockedFunction<typeof deleteWallet>
    ).mockResolvedValue(0);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('calls message.reply when payload.handled is false', async () => {
    payload.handled = false;

    await adminDeleteWallet(payload);

    expect(message.reply).toHaveBeenCalled();
  });

  it('does not call message.reply when payload.handled is true', async () => {
    payload.handled = true;

    await adminDeleteWallet(payload);

    expect(message.reply).not.toHaveBeenCalled();
  });

  it('calls message.reply with error message when isAdmin returns false', async () => {
    (isAdmin as jest.MockedFunction<typeof isAdmin>).mockReturnValue(false);

    await adminDeleteWallet(payload);

    expect(message.reply).toHaveBeenCalledWith(
      'Sorry you are not authorised to do that.'
    );
  });

  it('calls message.reply with error message when getWalletAddress returns undefined', async () => {
    (
      getWalletAddress as jest.MockedFunction<typeof getWalletAddress>
    ).mockReturnValue(undefined);

    await adminDeleteWallet(payload);

    expect(message.reply).toHaveBeenCalledWith(
      "Could not get the wallet address, please check the format and try again for example 'admindeletewallet WALLETADDRESSHERE'"
    );
  });

  it('calls deleteWallet with correct address', async () => {
    await adminDeleteWallet(payload);

    expect(deleteWallet).toHaveBeenCalledWith(
      'rnruxxaTbJUMNtFNBJ7X2xSiy1KE7ajUuH'
    );
  });

  it('calls message.reply with success message if all ok', async () => {
    await adminDeleteWallet(payload);

    expect(message.reply).toHaveBeenCalledWith(
      'Deleted rnruxxaTbJUMNtFNBJ7X2xSiy1KE7ajUuH from my records.'
    );
  });
});
