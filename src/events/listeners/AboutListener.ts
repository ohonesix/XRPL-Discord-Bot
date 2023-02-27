import { EventTypes } from '../BotEvents';
import about from '../../commands/about';

export default class AboutListener {
  public static setup(eventEmitter: any): void {
    eventEmitter.addListener(EventTypes.MESSAGE, about);
  }
}
