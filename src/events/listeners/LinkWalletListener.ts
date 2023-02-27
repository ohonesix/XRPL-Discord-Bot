import { EventTypes } from '../BotEvents';
import {
  eventCallbackOnMessage,
  eventCallbackOnInteraction,
} from '../../commands/linkWallet';

export default class LinkWalletListener {
  public static setup(eventEmitter: any): void {
    eventEmitter.addListener(EventTypes.MESSAGE, eventCallbackOnMessage);

    eventEmitter.addListener(
      EventTypes.INTERACTION,
      eventCallbackOnInteraction
    );
  }
}
