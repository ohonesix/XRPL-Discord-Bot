import unknown from './unknown';
import { Message } from 'discord.js';

describe('unknown command logic', () => {
  let message: Message;
  let payload: any;

  beforeEach(() => {
    message = {
      author: { id: '123' },
      content: 'unknown message command',
      reply: jest.fn(),
    } as unknown as Message;

    payload = {
      handled: false,
      message,
      messageLowered: 'unknown message command',
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('calls message.reply when payload.handled is false', async () => {
    payload.handled = false;

    await unknown(payload);

    expect(message.reply).toHaveBeenCalled();
  });

  it('does not call message.reply when payload.handled is true', async () => {
    payload.handled = true;

    await unknown(payload);

    expect(message.reply).not.toHaveBeenCalled();
  });

  it('Responds to message', async () => {
    const reply =
      "I don't know what to do with that, type help or !commands for help";

    await unknown(payload);
    expect(message.reply).toHaveBeenCalledWith(reply);
  });
});
