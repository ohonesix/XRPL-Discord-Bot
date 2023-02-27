import { EventTypes } from '../BotEvents';
import UnknownListener from './UnknownListener';
import CustomEmitter from '../CustomEmitter';
import unknown from '../../commands/unknown';

describe('UnknownListener', () => {
  let mockEventEmitter: CustomEmitter;

  beforeAll(() => {
    mockEventEmitter = {
      addListener: jest.fn(),
      emitPayload: jest.fn(),
    };
  });

  test('setup registers a listener on given EventEmitter', () => {
    UnknownListener.setup(mockEventEmitter);
    expect(mockEventEmitter.addListener).toHaveBeenCalledWith(
      EventTypes.MESSAGE,
      unknown
    );
  });
});
