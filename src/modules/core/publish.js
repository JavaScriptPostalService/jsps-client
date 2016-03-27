export const publish = (channel, data, privateKey, _this) => {
  // If we're connected, let's go ahead and publish our payload.
  if (_this.connected) {
    // Safely stringify our data before sending it to the server.
    _this.stringify({
      channel,
      privateKey,
      payload: data,
      metadata: {
        time: Date.now(),
        client: _this.client,
        commonName: _this.commonName,
        type: 'publish'
      }
    }, payload => {
      _this.socket.send(payload);
    });
  } else {
    // Crap, Something is wrong and we're not connected yet, let's try again later.
    console.warn('Failed to publish, not connected to server, attempting again in 1 second.');
    setTimeout(() => {
      _this.publish(channel, data, privateKey);
    }, 500);
  }
}
