import { EventTypes } from '../BotEvents';
import getUser from '../../commands/getUser';

export default class GetUserListener {
  public static setup(eventEmitter: any): void {
    eventEmitter.addListener(EventTypes.MESSAGE, getUser);
  }
}
