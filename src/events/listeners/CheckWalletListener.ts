import { EventTypes } from '../BotEvents';
import checkWallet from '../../commands/checkWallet';

export default class CheckWalletListener {
  public static setup(eventEmitter: any): void {
    eventEmitter.addListener(EventTypes.MESSAGE, checkWallet);
  }
}
