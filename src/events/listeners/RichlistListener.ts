import { EventTypes } from '../BotEvents';
import richlist from '../../commands/richlist';

export default class RichlistListener {
  public static setup(eventEmitter: any): void {
    eventEmitter.addListener(EventTypes.INTERACTION, richlist);
  }
}
