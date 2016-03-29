'use strict';

import {
  modClientid,
  modStringify,
  modPublish,
  modInfo,
  modSubscribe
} from './modules/core/index';

import {
  modHistory
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
   */
  constructor(address, options) {
    this.socket = new WebSocket(address);
    this.connected = false;
    this.client = modClientid();
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

  stringify(data, callback) {
    /**
     * Tries to return a stringified object.
     * @function modStringify
     * @param {object} data - the object to attempt to stringify
     * @callback {string} - Returns a stringified object
    */
    return modStringify(data, callback);
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

  info(channel, data, opts) {
    /**
     * List all clients
     * @function modInfo
     * @param {string} channel - the channel to look at
     * @param {object} data - additional information for request
     * @param {object} opts - additional options for subscriptions
     * @param {this} this - this inheratance
    */
    modInfo(channel, data, opts, this);
  }

  history(channel, limit, opts) {
    /**
     * List all clients
     * @function modHistory
     * @param {string} channel - the channel to pull history from
     * @param {number} limit - the ammount of items to pull from history
     * @param {object} opts - options such as privateKeys
     * @param {this} this - this inheratance
    */
    modHistory(channel, limit, opts, this);
  }

  subscribe(channel, callback, opts) {
    /**
     * Subscribe to a channel
     * @function modSubscribe
     * @param {string} channel - the channel to subscribe to
     * @callback {function} callback - new messages are returned here via msg
     * @param {object} opts - additional options for subscriptions
     * @param {this} this - this inheratance
    */
    modSubscribe(channel, callback, opts, this);
  }
}
