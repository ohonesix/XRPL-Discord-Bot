import { EventTypes } from '../BotEvents';
import help from '../../commands/help';

export default class HelpListener {
  public static setup(eventEmitter: any): void {
    eventEmitter.addListener(EventTypes.MESSAGE, help);
  }
}
