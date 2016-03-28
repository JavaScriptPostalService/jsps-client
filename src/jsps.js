'use strict';

import {
  mod_clientid,
  mod_stringify,
  mod_publish,
  mod_clients,
  mod_subscribe
} from './modules/core/index';

class jsps {
  constructor(address, options) {
    this.socket = new WebSocket(address);
    this.connected = false;
    this.client = this.clientid();
    this.commonName = (options.commonName) ? options.commonName : 'A Random Postman.';

    this.socket.onopen = event => {
      this.connected = true;
      window.onbeforeunload = () => {
        this.socket.close();
      };
    }
  }

  clientid() {
    return mod_clientid();
  }

  stringify(data, cb) {
    return mod_stringify(data, cb);
  }

  publish(channel, data, privateKey) {
    mod_publish(channel, data, privateKey, this);
  }

  clients(channel, data, opts) {
    mod_clients(channel, data, opts, this);
  }

  subscribe(channel, cb, opts) {
    mod_subscribe(channel, cb, opts, this);
  }
};
