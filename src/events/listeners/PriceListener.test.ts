import { EventTypes } from '../BotEvents';
import PriceListener from './PriceListener';
import CustomEmitter from '../CustomEmitter';
import price from '../../commands/price';

describe('PriceListener', () => {
  let mockEventEmitter: CustomEmitter;

  beforeAll(() => {
    mockEventEmitter = {
      addListener: jest.fn(),
      emitPayload: jest.fn(),
    };
  });

  test('setup registers a listener on given EventEmitter', () => {
    PriceListener.setup(mockEventEmitter);
    expect(mockEventEmitter.addListener).toHaveBeenCalledWith(
      EventTypes.INTERACTION,
      price
    );
  });
});
