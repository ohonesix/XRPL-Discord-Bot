import stopFarming from './stopFarming';
import { Message } from 'discord.js';
import { jest } from '@jest/globals';
import isFarmingEnabled from '../utils/isFarmingEnabled';
import { getFarmingProgressByDiscordId } from '../data/getFarmingProgressByDiscordId';
import { deleteWalletFarming } from '../data/deleteWalletFarming';
import SETTINGS from '../settings';

jest.mock('../utils/isFarmingEnabled', () => jest.fn());
jest.mock('../data/getFarmingProgressByDiscordId');
jest.mock('../data/deleteWalletFarming');

describe('stopFarming command logic', () => {
  let message: Message;
  let payload: any;
  const userId = '123';

  beforeEach(() => {
    message = {
      author: { id: userId },
      content: 'stop farming',
      reply: jest.fn(),
    } as unknown as Message;

    payload = {
      handled: false,
      message,
      messageLowered: 'stop farming',
    };

    (
      isFarmingEnabled as jest.MockedFunction<typeof isFarmingEnabled>
    ).mockReturnValue(true);

    (
      getFarmingProgressByDiscordId as jest.MockedFunction<
        typeof getFarmingProgressByDiscordId
      >
    ).mockReturnValue(
      Promise.resolve({
        discordId: userId,
        rewardPointsRequired: 1,
        rewardGoalAmount: 10,
        rewardGoalHoursRequired: 168,
        hoursFarmed: 42,
        isActive: true,
        dateStarted: 'date',
      } as IFarming)
    );

    (
      deleteWalletFarming as jest.MockedFunction<typeof deleteWalletFarming>
    ).mockReturnValue(Promise.resolve(0));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('calls message.reply when payload.handled is false', async () => {
    payload.handled = false;

    await stopFarming(payload);

    expect(message.reply).toHaveBeenCalled();
  });

  it('does not reply when payload.handled is true', async () => {
    payload.handled = true;

    await stopFarming(payload);

    expect(message.reply).not.toHaveBeenCalled();
  });

  it('Responds to message with error message is farming disabled', async () => {
    (
      isFarmingEnabled as jest.MockedFunction<typeof isFarmingEnabled>
    ).mockReturnValue(false);

    const reply = 'Sorry farming is not currently enabled.';

    await stopFarming(payload);

    expect(message.reply).toHaveBeenCalledWith(reply);
  });

  it('Responds to message with error message is not farming', async () => {
    (
      getFarmingProgressByDiscordId as jest.MockedFunction<
        typeof getFarmingProgressByDiscordId
      >
    ).mockReturnValue(Promise.resolve(null));

    const reply = 'You are not farming for anything.';

    await stopFarming(payload);

    expect(message.reply).toHaveBeenCalledWith(reply);
  });

  it('Responds to message with error message is delete failed', async () => {
    (
      deleteWalletFarming as jest.MockedFunction<typeof deleteWalletFarming>
    ).mockReturnValue(Promise.resolve(1));

    const reply =
      'Something went wrong trying to delete your farming progress, please contact a mod.';

    await stopFarming(payload);

    expect(message.reply).toHaveBeenCalledWith(reply);
  });

  it('Responds to message with confirmation when all ok', async () => {
    const reply = `Deleted your farming for 10 ${SETTINGS.FARMING.EARNINGS_NAME} at 42 hours farmed.`;

    await stopFarming(payload);

    expect(message.reply).toHaveBeenCalledWith(reply);
  });
});
