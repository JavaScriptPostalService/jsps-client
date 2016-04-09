'use strict';
import {catsnakeConfig} from './config';

import {
  csModClientid,
  csModStringify,
  csModPublish,
  csModInfo,
  csModSubscribe,
  csModGrant,
  csModDeny
} from './modules/core/index';

import {
  csModHistory
} from './modules/persistance/index';

/**
 * Creates a new CatSnake client.
 * @class
 */
class CatSnake {
  /**
   * @constructs CatSnake
   * @param {string} address - the address of the catsnake server
   * @param {object} options - options such as common name and others
   * @param {string} options.commonName - common name of your client
   * @param {boolean} options.bypassThrottle - bypass client side throttling, this does not prevent serverside throttling
   * @param {string} options.clientId - reconnect with an old clientId
   */
  constructor(address, options) {
    this.socket = new WebSocket(address);
    this.socket.binaryType = 'arraybuffer';

    this.connected = false;

    // Genrate a unique clientid
    this.client = (options.clientId) ?
      options.clientId : csModClientid();

    this.commonName = (options.commonName) ?
      options.commonName : config.defaultName;

    this.bypassThrottle = (options.bypassThrottle) ?
      options.bypassThrottle : false;

    // Fired when the connection is made to the server
    this.socket.onopen = event => {
      this.connected = true;

      // Make sure we tell the server we're leaving.
      window.onbeforeunload = () => {
        this.socket.close();
      };
    };
  }

  stringify(data, callback) {
    /**
     * Tries to return a stringified object.
     * @function stringify (internal)
     * @param {object} data - the object to attempt to stringify
     * @callback {string} - Returns a stringified object
    */
    return csModStringify(data, callback, this);
  }

  /**
   * Publishes a message to all subscribers
   * @function publish
   * @param {string} channel - the channel to publish to
   * @param {object} data - the object to publish
   * @param {string} privateKey - optional private key for private channels
  */
  publish(channel, data, privateKey) {
    csModPublish(channel, data, privateKey, this);
  }

  /**
   * List channels, get client info.
   * @function info
   * @param {string} channel - the channel to look at
   * @param {object} data - additional information for request
   * @param {object} opts - additional options for subscriptions
   * @param {string} opts.privateKey - private key used for getting info from private channels
  */
  info(channel, data, opts) {
    csModInfo(channel, data, opts, this);
  }

  /**
   * Get message history from a channel.
   * @function history
   * @param {string} channel - the channel to pull history from
   * @param {number} limit - the ammount of items to pull from history
   * @param {object} opts - options such as privateKeys
   * @param {string} opts.privateKey - private key used for getting history from private channels
  */
  history(channel, limit, opts) {
    csModHistory(channel, limit, opts, this);
  }

  /**
   * Subscribe to a channel
   * @function subscribe
   * @param {string} channel - the channel to subscribe to
   * @param {function} callback - new messages are returned here via msg
   * @param {object} callback.msg - a new payload published to this channel
   * @param {object} opts - additional options for subscriptions
   * @param {string} opts.privateKey - private key used for subscribing to private channels
   * @param {string} opts.noself - subscribe for everything but ignore your own payloads
   * @param {string} opts.accessToken - used as a key to modify private channels. Not to be confused with privateKey
   * @param {string} opts.private - make this channel private, clients can only connect if granted access
  */
  subscribe(channel, callback, opts) {
    csModSubscribe(channel, callback, opts, this);
  }

  /**
   * Deny a client access to a channel
   * @function deny
   * @param {string} channel - the channel in which to deny the client from
   * @param {string} client - the client to deny
   * @param {string} secret - the secret key associated with this channel
  */
  deny(channel, client, secret) {
    return csModDeny(channel, client, secret, this);
  }

  /**
   * Grant a client access to a channel
   * @function grant
   * @param {string} channel - the channel in which to grant the client access to
   * @param {string} client - the client to grant access
   * @param {string} secret - the secret key associated with this channel
  */
  grant(channel, client, secret) {
    return cdModGrant(channel, client, secret, this);
  }
}
