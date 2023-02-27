import { EventTypes } from '../BotEvents';
import adminDeleteWallet from '../../commands/adminDeleteWallet';

export default class AdminDeleteWalletListener {
  public static setup(eventEmitter: any): void {
    eventEmitter.addListener(EventTypes.MESSAGE, adminDeleteWallet);
  }
}
