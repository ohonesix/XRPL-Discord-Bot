import { EventTypes } from '../BotEvents';
import GetWalletListener from './GetWalletListener';
import CustomEmitter from '../CustomEmitter';
import getWallet from '../../commands/getWallet';

describe('GetWalletListener', () => {
  let mockEventEmitter: CustomEmitter;

  beforeAll(() => {
    mockEventEmitter = {
      addListener: jest.fn(),
      emitPayload: jest.fn(),
    };
  });

  test('setup registers a listener on given EventEmitter', () => {
    GetWalletListener.setup(mockEventEmitter);
    expect(mockEventEmitter.addListener).toHaveBeenCalledWith(
      EventTypes.MESSAGE,
      getWallet
    );
  });
});
