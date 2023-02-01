import { EventTypes } from '../BotEvents';
import AdminLinkWalletListener from './AdminLinkWalletListener';
import CustomEmitter from '../CustomEmitter';
import adminLinkWallet from '../../commands/adminLinkWallet';

describe('AdminLinkWalletListener', () => {
  let mockEventEmitter: CustomEmitter;

  beforeAll(() => {
    mockEventEmitter = {
      addListener: jest.fn(),
      emitPayload: jest.fn(),
    };
  });

  test('setup registers a listener on given EventEmitter', () => {
    AdminLinkWalletListener.setup(mockEventEmitter);
    expect(mockEventEmitter.addListener).toHaveBeenCalledWith(
      EventTypes.MESSAGE,
      adminLinkWallet
    );
  });
});
