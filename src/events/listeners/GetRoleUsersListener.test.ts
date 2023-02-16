import { EventTypes } from '../BotEvents';
import GetRoleUsersListener from './GetRoleUsersListener';
import CustomEmitter from '../CustomEmitter';
import getRoleUsers from '../../commands/getRoleUsers';

describe('GetRoleUsersListener', () => {
  let mockEventEmitter: CustomEmitter;

  beforeAll(() => {
    mockEventEmitter = {
      addListener: jest.fn(),
      emitPayload: jest.fn(),
    };
  });

  test('setup registers a listener on given EventEmitter', () => {
    GetRoleUsersListener.setup(mockEventEmitter);
    expect(mockEventEmitter.addListener).toHaveBeenCalledWith(
      EventTypes.MESSAGE,
      getRoleUsers
    );
  });
});
