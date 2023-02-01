import { EventTypes } from '../BotEvents';
import AdminDeleteWalletListener from './AdminDeleteWalletListener';
import CustomEmitter from '../CustomEmitter';
import adminDeleteWallet from '../../commands/adminDeleteWallet';

describe('AdminDeleteWalletListener', () => {
  let mockEventEmitter: CustomEmitter;

  beforeAll(() => {
    mockEventEmitter = {
      addListener: jest.fn(),
      emitPayload: jest.fn(),
    };
  });

  test('setup registers a listener on given EventEmitter', () => {
    AdminDeleteWalletListener.setup(mockEventEmitter);
    expect(mockEventEmitter.addListener).toHaveBeenCalledWith(
      EventTypes.MESSAGE,
      adminDeleteWallet
    );
  });
});
