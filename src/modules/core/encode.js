// TODO: we should probably add webpack soon.
import msgpack from '../../../node_modules/msgpack-lite/dist/msgpack.min.js';
import { csModThrottle } from './throttle';

/**
 * csModEncode module.
 * @module core/csModEncode
 * @param {object} data - the object to attempt to encode
 * @callback {function} callback - Returns a stringified object
*/
export const csModEncode = function csModEncode(data, callback) {
  // Client side packet throttling, enforces serverside as well.
  csModThrottle.call(this, data, throttledData => {
    callback(
      msgpack.encode(throttledData)
    );
  });
};
