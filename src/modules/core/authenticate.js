/**
 * Grant a client access to a private server
 * @function csModAuthenticate
 * @param {string} secret - the secret key for the private server
 * @param {this} _this - this inheratance
*/
export const csModAuthenticate = (secret, _this) => {
  // If we're connected, let's go ahead and publish our payload.
  if (_this.connected) {
    // Safely stringify our data before sending it to the server.
    _this.stringify({
      metadata: {
        time: Date.now(),
        client: _this.client,
        commonName: _this.commonName,
        type: 'authenticate',
        secret,
      },
    }, payload => {
      // Send off the payload to the frontend that will attempt to deny a client
      _this.socket.send(payload);
    });
  } else {
    // Something is wrong and we're not connected yet, let's try again later.
    console.warn('Failed to connect, attempting again in 1 second.');
    setTimeout(() => {
      // call self with the same params that were initially passed.
      _this.authenticate(secret);
    }, 500);
  }
};
