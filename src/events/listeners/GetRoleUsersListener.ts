import { EventTypes } from '../BotEvents';
import getRoleUsers from '../../commands/getRoleUsers';

export default class GetRoleUsersListener {
  public static setup(eventEmitter: any): void {
    eventEmitter.addListener(EventTypes.MESSAGE, getRoleUsers);
  }
}
