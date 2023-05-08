import { EventTypes } from '../BotEvents';
import startFarming from '../../commands/startFarming';

export default class StartFarmingListener {
  public static setup(eventEmitter: any): void {
    eventEmitter.addListener(EventTypes.MESSAGE, startFarming);
  }
}
