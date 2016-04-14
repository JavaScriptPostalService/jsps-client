import { csModUUID } from '../utils';

/**
 * csModPublish module.
 * @module core/csModPublish
 * @param {string} channel - the channel to publish to
 * @param {object} data - the object to publish
 * @param {string} privateKey - optional private key for private channels
 * @returns {promise} - returns new promise, resolved when server gets message
*/
export const csModPublish = function csModPublish(channel, data, privateKey) {
  return new Promise(resolve => {
    const uuid = csModUUID();
    this[this.symbols._encode]({
      channel,
      privateKey,
      payload: data,
      metadata: {
        time: Date.now(),
        client: this.client,
        commonName: this.commonName,
        id: uuid,
        type: 'publish',
      },
    }, payload => {
      // Send off the payload to the server signifiying we're using a standard publish method.
      this.socket.send(payload);

      // Wait for success message to come back from server
      this[this.symbols._awaitMessage](msg => {
        if (msg.metadata.id === uuid) {
          resolve(msg);
        }
      });
    });
  });
};
