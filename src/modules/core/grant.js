/**
 * Grant a client access to a channel
 * @function csModGrant
 * @param {string} channel - the channel in which to grant the client access to
 * @param {string} client - the client to grant access
 * @param {string} secret - the secret key associated with this channel
*/
export const csModGrant = function csModGrant(channel, client, secret) {
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

  return this;
};
