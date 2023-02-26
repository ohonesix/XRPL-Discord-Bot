import about from './about';
import { Message } from 'discord.js';

describe('about command logic', () => {
  let message: Message;
  let payload: any;

  beforeEach(() => {
    message = {
      author: { id: '123' },
      content: 'about',
      reply: jest.fn(),
    } as unknown as Message;

    payload = {
      handled: false,
      message,
      messageLowered: 'about',
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('calls message.reply when payload.handled is false', async () => {
    payload.handled = false;

    await about(payload);

    expect(message.reply).toHaveBeenCalled();
  });

  it('does not reply when payload.handled is true', async () => {
    payload.handled = true;

    await about(payload);

    expect(message.reply).not.toHaveBeenCalled();
  });

  it('Responds to command with detail message', async () => {
    const reply = `Based on the open-source bot https://ohonesix.com/xrpl-discord-bot which is available freely here https://github.com/jacobpretorius/XRPL-Discord-Bot`;

    await about(payload);
    expect(message.reply).toHaveBeenCalledWith(reply);
  });
});
