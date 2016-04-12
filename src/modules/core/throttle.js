import { catsnakeConfig } from '../../config';

/**
 * csModThrottle module.
 * @module core/csModThrottle
 * @param {object} data - the object to attempt to send
 * @param {object} callback - returns data, if acceptable.
*/

const requests = [];
const queue = [];

// Only allow 100 messages per second.
setInterval(() => {
  requests.shift();
}, 1000 / catsnakeConfig.requestsPerSecond);

export const csModThrottle = (data, callback, _this) => {
  if (_this.bypassThrottle) {
    // This client has chosen to bypass throttling, dispatch message
    callback(data);
  } else {
    if (requests.length < catsnakeConfig.requestsPerSecond) {
      if (queue.length) {
        // Take care of any queued requests before sending out new ones.
        callback(queue[0]);
        queue.shift();
      } else {
        // All is good, dispatch the message.
        callback(data);
      }
      requests.push(Date.now());
    } else {
      // The requests are coming in too fast, let's queue this one for later.
      queue.push(data);
      console.warn(`You are trying to send over ${catsnakeConfig.requestsPerSecond} messages per second, check that your application is working correctly.`);
    }
  }
};
