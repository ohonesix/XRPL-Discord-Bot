// We have a custom emitter so that we can wrap the payload object
// and give it extra properties which can then be used by all listeners
// in the event chain.
import CustomEmitter from './CustomEmitter';

// Import everything that registers listeners into the factory
import HelpListener from './listeners/helpListener';
import CheckWalletListener from './listeners/CheckWalletListener';
import GetRoleUsersListener from './listeners/getRoleUsersListener';
import GetUserListener from './listeners/getUserListener';
import GetWalletListener from './listeners/getWalletListener';
import LinkWalletListener from './listeners/linkWalletListener';
import AdminLinkWalletListener from './listeners/AdminLinkWalletListener';
import AdminDeleteWalletListener from './listeners/AdminDeleteWalletListener';
import PriceListener from './listeners/priceListener';
import AboutListener from './listeners/AboutListener';
import UnknownListener from './listeners/unknownListener';

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
    // Sequencing is important if one command word contains another e.g. 'adminlinkwallet' contains the 'linkwallet' command
    // so we need to check for 'adminlinkwallet' first (and set it to handled if that was the command issued).
    HelpListener.setup(this.eventEmitter);
    CheckWalletListener.setup(this.eventEmitter);
    GetRoleUsersListener.setup(this.eventEmitter);
    GetUserListener.setup(this.eventEmitter);
    GetWalletListener.setup(this.eventEmitter);
    AdminLinkWalletListener.setup(this.eventEmitter);
    AdminDeleteWalletListener.setup(this.eventEmitter);
    LinkWalletListener.setup(this.eventEmitter);
    PriceListener.setup(this.eventEmitter);
    AboutListener.setup(this.eventEmitter);
    UnknownListener.setup(this.eventEmitter);
  }

  // Return the singleton instance of the CustomEmitter
  public static getInstance() {
    if (!EventFactory.instance) EventFactory.instance = new EventFactory();

    return EventFactory.instance;
  }
}
