import { EventTypes } from '../BotEvents';
import CustomEmitter from '../CustomEmitter';
import startFarming from '../../commands/startFarming';
import StartFarmingListener from './StartFarmingListener';

describe('StartFarmingListener', () => {
  let mockEventEmitter: CustomEmitter;

  beforeAll(() => {
    mockEventEmitter = {
      addListener: jest.fn(),
      emitPayload: jest.fn(),
    };
  });

  test('setup registers a listener on given EventEmitter', () => {
    StartFarmingListener.setup(mockEventEmitter);
    expect(mockEventEmitter.addListener).toHaveBeenCalledWith(
      EventTypes.MESSAGE,
      startFarming
    );
  });
});
