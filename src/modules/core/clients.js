export const modClients = (channel, data, opts, _this) => {
  let options = (opts) ? opts : {};
  let privateKey = (options.privateKey) ? options.privateKey : false;

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
        type: 'clients'
      }
    }, payload => {
      _this.socket.send(payload);
    });
  } else {
    // Crap, Something is wrong and we're not connected yet, let's try again later.
    console.warn('Failed to connect, attempting again in 1 second.');
    setTimeout(() => {
      _this.clients(channel, data, privateKey);
    }, 500);
  }
}
