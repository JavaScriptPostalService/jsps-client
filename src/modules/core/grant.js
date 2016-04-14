/**
 * Grant a client access to a channel
 * @function csModGrant
 * @param {string} channel - the channel in which to grant the client access to
 * @param {string} client - the client to grant access
 * @param {string} secret - the secret key associated with this channel
*/
export const csModGrant = function csModGrant(channel, client, secret) {
  // If we're connected, let's go ahead and publish our payload.
  if (this.connected) {
    // Safely stringify our data before sending it to the server.
    this[this.symbols._encode]({
      channel,
      client,
      secret,
      metadata: {
        time: Date.now(),
        client: this.client,
        commonName: this.commonName,
        type: 'grant',
      },
    }, payload => {
      // Send off the payload to the frontend that will attempt to deny a client
      this.socket.send(payload);
    });
  } else {
    // Something is wrong and we're not connected yet, let's try again later.
    console.warn('Failed to connect, attempting again in 1 second.');
    setTimeout(() => {
      // call self with the same params that were initially passed.
      this.grant(channel, client, secret);
    }, 500);
  }

  return this;
};
