import { getTradingDetails } from '../integration/sologenic/getTradingDetails';
import price from './price';
import { CommandInteraction } from 'discord.js';
import SETTINGS from '../settings';
import { jest } from '@jest/globals';

jest.mock('../integration/sologenic/getTradingDetails');

describe('price interaction logic', () => {
  let interaction: CommandInteraction;
  let payload: any;

  beforeEach(() => {
    interaction = {
      author: { id: '123' },
      commandName: 'price',
      reply: jest.fn(),
    } as unknown as CommandInteraction;

    payload = {
      handled: false,
      interaction,
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('calls interaction.reply when payload.handled is false', async () => {
    payload.handled = false;

    await price(payload);

    expect(interaction.reply).toHaveBeenCalled();
  });

  it('does not call interaction.reply when payload.handled is true', async () => {
    payload.handled = true;

    await price(payload);

    expect(interaction.reply).not.toHaveBeenCalled();
  });

  it('calls interaction.reply with error message when network issue', async () => {
    (
      getTradingDetails as jest.MockedFunction<typeof getTradingDetails>
    ).mockReturnValue(Promise.resolve(null));

    await price(payload);

    expect(interaction.reply).toHaveBeenCalledWith({
      content: `Something went wrong getting the details from Sologenic, try 👉 https://sologenic.org/trade?market=${SETTINGS.SOLOGENIC.FORMATTED_TOKEN}&network=mainnet`,
    });
  });

  it('calls interaction.reply with last trading price if all ok', async () => {
    const priceRes = 4.12;
    const volume = 24.01;

    (
      getTradingDetails as jest.MockedFunction<typeof getTradingDetails>
    ).mockReturnValue(Promise.resolve({ price: priceRes, volume }));

    await price(payload);

    expect(interaction.reply).toHaveBeenCalledWith({
      content: `Last traded price: ${priceRes} XRP (volume past 24 hours: ${volume})`,
    });
  });
});
