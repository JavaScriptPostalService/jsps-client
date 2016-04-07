'use strict';

// TODO: we should probably add webpack soon.
import msgpack from '../../../node_modules/msgpack-lite/dist/msgpack.min.js';

/**
 * csModSubscribe module.
 * @module core/csModSubscribe
 * @param {string} channel - the channel to subscribe to
 * @callback {function} callback - new messages are returned here via msg
 * @param {object} opts - additional options for subscriptions
 * @param {this} _this - this inheratance
*/
export const csModSubscribe = (channel, callback, opts, _this) => {
  // Since options are optional, if there are no options passed, we'll drop in
  // an empty object if options are false or undefined. This will help fix top
  // level null or undefined exceptions.
  let options = (opts) ? opts : {};

  let privateKey = (options.privateKey) ? options.privateKey : false;

  if (_this.connected) {
    // Safely stringify our data before sending it to the server.
    _this.stringify({
      channel,
      privateKey,
      noself: (options.noself) ? options.noself : false,
      secret: (options.accessToken) ? options.accessToken : false,
      private: (options.private) ? options.private : false,
      metadata: {
        time: Date.now(),
        client: _this.client,
        commonName: _this.commonName,
        type: 'subscribe'
      }
    }, payload => {
      // Send off the payload to the server letting it know we're subscribing to a channel
      _this.socket.send(payload);

      // Whenever the server has new info it will tell us here.
      _this.socket.onmessage = function(msg) {
        let decodedMsg = msgpack.decode(
          new Uint8Array(msg.data)
        );
        if (decodedMsg.channel === channel) {
          callback(decodedMsg);
        }
      };

      // When we go to leave be sure to tell the server we're leaving, it would be rude not to.
      window.onbeforeunload = () => {
        _this.stringify({
          channel,
          privateKey,
          metadata: {
            time: Date.now(),
            client: _this.client,
            commonName: _this.commonName,
            type: 'unsubscribe'
          }
        }, payload => {
          _this.socket.send(payload);
        });
      };
    });
  } else {
    // Crap, Something is wrong and we're not connected yet, let's try again later.
    console.warn('Failed to connect, attempting again in 1 second.');
    setTimeout(() => {
      // call self with the same params that were initially passed.
      _this.subscribe(channel, callback, opts);
    }, 500);
  }
};
