'use strict';

import {
  modClientid,
  modStringify,
  modPublish,
  modClients,
  modSubscribe
} from './modules/core/index';

/**
 * Creates a new jsps client.
 * @class
 */
class jsps {
  /**
   * @constructs jsps
   * @param {string} address - the address of the jsps server
   * @param {object} options - options such as common name and others
   */
  constructor(address, options) {
    this.socket = new WebSocket(address);
    this.connected = false;
    this.client = this.clientid();
    this.commonName = (options.commonName) ?
      options.commonName : 'A Random Postman.';

    // Fired when the connection is made to the server
    this.socket.onopen = event => {
      this.connected = true;

      // Make sure we tell the server we're leaving.
      window.onbeforeunload = () => {
        this.socket.close();
      };
    };
  }

  static clientid() {
    /**
     * Returns a new random, unique clientid
     * @function modClientid
     * @return {string} - Returns a new random, unique clientid
    */
    return modClientid();
  }

  static stringify(data, cb) {
    /**
     * Tries to return a stringified object.
     * @function modStringify
     * @param {object} data - the object to attempt to stringify
     * @callback {string} - Returns a stringified object
    */
    return modStringify(data, cb);
  }

  publish(channel, data, privateKey) {
    /**
     * Publishes a message to all subscribers
     * @function modPublish
     * @param {string} channel - the channel to publish to
     * @param {object} data - the object to publish
     * @param {string} privateKey - optional private key for private channels
     * @param {this} this - this inheratance
    */
    modPublish(channel, data, privateKey, this);
  }

  clients(channel, data, opts) {
    /**
     * List all clients
     * @function modClients
     * @param {string} channel - the channel to look at
     * @param {object} data - additional information for request
     * @param {object} opts - additional options for subscriptions
     * @param {this} this - this inheratance
    */
    modClients(channel, data, opts, this);
  }

  subscribe(channel, cb, opts) {
    /**
     * Subscribe to a channel
     * @function modSubscribe
     * @param {string} channel - the channel to subscribe to
     * @callback {function} cb - new messages are returned here via msg
     * @param {object} opts - additional options for subscriptions
     * @param {this} this - this inheratance
    */
    modSubscribe(channel, cb, opts, this);
  }
}
