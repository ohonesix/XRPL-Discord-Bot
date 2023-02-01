import { EventTypes } from '../BotEvents';
import getWallet from '../../commands/getWallet';

export default class GetWalletListener {
  public static setup(eventEmitter: any): void {
    eventEmitter.addListener(EventTypes.MESSAGE, getWallet);
  }
}
