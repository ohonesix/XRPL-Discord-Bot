import getRoleUsers from './getRoleUsers';
import isAdmin from '../utils/isAdmin';
import getRole from '../utils/getRole';
import { getUsersInRole } from '../integration/discord/getUsersInRole';
import { Message, Role } from 'discord.js';

jest.mock('../utils/isAdmin', () => jest.fn());
jest.mock('../utils/getRole');
jest.mock('../integration/discord/getUsersInRole');

const mockRole = 'Role one';

describe('getRoleUsers command logic', () => {
  let message: Message;
  let payload: any;

  beforeEach(() => {
    message = {
      author: { id: '123' },
      content: 'get role users ' + mockRole,
      reply: jest.fn(),
    } as unknown as Message;

    payload = {
      handled: false,
      message,
      messageLowered: 'get role users ' + mockRole,
    };

    (isAdmin as jest.MockedFunction<typeof isAdmin>).mockReturnValue(true);
    (getRole as jest.MockedFunction<typeof getRole>).mockReturnValue(mockRole);
    (
      getUsersInRole as jest.MockedFunction<typeof getUsersInRole>
    ).mockReturnValue(
      Promise.resolve({
        role: {
          name: mockRole,
        } as Role,
        members: ['userOne', 'userTwo'],
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('does not reply when payload.handled is true', async () => {
    payload.handled = true;

    await getRoleUsers(payload);

    expect(message.reply).not.toHaveBeenCalled();
  });

  it('replies with error message when isAdmin returns false', async () => {
    (isAdmin as jest.MockedFunction<typeof isAdmin>).mockReturnValue(false);

    await getRoleUsers(payload);

    expect(message.reply).toHaveBeenCalledWith(
      'Sorry you are not authorised to do that.'
    );
  });

  it('replies with error message when members not found', async () => {
    await getRoleUsers(payload);

    expect(message.reply).toHaveBeenCalledWith(
      `Users in ${mockRole}:\n\nuserOne\nuserTwo`
    );
  });
});
