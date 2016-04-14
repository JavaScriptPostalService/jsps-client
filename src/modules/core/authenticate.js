/**
 * Grant a client access to a private server
 * @function csModAuthenticate
 * @param {string} secret - the secret key for the private server
*/
export const csModAuthenticate = function csModAuthenticate(secret) {
  this[this.symbols._encode]({
    metadata: {
      time: Date.now(),
      client: this.client,
      commonName: this.commonName,
      type: 'authenticate',
      secret,
    },
  }, payload => {
    // Send off the payload to the frontend that will attempt to deny a client
    this.socket.send(payload);
  });
  return this;
};
