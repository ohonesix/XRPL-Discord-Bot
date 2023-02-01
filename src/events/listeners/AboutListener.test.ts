import { EventTypes } from '../BotEvents';
import AboutListener from './AboutListener';
import CustomEmitter from '../CustomEmitter';
import about from '../../commands/about';

describe('AboutListener', () => {
  let mockEventEmitter: CustomEmitter;

  beforeEach(() => {
    mockEventEmitter = {
      addListener: jest.fn(),
      emitPayload: jest.fn(),
    };
  });

  test('setup registers a listener on given EventEmitter', () => {
    AboutListener.setup(mockEventEmitter);
    expect(mockEventEmitter.addListener).toHaveBeenCalledWith(
      EventTypes.MESSAGE,
      about
    );
  });
});
