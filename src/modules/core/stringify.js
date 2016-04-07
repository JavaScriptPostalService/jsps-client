'use strict';

// TODO: we should probably add webpack soon.
import msgpack from '../../../node_modules/msgpack-lite/dist/msgpack.min.js';

/**
 * csModStringify module.
 * @module core/csModStringify
 * @param {object} data - the object to attempt to stringify
 * @callback {function} callback - Returns a stringified object
*/

// A dead simple try catch for stringifying objects. In the future we'd like this
// to somehow minify the string and make for a smaller payload
export const csModStringify = (data, callback) => {
  try {
    callback(
      msgpack.encode(data)
    );
  } catch (e) {
    console.warn('attempted to send invalid data to the pubsub server.');
  }
};
