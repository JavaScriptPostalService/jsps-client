'use strict';

import {
  modClientid,
  modStringify,
  modPublish,
  modClients,
  modSubscribe
} from './modules/core/index';

class jsps {
  constructor(address, options) {
    this.socket = new WebSocket(address);
    this.connected = false;
    this.client = this.clientid();
    this.commonName = (options.commonName) ?
      options.commonName : 'A Random Postman.';

    this.socket.onopen = event => {
      this.connected = true;

      window.onbeforeunload = () => {
        this.socket.close();
      };
    };
  }

  static clientid() {
    return modClientid();
  }

  static stringify(data, cb) {
    return modStringify(data, cb);
  }

  publish(channel, data, privateKey) {
    modPublish(channel, data, privateKey, this);
  }

  clients(channel, data, opts) {
    modClients(channel, data, opts, this);
  }

  subscribe(channel, cb, opts) {
    modSubscribe(channel, cb, opts, this);
  }
}
