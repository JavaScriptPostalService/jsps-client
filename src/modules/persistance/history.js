/**
 * csModHistory module.
 * @module core/csModHistory
 * @param {string} channel - the channel to pull history from
 * @param {number} limit - the ammount of items to pull from history
 * @param {object} opts - options such as privateKeys
 * @param {this} _this - this inheratance
*/
export const csModHistory = (channel, limit, opts, _this) => {
  // Since options are optional, if there are no options passed, we'll drop in
  // an empty object if options are false or undefined. This will help fix top
  // level null or undefined exceptions.
  const options = opts || {};
  const privateKey = options.privateKey || false;

  // If we're connected, let's go ahead and publish our payload.
  if (_this.connected) {
    // Safely stringify our data before sending it to the server.
    _this.stringify({
      channel,
      privateKey,
      limit,
      metadata: {
        time: Date.now(),
        client: _this.client,
        commonName: _this.commonName,
        type: 'history',
      },
    }, payload => {
      // Send off the payload to the frontend that will request a batch of history
      _this.socket.send(payload);
    });
  } else {
    // Something is wrong and we're not connected yet, let's try again later.
    console.warn('Failed to connect, attempting again in 1 second.');
    setTimeout(() => {
      // call self with the same params that were initially passed.
      _this.history(channel, limit, opts);
    }, 500);
  }
};
