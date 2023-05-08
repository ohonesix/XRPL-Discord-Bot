import help from './help';
import { Message } from 'discord.js';
import isAdmin from '../utils/isAdmin';
import isFarmingEnabled from '../utils/isFarmingEnabled';
import SETTINGS from '../settings';

jest.mock('../utils/isAdmin', () => jest.fn());
jest.mock('../utils/isFarmingEnabled', () => jest.fn());

describe('help command logic', () => {
  let message: Message;
  let payload: any;

  beforeEach(() => {
    message = {
      author: { id: '123' },
      content: 'help',
      reply: jest.fn(),
    } as unknown as Message;

    payload = {
      handled: false,
      message,
      messageLowered: 'help',
    };

    (isAdmin as jest.MockedFunction<typeof isAdmin>).mockReturnValue(false);
    (
      isFarmingEnabled as jest.MockedFunction<typeof isFarmingEnabled>
    ).mockReturnValue(false);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('calls message.reply when payload.handled is false', async () => {
    payload.handled = false;

    await help(payload);

    expect(message.reply).toHaveBeenCalled();
  });

  it('does not reply when payload.handled is true', async () => {
    payload.handled = true;

    await help(payload);

    expect(message.reply).not.toHaveBeenCalled();
  });

  it('Responds to help message for non admin user without admin commands', async () => {
    (isAdmin as jest.MockedFunction<typeof isAdmin>).mockReturnValue(false);

    const reply = `You can
  - Link a wallet to your account using: 'linkwallet WALLETADDRESSHERE'
  - Check wallet points using: 'checkwallet WALLETADDRESSHERE'
  `;

    await help(payload);

    expect(message.reply).toHaveBeenCalledWith(reply);
  });

  it('Responds to help message for admin user with admin commands', async () => {
    (isAdmin as jest.MockedFunction<typeof isAdmin>).mockReturnValue(true);

    let reply = `You can
  - Link a wallet to your account using: 'linkwallet WALLETADDRESSHERE'
  - Check wallet points using: 'checkwallet WALLETADDRESSHERE'
  `;
    reply += `\nAdmin commands
    - Link a wallet to user account using: 'adminlinkwallet WALLETADDRESSHERE DISCORDUSER#NUMBER'
    - Delete a wallet from the system using: 'admindeletewallet WALLETADDRESSHERE'
    - Get all users in a role using: 'getroleusers ROLENAME'
    - Get a user's wallet address using: 'getwallet DISCORDUSER#NUMBER'
    - Get a wallet user by address using: 'getuser WALLETADDRESSHERE'
    `;

    await help(payload);

    expect(message.reply).toHaveBeenCalledWith(reply);
  });

  it('Responds to help message with farming details when farming enabled', async () => {
    (
      isFarmingEnabled as jest.MockedFunction<typeof isFarmingEnabled>
    ).mockReturnValue(true);

    const reply = `You can
  - Link a wallet to your account using: 'linkwallet WALLETADDRESSHERE'
  - Check wallet points using: 'checkwallet WALLETADDRESSHERE'
  - Start farming for ${SETTINGS.FARMING.EARNINGS_NAME}: 'start farming'
  - Check farming progress: 'check farming'
  - Delete farming progress: 'stop farming'`;

    await help(payload);

    expect(message.reply).toHaveBeenCalledWith(reply);
  });
});
