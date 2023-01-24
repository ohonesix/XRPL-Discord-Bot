import { EventTypes } from '../../dist/events/BotEvents';
import About from '../../dist/commands/About';
import CustomEmitter from '../../dist/events/CustomEmitter';

const eventEmitter = new CustomEmitter();

describe('About Command', () => {
  let mockEventEmitter;

  jest.mock('discord.js', () => {
    const original = jest.requireActual('discord.js');
    return {
      ...original,
      Message: jest.fn().mockImplementation(() => {
        return {
          reply: jest.fn(),
        };
      }),
    };
  });

  beforeEach(() => {
    mockEventEmitter = {
      addListener: jest.fn(),
    };
  });

  test('setup() registers a listener on given EventEmitter', () => {
    About.setup(mockEventEmitter);
    expect(mockEventEmitter.addListener).toHaveBeenCalledWith(
      EventTypes.MESSAGE,
      expect.any(Function)
    );
  });

  test('Responds to command', () => {
    About.setup(eventEmitter);
    const message = { reply: jest.fn() };
    const reply = `Based on the open-source bot https://ohonesix.com/xrpl-discord-bot which is available freely here https://github.com/jacobpretorius/XRPL-Discord-Bot`;

    eventEmitter.emitPayload(
      EventTypes.MESSAGE,
      message,
      'about test',
      null,
      null,
      null
    );
    expect(message.reply).toHaveBeenCalledWith(reply);
  });
});
