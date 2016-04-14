/**
 * csModInfo module.
 * @module core/csModInfo
 * @param {string} channel - the channel to look at
 * @param {object} data - additional information for request
 * @param {object} opts - additional options for subscriptions
*/
export const csModInfo = function csModInfo(channel, data, opts) {
  // Since options are optional, if there are no options passed, we'll drop in
  // an empty object if options are false or undefined. This will help fix top
  // level null or undefined exceptions.
  const options = opts || {};
  const privateKey = options.privateKey || false;


  // Safely stringify our data before sending it to the server.
  this[this.symbols._encode]({
    channel,
    privateKey,
    payload: data,
    metadata: {
      time: Date.now(),
      client: this.client,
      commonName: this.commonName,
      type: 'info',
    },
  }, payload => {
    // Send off the payload to the frontend that will request channel info
    this.socket.send(payload);
  });
  return this;
};
