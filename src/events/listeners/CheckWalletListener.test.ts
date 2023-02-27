import { EventTypes } from '../BotEvents';
import CheckWalletListener from './CheckWalletListener';
import CustomEmitter from '../CustomEmitter';
import checkWallet from '../../commands/checkWallet';

describe('CheckWalletListener', () => {
  let mockEventEmitter: CustomEmitter;

  beforeAll(() => {
    mockEventEmitter = {
      addListener: jest.fn(),
      emitPayload: jest.fn(),
    };
  });

  test('setup registers a listener on given EventEmitter', () => {
    CheckWalletListener.setup(mockEventEmitter);
    expect(mockEventEmitter.addListener).toHaveBeenCalledWith(
      EventTypes.MESSAGE,
      checkWallet
    );
  });
});
