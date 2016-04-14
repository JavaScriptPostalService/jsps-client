/**
 * csModOn module.
 * @module core/csModOn
 * @param {function} callback - called when the socket is connected
*/
export const csModOn = function csModOn(callback) {
  if (this.connected) {
    callback();
  } else {
    setTimeout(() => {
      this.on(callback);
    }, 500);
  }
};
