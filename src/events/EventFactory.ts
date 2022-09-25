// We have a custom emitter so that we can wrap the payload object
// and give it extra properties which can then be used by all listeners
// in the event chain.
import CustomEmitter from './CustomEmitter';

// Import everything that registers listeners into the factory
import Help from '../commands/Help';
import CheckWallet from '../commands/CheckWallet';
import GetRoleUsers from '../commands/GetRoleUsers';
import GetUser from '../commands/GetUser';
import GetWallet from '../commands/GetWallet';
import LinkWallet from '../commands/LinkWallet';
import AdminLinkWallet from '../commands/AdminLinkWallet';
import AdminDeleteWallet from '../commands/AdminDeleteWallet';
import Price from '../commands/Price';
import About from '../commands/About';
import Unknown from '../commands/Unknown';

export default class EventFactory {
  // We only want one singleton instance to prevent memory leaks.
  private static instance: EventFactory;
  // The emitter can be public as it is always the static instance version :)
  public eventEmitter: CustomEmitter;

  private constructor() {
    // Initialise our custom emitter
    this.eventEmitter = new CustomEmitter();

    // Setup all command listeners by giving them the event emitter to add their lister
    // Do note that javascript calls these in order, so top to bottom fired per event.
    // If only typeScript had statics in interfaces this could be much nicer!
    Help.setup(this.eventEmitter);
    CheckWallet.setup(this.eventEmitter);
    GetRoleUsers.setup(this.eventEmitter);
    GetUser.setup(this.eventEmitter);
    GetWallet.setup(this.eventEmitter);
    LinkWallet.setup(this.eventEmitter);
    AdminLinkWallet.setup(this.eventEmitter);
    AdminDeleteWallet.setup(this.eventEmitter);
    Price.setup(this.eventEmitter);
    About.setup(this.eventEmitter);
    Unknown.setup(this.eventEmitter);
  }

  // Return the singleton instance of the CustomEmitter
  public static getInstance() {
    if (!EventFactory.instance) EventFactory.instance = new EventFactory();

    return EventFactory.instance;
  }
}
