/**
 * csModStringify module.
 * @module core/csModStringify
 * @param {object} data - the object to attempt to stringify
 * @callback {function} callback - Returns a stringified object
*/
export const csModStringify = (data, callback) => {
  try {
    callback(
      JSON.stringify(data)
    );
  } catch (e) {
    console.warn('attempted to send invalid data to the pubsub server.');
  }
};
