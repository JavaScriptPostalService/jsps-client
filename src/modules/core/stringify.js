// TODO: we should probably add webpack soon.
import msgpack from '../../../node_modules/msgpack-lite/dist/msgpack.min.js';
import { csModThrottle } from './throttle';

/**
 * csModStringify module.
 * @module core/csModStringify
 * @param {object} data - the object to attempt to stringify
 * @callback {function} callback - Returns a stringified object
*/

// A dead simple try catch for stringifying objects. In the future we'd like this
// to somehow minify the string and make for a smaller payload
export const csModStringify = (data, callback, _this) => {
  // Client side packet throttling, enforces serverside as well.
  csModThrottle(data, throttledData => {
    callback(
      msgpack.encode(throttledData)
    );
  }, _this);
};
