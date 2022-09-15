// tslint:disable-next-line
const EventEmitter = require('eventemitter3');

// We have a custom emitter so that we can wrap the payload object
// and give it extra properties which can then be used by all listeners
// in the event chain.
import CustomEmitter from './CustomEmitter';

// Import everything that registers listeners into the factory
import HelpCommands from '../business/HelpCommands';
import CheckWallet from '../business/CheckWallet';
import UnknownCommand from '../business/UnknownCommand';

export default class EventFactory {
  // We only want one singleton instance to prevent memory leaks.
  private static instance: EventFactory;
  // The emitter can be public as it is always the static instance version :)
  public eventEmitter: any;

  private constructor() {
    console.log('new EventEmitter');
    // Initialise our custom emitter
    this.eventEmitter = new CustomEmitter();

    // Setup all listeners by giving them the event emitter to add their lister
    // If only typeScript had statics in interfaces this could be much nicer!
    HelpCommands.setup(this.eventEmitter);
    CheckWallet.setup(this.eventEmitter);
    UnknownCommand.setup(this.eventEmitter);
  }

  // Return the singleton instance of the CustomEmitter
  public static getInstance() {
    if (!EventFactory.instance) EventFactory.instance = new EventFactory();

    console.log('existing instance of EventFactory');
    return EventFactory.instance;
  }
}
