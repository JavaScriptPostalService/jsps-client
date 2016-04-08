'use strict';
import {catsnakeConfig} from '../../config';

/**
 * csModThrottle module.
 * @module core/csModThrottle
 * @param {object} data - the object to attempt to send
 * @param {object} callback - returns data, if acceptable.
*/

let requests = [];

// Only allow 100 messages per second.
setInterval(() => {
  requests.shift();
}, 1000 / catsnakeConfig.requestsPerSecond);

export const csModThrottle = (data, callback, _this) => {
  if (_this.bypassThrottle) {
    callback(data);
  } else {
    if (requests.length < catsnakeConfig.requestsPerSecond) {
      requests.push(Date.now());
      callback(data);
    } else {
      console.warn(`You are trying to send over ${catsnakeConfig.requestsPerSecond} messages per second, check that your application is working correctly.`);
    }
  }
};
