import { EventTypes } from '../BotEvents';
import StartFarmingListener from './StartFarmingListener';
import CustomEmitter from '../CustomEmitter';
import startFarming from '../../commands/startFarming';

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
