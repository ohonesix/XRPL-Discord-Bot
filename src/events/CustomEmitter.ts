// tslint:disable-next-line
const EventEmitter = require('eventemitter3');
import EventWrapper from './EventWrapper';

// A simple wrapper that extends the default EventEmitter so
// that we can ensure all emitted events are wrapped in our
// custom 'EventWrapper'.
export default class CustomEmitter extends EventEmitter {
  emitWrapped(event: any, payload: any) {
    const wrapper = new EventWrapper(payload);
    this.emit(event, wrapper);
    return wrapper;
  }
}
