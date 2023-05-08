import { getTopHolders } from '../data/getTopHolders';
import richlist from './richlist';
import { CommandInteraction } from 'discord.js';
import { jest } from '@jest/globals';

jest.mock('../data/getTopHolders');

describe('richlist interaction logic', () => {
  let interaction: CommandInteraction;
  let payload: any;

  beforeEach(() => {
    interaction = {
      author: { id: '123' },
      commandName: 'richlist',
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

    await richlist(payload);

    expect(interaction.reply).toHaveBeenCalled();
  });

  it('does not call interaction.reply when payload.handled is true', async () => {
    payload.handled = true;

    await richlist(payload);

    expect(interaction.reply).not.toHaveBeenCalled();
  });

  it('calls interaction.reply with top members if all ok', async () => {
    const userName = 'User';
    const discriminator = '123';
    const points = 55;

    (
      getTopHolders as jest.MockedFunction<typeof getTopHolders>
    ).mockReturnValue(
      Promise.resolve([
        {
          discordId: '123456',
          discordUsername: userName,
          discordDiscriminator: discriminator,
          previousDiscordUsername: 'Prev',
          previousDiscordDiscriminator: '333',
          totalPoints: points,
          wallets: [
            { address: 'wallet', points: 50, verified: false },
            { address: 'wallet2', points: 5, verified: true },
          ],
        },
      ])
    );

    await richlist(payload);

    expect(interaction.reply).toHaveBeenCalledWith({
      content: `Top 10 community holders:\n   ${points}\t\t->\t\t${userName}#${discriminator}`,
    });
  });
});
