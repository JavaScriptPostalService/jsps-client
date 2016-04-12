/**
 * Grant a client access to a channel
 * @function csModGrant
 * @param {string} channel - the channel in which to grant the client access to
 * @param {string} client - the client to grant access
 * @param {string} secret - the secret key associated with this channel
 * @param {this} _this - this inheratance
*/
export const csModGrant = (channel, client, secret, _this) => {
  // If we're connected, let's go ahead and publish our payload.
  if (_this.connected) {
    // Safely stringify our data before sending it to the server.
    _this.stringify({
      channel,
      client,
      secret,
      metadata: {
        time: Date.now(),
        client: _this.client,
        commonName: _this.commonName,
        type: 'grant',
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
      _this.grant(channel, client, secret);
    }, 500);
  }
};
