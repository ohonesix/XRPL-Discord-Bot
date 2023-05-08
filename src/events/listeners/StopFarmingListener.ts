import { EventTypes } from '../BotEvents';
import stopFarming from '../../commands/stopFarming';

export default class StopFarmingListener {
  public static setup(eventEmitter: any): void {
    eventEmitter.addListener(EventTypes.MESSAGE, stopFarming);
  }
}
