import { EventTypes } from '../BotEvents';
import StopFarmingListener from './StopFarmingListener';
import CustomEmitter from '../CustomEmitter';
import stopFarming from '../../commands/stopFarming';

describe('StopFarmingListener', () => {
  let mockEventEmitter: CustomEmitter;

  beforeAll(() => {
    mockEventEmitter = {
      addListener: jest.fn(),
      emitPayload: jest.fn(),
    };
  });

  test('setup registers a listener on given EventEmitter', () => {
    StopFarmingListener.setup(mockEventEmitter);
    expect(mockEventEmitter.addListener).toHaveBeenCalledWith(
      EventTypes.MESSAGE,
      stopFarming
    );
  });
});
