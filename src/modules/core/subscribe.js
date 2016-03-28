/**
 * modSubscribe module.
 * @module core/modSubscribe
 * @param {string} channel - the channel to subscribe to
 * @callback {function} callback - new messages are returned here via msg
 * @param {object} opts - additional options for subscriptions
 * @param {this} _this - this inheratance
*/
export const modSubscribe = (channel, callback, opts, _this) => {
  let options = (opts) ? opts : {};
  let privateKey = (options.privateKey) ? options.privateKey : false;

  if (_this.connected) {
    // Safely stringify our data before sending it to the server.
    _this.stringify({
      channel,
      privateKey,
      noself: (options.noself) ? options.noself : false,
      silent: (options.silent) ? options.silent : false,
      metadata: {
        time: Date.now(),
        client: _this.client,
        commonName: _this.commonName,
        type: 'subscribe'
      }
    }, payload => {
      _this.socket.send(payload);
      _this.socket.onmessage = function(msg) {
        if (JSON.parse(msg.data).channel === channel) {
          callback(JSON.parse(msg.data));
        }
      };
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
      _this.subscribe(channel, callback, privateKey);
    }, 500);
  }
};
