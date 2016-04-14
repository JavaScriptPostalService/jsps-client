/**
 * Deny a client access to a channel
 * @function csModDeny
 * @param {string} channel - the channel in which to deny the client from
 * @param {string} client - the client to deny
 * @param {string} secret - the secret key associated with this channel
*/
export const csModDeny = function csModDeny(channel, client, secret) {
  this[this.symbols._encode]({
    channel,
    client,
    secret,
    metadata: {
      time: Date.now(),
      client: this.client,
      commonName: this.commonName,
      type: 'deny',
    },
  }, payload => {
    // Send off the payload to the frontend that will attempt to deny a client
    this.socket.send(payload);
  });
  return this;
};
