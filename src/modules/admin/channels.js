/**
 * csModChannels module.
 * @module admin/csModChannels
 * @param {string} channel - the channel to look at
 * @param {object} data - additional information for request
 * @param {object} opts - additional options for subscriptions
*/
export const csModChannels = function csModChannels(adminToken) {
  // If we're connected, let's go ahead and publish our payload.
  return new Promise(resolve => {
    this[this.symbols._encode]({
      adminToken,
      metadata: {
        time: Date.now(),
        client: this.client,
        commonName: this.commonName,
        type: 'channels',
      },
    }, payload => {
      // Send off the payload to the frontend this will request channel info
      this.socket.send(payload);
      this[this.symbols._awaitMessage](msg => {
        if (msg.metadata.type === 'channels') {
          resolve(msg);
        }
      });
    });
  });
};
