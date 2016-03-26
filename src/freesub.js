'use strict';

class PubSub {
  constructor(address) {
    this.socket = new WebSocket(address);
    this.connected = false;
    this.client = this.clientid();

    this.socket.onopen = event => {
      this.connected = true;
    }
  }

  clientid() {
    let d = new Date().getTime();
    let uuid = 'client-xxxxxxxx'.replace(/[xy]/g, c => {
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

  publish(channel, data, attempt) {
    // If we're connected, let's go ahead and publish our payload.
    if (this.connected) {
      // It looks like our first attempt failed, let's let them know it went through finally.
      if (attempt) {
        console.log(`Connection established. Successfully sent payload after ${attempt} attempt(s).`);
      }
      // Safely stringify our data before sending it to the server.
      this.stringify({
        channel,
        payload: data,
        metadata: {
          time: Date.now(),
          client: this.client,
          type: 'publish'
        }
      }, payload => {
        this.socket.send(payload);
      });
    } else {
      // Crap, Something is wrong and we're not connected yet, let's try again later.
      console.warn('Failed to publish, not connected to server, attempting again in 1 second.');
      setTimeout(() => {
        let attempts = (attempt) ? attempt : 0;
        this.publish(channel, data, attempts + 1);
      }, 500);
    }
  }

  subscribe(channel, cb, attempt) {
    if (this.connected) {
      // It looks like our first attempt failed, let's let them know it went through finally.
      if (attempt) {
        console.log(`Connection established. Successfully sent payload after ${attempt} attempt(s).`);
      }
      // Safely stringify our data before sending it to the server.
      this.stringify({
        channel,
        metadata: {
          time: Date.now(),
          client: this.client,
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
        let attempts = (attempt) ? attempt : 0;
        this.subscribe(channel, cb, attempts);
      }, 500);
    }
  }
};
