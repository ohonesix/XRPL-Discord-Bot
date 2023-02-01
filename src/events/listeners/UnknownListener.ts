import { EventTypes } from '../BotEvents';
import unknown from '../../commands/unknown';

export default class HelpListener {
  public static setup(eventEmitter: any): void {
    eventEmitter.addListener(EventTypes.MESSAGE, unknown);
  }
}
