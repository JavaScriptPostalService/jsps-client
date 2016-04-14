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
    // If we're connected, let's go ahead and publish our payload.
    if (this.connected) {
      // Safely stringify our data before sending it to the server.
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
    } else {
      // Crap, Something is wrong and we're not connected yet, let's try again later.
      console.warn('Failed to connect, attempting again in 1 second.');
      setTimeout(() => {
        // call self with the same params that were initially passed.
        this.publish(channel, data, privateKey);
      }, 500);
    }
  });
};
