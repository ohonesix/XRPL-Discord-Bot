import startFarming from './startFarming';
import { Message } from 'discord.js';
import { jest } from '@jest/globals';
import isFarmingEnabled from '../utils/isFarmingEnabled';
import { getUserByDiscordId } from '../data/getUserByDiscordId';
import getFarmingEarningsMapping from '../utils/getFarmingEarningsMapping';
import { getFarmingProgressByDiscordId } from '../data/getFarmingProgressByDiscordId';
import { updateWalletFarming } from '../data/updateWalletFarming';
import SETTINGS from '../settings';

jest.mock('../utils/isFarmingEnabled', () => jest.fn());
jest.mock('../utils/getFarmingEarningsMapping', () => jest.fn());
jest.mock('../data/getUserByDiscordId');
jest.mock('../data/getFarmingProgressByDiscordId');
jest.mock('../data/updateWalletFarming');

describe('startFarming command logic', () => {
  let message: Message;
  let payload: any;
  const userId = '123';
  const totalPoints = 55;

  beforeEach(() => {
    message = {
      author: { id: userId },
      content: 'start farming',
      reply: jest.fn(),
    } as unknown as Message;

    payload = {
      handled: false,
      message,
      messageLowered: 'start farming',
    };

    (
      isFarmingEnabled as jest.MockedFunction<typeof isFarmingEnabled>
    ).mockReturnValue(true);

    (
      getUserByDiscordId as jest.MockedFunction<typeof getUserByDiscordId>
    ).mockReturnValue(
      Promise.resolve({
        discordId: userId,
        discordUsername: 'user',
        discordDiscriminator: '4443',
        previousDiscordUsername: null,
        previousDiscordDiscriminator: null,
        totalPoints,
        wallets: null,
      })
    );

    (
      getFarmingProgressByDiscordId as jest.MockedFunction<
        typeof getFarmingProgressByDiscordId
      >
    ).mockReturnValue(Promise.resolve(null));

    (
      getFarmingEarningsMapping as jest.MockedFunction<
        typeof getFarmingEarningsMapping
      >
    ).mockReturnValue({ farmable: 42 });

    (
      updateWalletFarming as jest.MockedFunction<typeof updateWalletFarming>
    ).mockReturnValue(Promise.resolve(0));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('calls message.reply when payload.handled is false', async () => {
    (
      isFarmingEnabled as jest.MockedFunction<typeof isFarmingEnabled>
    ).mockReturnValue(false);

    payload.handled = false;

    await startFarming(payload);

    expect(message.reply).toHaveBeenCalled();
  });

  it('does not reply when payload.handled is true', async () => {
    payload.handled = true;

    await startFarming(payload);

    expect(message.reply).not.toHaveBeenCalled();
  });

  it('Responds to message with error message is farming disabled', async () => {
    (
      isFarmingEnabled as jest.MockedFunction<typeof isFarmingEnabled>
    ).mockReturnValue(false);

    const reply = 'Sorry farming is not currently enabled.';

    await startFarming(payload);

    expect(message.reply).toHaveBeenCalledWith(reply);
  });

  it('Responds to message with error message if user not found', async () => {
    (
      getUserByDiscordId as jest.MockedFunction<typeof getUserByDiscordId>
    ).mockReturnValue(Promise.resolve(null));

    const reply =
      'Could not find your wallet, please link it first with the "linkwallet" command';

    await startFarming(payload);

    expect(message.reply).toHaveBeenCalledWith(reply);
  });

  it('Responds to message with farming status if farming exists. Same as check farming', async () => {
    (
      getFarmingProgressByDiscordId as jest.MockedFunction<
        typeof getFarmingProgressByDiscordId
      >
    ).mockReturnValue(
      Promise.resolve({
        discordId: userId,
        rewardPointsRequired: totalPoints,
        rewardGoalAmount: 42,
        rewardGoalHoursRequired: 168,
        hoursFarmed: 69,
        isActive: true,
        dateStarted: 'date',
      })
    );

    const reply = `You are farming for 42 ${SETTINGS.FARMING.EARNINGS_NAME} at 69 hours out of 168 farmed.`;

    await startFarming(payload);

    expect(message.reply).toHaveBeenCalledWith(reply);
  });

  it('Responds to message with error message if user not able to farm anything', async () => {
    (
      getFarmingEarningsMapping as jest.MockedFunction<
        typeof getFarmingEarningsMapping
      >
    ).mockReturnValue(null);

    const reply =
      "You don't have enough points to earn anything or you don't have a wallet linked. Please link your wallet or wait and try again later.";

    await startFarming(payload);

    expect(message.reply).toHaveBeenCalledWith(reply);
  });

  it('Responds to message with error message if error with starting farming', async () => {
    (
      updateWalletFarming as jest.MockedFunction<typeof updateWalletFarming>
    ).mockReturnValue(Promise.resolve(1));

    const reply = 'Something went wrong, please contact an admin';

    await startFarming(payload);

    expect(message.reply).toHaveBeenCalledWith(reply);
  });

  it('Responds to message with success message if all okay', async () => {
    const reply = `Started your farming timer for 42 ${SETTINGS.FARMING.EARNINGS_NAME}!`;

    await startFarming(payload);

    expect(message.reply).toHaveBeenCalledWith(reply);
  });
});
