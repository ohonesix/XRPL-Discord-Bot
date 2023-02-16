import { EventTypes } from '../BotEvents';
import GetUserListener from './GetUserListener';
import CustomEmitter from '../CustomEmitter';
import getUser from '../../commands/getUser';

describe('GetUserListener', () => {
  let mockEventEmitter: CustomEmitter;

  beforeAll(() => {
    mockEventEmitter = {
      addListener: jest.fn(),
      emitPayload: jest.fn(),
    };
  });

  test('setup registers a listener on given EventEmitter', () => {
    GetUserListener.setup(mockEventEmitter);
    expect(mockEventEmitter.addListener).toHaveBeenCalledWith(
      EventTypes.MESSAGE,
      getUser
    );
  });
});
