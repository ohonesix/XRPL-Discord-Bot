// We register a custom event wrapper so that we have something
// that can be passed to subsequent listeners.
// The main reason for this is if we want some events to only
// be handled once this is then possible as the first handling
// listener can set 'handled' to true.
// However this does mean other listeners need to respect if the
// event has been handled themselves.
export default class EventWrapper {
  // The event payload object (whatever it may be)
  public payload: any;
  // If this event has been handled
  public handled: boolean;

  public constructor(payload: any, handled = false) {
    this.payload = payload;
    this.handled = handled;
  }
}
