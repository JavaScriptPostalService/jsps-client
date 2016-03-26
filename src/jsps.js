'use strict';

class jsps {
  constructor(address, options) {
    this.socket = new WebSocket(address);
    this.connected = false;
    this.client = this.clientid();
    this.commonName = (options.commonName) ? options.commonName : 'Anonymous';
    this.socket.onopen = event => {
      this.connected = true;
    }
  }

  clientid() {
    let d = new Date().getTime();
    let uuid = 'client-xxxxxxxxxxxxxxxx'.replace(/[xy]/g, c => {
        var r = (d + Math.random() * 16 ) % 16 | 0;
        d = Math.floor(d/16);
        return (c == 'x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  };

  stringify(data, cb) {
    try {
      cb(
        JSON.stringify(data)
      );
    } catch(e) {
      console.warn('attempted to send invalid data to the pubsub server.');
    }
  }

  publish(channel, data, privateKey) {
    // If we're connected, let's go ahead and publish our payload.
    if (this.connected) {
      // Safely stringify our data before sending it to the server.
      this.stringify({
        channel,
        privateKey,
        payload: data,
        metadata: {
          time: Date.now(),
          client: this.client,
          commonName: this.commonName,
          type: 'publish'
        }
      }, payload => {
        this.socket.send(payload);
      });
    } else {
      // Crap, Something is wrong and we're not connected yet, let's try again later.
      console.warn('Failed to publish, not connected to server, attempting again in 1 second.');
      setTimeout(() => {
        this.publish(channel, data, privateKey);
      }, 500);
    }
  }

  clients(channel, data, privateKey) {
    // If we're connected, let's go ahead and publish our payload.
    if (this.connected) {
      // Safely stringify our data before sending it to the server.
      this.stringify({
        channel,
        privateKey,
        payload: data,
        metadata: {
          time: Date.now(),
          client: this.client,
          commonName: this.commonName,
          type: 'clients'
        }
      }, payload => {
        this.socket.send(payload);
      });
    } else {
      // Crap, Something is wrong and we're not connected yet, let's try again later.
      console.warn('Failed to publish, not connected to server, attempting again in 1 second.');
      setTimeout(() => {
        this.clients(channel, data, privateKey);
      }, 500);
    }
  }

  subscribe(channel, cb, privateKey) {
    if (this.connected) {
      // Safely stringify our data before sending it to the server.
      this.stringify({
        channel,
        privateKey,
        metadata: {
          time: Date.now(),
          client: this.client,
          commonName: this.commonName,
          type: 'subscribe'
        }
      }, payload => {
        this.socket.send(payload);
        this.socket.onmessage = function (msg) {
          if (JSON.parse(msg.data).channel === channel) {
            cb(JSON.parse(msg.data));
          }
        };
      });
    } else {
      // Crap, Something is wrong and we're not connected yet, let's try again later.
      console.warn('Failed to publish, not connected to server, attempting again in 1 second.');
      setTimeout(() => {
        this.subscribe(channel, cb, privateKey);
      }, 500);
    }
  }
};
