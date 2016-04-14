/**
 * csModHistory module.
 * @module core/csModHistory
 * @param {string} channel - the channel to pull history from
 * @param {number} limit - the ammount of items to pull from history
 * @param {object} opts - options such as privateKeys
*/
export const csModHistory = function csModHistory(channel, limit, opts) {
  // Since options are optional, if there are no options passed, we'll drop in
  // an empty object if options are false or undefined. This will help fix top
  // level null or undefined exceptions.
  const options = opts || {};
  const privateKey = options.privateKey || false;

  // If we're connected, let's go ahead and publish our payload.
  if (this.connected) {
    // Safely stringify our data before sending it to the server.
    this[this.symbols._encode]({
      channel,
      privateKey,
      limit,
      metadata: {
        time: Date.now(),
        client: this.client,
        commonName: this.commonName,
        type: 'history',
      },
    }, payload => {
      // Send off the payload to the frontend that will request a batch of history
      this.socket.send(payload);
    });
  } else {
    // Something is wrong and we're not connected yet, let's try again later.
    console.warn('Failed to connect, attempting again in 1 second.');
    setTimeout(() => {
      // call self with the same params that were initially passed.
      this.history(channel, limit, opts);
    }, 500);
  }

  return this;
};
