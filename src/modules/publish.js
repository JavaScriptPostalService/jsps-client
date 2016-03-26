'use strict';

export var publish = function(_this, channel, data, attempt) {
  // If we're connected, let's go ahead and publish our payload.
  if (_this.connected) {
    // It looks like our first attempt failed, let's let them know it went through finally.
    if (attempt) {
      console.log(`Connection established. Successfully sent payload after ${attempt} attempt(s).`);
    }
    // Safely stringify our data before sending it to the server.
    _this.stringify({
      channel,
      payload: data,
      metadata: {
        time: Date.now(),
        client: _this.client
      }
    }, payload => {
      console.log(payload);
      _this.socket.send(payload);
    });
  } else {
    // Crap, Something is wrong and we're not connected yet, let's try again later.
    console.warn('Failed to publish, not connected to server, attempting again in 1 second.');
    setTimeout(() => {
      let attempts = (attempt) ? attempt : 0;
      _this.publish(channel, data, attempts + 1);
    }, 500);
  }
}
