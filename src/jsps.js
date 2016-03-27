'use strict';

import {
  clientid,
  stringify,
  publish,
  clients,
  subscribe
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
    return clientid();
  };

  stringify(data, cb) {
    return stringify(data, cb);
  }

  publish(channel, data, privateKey) {
    publish(channel, data, privateKey, this);
  }

  clients(channel, data, opts) {
    clients(channel, data, opts, this);
  }

  subscribe(channel, cb, opts) {
    subscribe(channel, cb, opts, this);
  }
};
