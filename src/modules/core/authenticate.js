/**
 * Grant a client access to a private server
 * @function csModAuthenticate
 * @param {string} secret - the secret key for the private server
*/
export const csModAuthenticate = function csModAuthenticate(secret) {
  // If we're connected, let's go ahead and publish our payload.
  if (this.connected) {
    // Safely stringify our data before sending it to the server.
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
  } else {
    // Something is wrong and we're not connected yet, let's try again later.
    console.warn('Failed to connect, attempting again in 1 second.');
    setTimeout(() => {
      // call self with the same params that were initially passed.
      this.authenticate(secret);
    }, 500);
  }

  return this;
};
