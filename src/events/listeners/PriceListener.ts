import { EventTypes } from '../BotEvents';
import price from '../../commands/price';

export default class PriceListener {
  public static setup(eventEmitter: any): void {
    eventEmitter.addListener(EventTypes.INTERACTION, price);
  }
}
