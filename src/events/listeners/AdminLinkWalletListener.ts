import { EventTypes } from '../BotEvents';
import adminLinkWallet from '../../commands/adminLinkWallet';

export default class AdminLinkWalletListener {
  public static setup(eventEmitter: any): void {
    eventEmitter.addListener(EventTypes.MESSAGE, adminLinkWallet);
  }
}
