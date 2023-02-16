import { EventTypes } from '../BotEvents';
import LinkWalletListener from './LinkWalletListener';
import CustomEmitter from '../CustomEmitter';
import {
  eventCallbackOnMessage,
  eventCallbackOnInteraction,
} from '../../commands/linkWallet';

describe('LinkWalletListener', () => {
  let mockEventEmitter: CustomEmitter;

  beforeAll(() => {
    mockEventEmitter = {
      addListener: jest.fn(),
      emitPayload: jest.fn(),
    };
  });

  test('setup registers an Interaction listener on given EventEmitter', () => {
    LinkWalletListener.setup(mockEventEmitter);
    expect(mockEventEmitter.addListener).toHaveBeenCalledWith(
      EventTypes.INTERACTION,
      eventCallbackOnInteraction
    );
  });

  test('setup registers an Message listener on given EventEmitter', () => {
    LinkWalletListener.setup(mockEventEmitter);
    expect(mockEventEmitter.addListener).toHaveBeenCalledWith(
      EventTypes.MESSAGE,
      eventCallbackOnMessage
    );
  });
});
