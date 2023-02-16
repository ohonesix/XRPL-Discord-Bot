import { EventTypes } from '../BotEvents';
import HelpListener from './HelpListener';
import CustomEmitter from '../CustomEmitter';
import help from '../../commands/help';

describe('HelpListener', () => {
  let mockEventEmitter: CustomEmitter;

  beforeAll(() => {
    mockEventEmitter = {
      addListener: jest.fn(),
      emitPayload: jest.fn(),
    };
  });

  test('setup registers a listener on given EventEmitter', () => {
    HelpListener.setup(mockEventEmitter);
    expect(mockEventEmitter.addListener).toHaveBeenCalledWith(
      EventTypes.MESSAGE,
      help
    );
  });
});
