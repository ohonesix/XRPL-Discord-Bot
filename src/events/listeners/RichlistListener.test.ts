import { EventTypes } from '../BotEvents';
import RichlistListener from './RichlistListener';
import CustomEmitter from '../CustomEmitter';
import richlist from '../../commands/richlist';

describe('RichlistListener', () => {
  let mockEventEmitter: CustomEmitter;

  beforeAll(() => {
    mockEventEmitter = {
      addListener: jest.fn(),
      emitPayload: jest.fn(),
    };
  });

  test('setup registers a listener on given EventEmitter', () => {
    RichlistListener.setup(mockEventEmitter);
    expect(mockEventEmitter.addListener).toHaveBeenCalledWith(
      EventTypes.INTERACTION,
      richlist
    );
  });
});
