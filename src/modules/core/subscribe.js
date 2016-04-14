/**
 * csModSubscribe module.
 * @module core/csModSubscribe
 * @param {string} channel - the channel to subscribe to
 * @callback {function} callback - new messages are returned here via msg
 * @param {object} opts - additional options for subscriptions
*/
export const csModSubscribe = function csModSubscribe(channel, callback, opts) {
  // Since options are optional, if there are no options passed, we'll drop in
  // an empty object if options are false or undefined. This will help fix top
  // level null or undefined exceptions.
  const options = opts || {};
  const privateKey = options.privateKey || false;


  this[this.symbols._encode]({
    channel,
    privateKey,
    noself: (options.noself) ? options.noself : false,
    secret: (options.accessToken) ? options.accessToken : false,
    private: (options.private) ? options.private : false,
    metadata: {
      time: Date.now(),
      client: this.client,
      commonName: this.commonName,
      type: 'subscribe',
    },
  }, payload => {
    // Send off the payload to the server letting it know we're subscribing to a channel
    this.socket.send(payload);

    // Whenever the server has new info it will tell us here.
    this[this.symbols._awaitMessage](msg => {
      if (msg.channel === channel) {
        callback(msg);
      }
    });

    // When we go to leave be sure to tell the server we're leaving, it would be rude not to.
    window.onbeforeunload = () => {
      this[this.symbols._encode]({
        channel,
        privateKey,
        metadata: {
          time: Date.now(),
          client: this.client,
          commonName: this.commonName,
          type: 'unsubscribe',
        },
      }, pl => {
        this.socket.send(pl);
      });
    };
  });
  return this;
};
