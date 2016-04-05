'use strict';

var babelHelpers = {};

babelHelpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

babelHelpers.createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

babelHelpers;

/**
 * csModClientid module.
 * @module core/csModClientid
 * @return {string} - Returns a new random, unique clientid
 */

// This function simply generates a random time based client token.
// Clients will use this token to authenticate themselves, so this should be
// saved in the application if you plan to resubscribe to channels after reloading
// the catsnake client
var csModClientid = function csModClientid() {
  var d = new Date().getTime();
  var uuid = 'client-xxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
  });
  return uuid;
};

/**
 * csModStringify module.
 * @module core/csModStringify
 * @param {object} data - the object to attempt to stringify
 * @callback {function} callback - Returns a stringified object
*/

// A dead simple try catch for stringifying objects. In the future we'd like this
// to somehow minify the string and make for a smaller payload
var csModStringify = function csModStringify(data, callback) {
  try {
    callback(JSON.stringify(data));
  } catch (e) {
    console.warn('attempted to send invalid data to the pubsub server.');
  }
};

/**
 * csModPublish module.
 * @module core/csModPublish
 * @param {string} channel - the channel to publish to
 * @param {object} data - the object to publish
 * @param {string} privateKey - optional private key for private channels
 * @param {this} _this - this inheratance
*/
var csModPublish = function csModPublish(channel, data, privateKey, _this) {
  // If we're connected, let's go ahead and publish our payload.
  if (_this.connected) {
    // Safely stringify our data before sending it to the server.
    _this.stringify({
      channel: channel,
      privateKey: privateKey,
      payload: data,
      metadata: {
        time: Date.now(),
        client: _this.client,
        commonName: _this.commonName,
        type: 'publish'
      }
    }, function (payload) {
      // Send off the payload to the server signifiying we're using a standard publish method.
      _this.socket.send(payload);
    });
  } else {
    // Crap, Something is wrong and we're not connected yet, let's try again later.
    console.warn('Failed to connect, attempting again in 1 second.');
    setTimeout(function () {
      // call self with the same params that were initially passed.
      _this.publish(channel, data, privateKey);
    }, 500);
  }
};

/**
 * csModInfo module.
 * @module core/csModInfo
 * @param {string} channel - the channel to look at
 * @param {object} data - additional information for request
 * @param {object} opts - additional options for subscriptions
 * @param {this} _this - this inheratance
*/
var csModInfo = function csModInfo(channel, data, opts, _this) {
  // Since options are optional, if there are no options passed, we'll drop in
  // an empty object if options are false or undefined. This will help fix top
  // level null or undefined exceptions.
  var options = opts ? opts : {};
  var privateKey = options.privateKey ? options.privateKey : false;

  // If we're connected, let's go ahead and publish our payload.
  if (_this.connected) {
    // Safely stringify our data before sending it to the server.
    _this.stringify({
      channel: channel,
      privateKey: privateKey,
      payload: data,
      metadata: {
        time: Date.now(),
        client: _this.client,
        commonName: _this.commonName,
        type: 'info'
      }
    }, function (payload) {
      // Send off the payload to the frontend that will request channel info
      _this.socket.send(payload);
    });
  } else {
    // Something is wrong and we're not connected yet, let's try again later.
    console.warn('Failed to connect, attempting again in 1 second.');
    setTimeout(function () {
      // call self with the same params that were initially passed.
      _this.info(channel, data, opts);
    }, 500);
  }
};

/**
 * csModSubscribe module.
 * @module core/csModSubscribe
 * @param {string} channel - the channel to subscribe to
 * @callback {function} callback - new messages are returned here via msg
 * @param {object} opts - additional options for subscriptions
 * @param {this} _this - this inheratance
*/
var csModSubscribe = function csModSubscribe(channel, callback, opts, _this) {
  // Since options are optional, if there are no options passed, we'll drop in
  // an empty object if options are false or undefined. This will help fix top
  // level null or undefined exceptions.
  var options = opts ? opts : {};

  var privateKey = options.privateKey ? options.privateKey : false;

  if (_this.connected) {
    // Safely stringify our data before sending it to the server.
    _this.stringify({
      channel: channel,
      privateKey: privateKey,
      noself: options.noself ? options.noself : false,
      secret: options.accessToken ? options.accessToken : false,
      private: options.private ? options.private : false,
      metadata: {
        time: Date.now(),
        client: _this.client,
        commonName: _this.commonName,
        type: 'subscribe'
      }
    }, function (payload) {
      console.log('payload', payload);
      // Send off the payload to the server letting it know we're subscribing to a channel
      _this.socket.send(payload);

      // Whenever the server has new info it will tell us here.
      _this.socket.onmessage = function (msg) {
        if (JSON.parse(msg.data).channel === channel) {
          callback(JSON.parse(msg.data));
        }
      };

      // When we go to leave be sure to tell the server we're leaving, it would be rude not to.
      window.onbeforeunload = function () {
        _this.stringify({
          channel: channel,
          privateKey: privateKey,
          metadata: {
            time: Date.now(),
            client: _this.client,
            commonName: _this.commonName,
            type: 'unsubscribe'
          }
        }, function (payload) {
          _this.socket.send(payload);
        });
      };
    });
  } else {
    // Crap, Something is wrong and we're not connected yet, let's try again later.
    console.warn('Failed to connect, attempting again in 1 second.');
    setTimeout(function () {
      // call self with the same params that were initially passed.
      _this.subscribe(channel, callback, opts);
    }, 500);
  }
};

/**
 * Deny a client access to a channel
 * @function csModDeny
 * @param {string} channel - the channel in which to deny the client from
 * @param {string} client - the client to deny
 * @param {string} secret - the secret key associated with this channel
 * @param {this} _this - this inheratance
*/
var csModDeny = function csModDeny(channel, client, secret, _this) {
  // If we're connected, let's go ahead and publish our payload.
  if (_this.connected) {
    // Safely stringify our data before sending it to the server.
    _this.stringify({
      channel: channel,
      client: client,
      secret: secret,
      metadata: {
        time: Date.now(),
        client: _this.client,
        commonName: _this.commonName,
        type: 'deny'
      }
    }, function (payload) {
      // Send off the payload to the frontend that will attempt to deny a client
      _this.socket.send(payload);
    });
  } else {
    // Something is wrong and we're not connected yet, let's try again later.
    console.warn('Failed to connect, attempting again in 1 second.');
    setTimeout(function () {
      // call self with the same params that were initially passed.
      _this.info(channel, data, opts);
    }, 500);
  }
};

/**
 * csModHistory module.
 * @module core/csModHistory
 * @param {string} channel - the channel to pull history from
 * @param {number} limit - the ammount of items to pull from history
 * @param {object} opts - options such as privateKeys
 * @param {this} _this - this inheratance
*/
var csModHistory = function csModHistory(channel, limit, opts, _this) {
  // Since options are optional, if there are no options passed, we'll drop in
  // an empty object if options are false or undefined. This will help fix top
  // level null or undefined exceptions.
  var options = opts ? opts : {};
  var privateKey = options.privateKey ? options.privateKey : false;

  // If we're connected, let's go ahead and publish our payload.
  if (_this.connected) {
    // Safely stringify our data before sending it to the server.
    _this.stringify({
      channel: channel,
      privateKey: privateKey,
      limit: limit,
      metadata: {
        time: Date.now(),
        client: _this.client,
        commonName: _this.commonName,
        type: 'history'
      }
    }, function (payload) {
      // Send off the payload to the frontend that will request a batch of history
      _this.socket.send(payload);
    });
  } else {
    // Something is wrong and we're not connected yet, let's try again later.
    console.warn('Failed to connect, attempting again in 1 second.');
    setTimeout(function () {
      // call self with the same params that were initially passed.
      _this.history(channel, limit, opts);
    }, 500);
  }
};

/**
 * Creates a new CatSnake client.
 * @class
 */

var CatSnake = function () {
  /**
   * @constructs CatSnake
   * @param {string} address - the address of the catsnake server
   * @param {object} options - options such as common name and others
   */

  function CatSnake(address, options) {
    var _this = this;

    babelHelpers.classCallCheck(this, CatSnake);

    this.socket = new WebSocket(address);
    this.connected = false;

    // Genrate a unique clientid
    this.client = csModClientid();

    this.commonName = options.commonName ? options.commonName : config.defaultName;

    // Fired when the connection is made to the server
    this.socket.onopen = function (event) {
      _this.connected = true;

      // Make sure we tell the server we're leaving.
      window.onbeforeunload = function () {
        _this.socket.close();
      };
    };
  }

  babelHelpers.createClass(CatSnake, [{
    key: 'stringify',
    value: function stringify(data, callback) {
      /**
       * Tries to return a stringified object.
       * @function csModStringify
       * @param {object} data - the object to attempt to stringify
       * @callback {string} - Returns a stringified object
      */
      return csModStringify(data, callback);
    }
  }, {
    key: 'publish',
    value: function publish(channel, data, privateKey) {
      /**
       * Publishes a message to all subscribers
       * @function csModPublish
       * @param {string} channel - the channel to publish to
       * @param {object} data - the object to publish
       * @param {string} privateKey - optional private key for private channels
       * @param {this} this - this inheratance
      */
      csModPublish(channel, data, privateKey, this);
    }
  }, {
    key: 'info',
    value: function info(channel, data, opts) {
      /**
       * List all clients
       * @function csModInfo
       * @param {string} channel - the channel to look at
       * @param {object} data - additional information for request
       * @param {object} opts - additional options for subscriptions
       * @param {this} this - this inheratance
      */
      csModInfo(channel, data, opts, this);
    }
  }, {
    key: 'history',
    value: function history(channel, limit, opts) {
      /**
       * List all clients
       * @function csModHistory
       * @param {string} channel - the channel to pull history from
       * @param {number} limit - the ammount of items to pull from history
       * @param {object} opts - options such as privateKeys
       * @param {this} this - this inheratance
      */
      csModHistory(channel, limit, opts, this);
    }
  }, {
    key: 'subscribe',
    value: function subscribe(channel, callback, opts) {
      /**
       * Subscribe to a channel
       * @function csModSubscribe
       * @param {string} channel - the channel to subscribe to
       * @callback {function} callback - new messages are returned here via msg
       * @param {object} opts - additional options for subscriptions
       * @param {this} this - this inheratance
      */
      csModSubscribe(channel, callback, opts, this);
    }
  }, {
    key: 'deny',
    value: function deny(channel, client, secret) {
      /**
       * Deny a client access to a channel
       * @function csModDeny
       * @param {string} channel - the channel in which to deny the client from
       * @param {string} client - the client to deny
       * @param {string} secret - the secret key associated with this channel
      */
      return csModDeny(channel, client, secret, this);
    }
  }, {
    key: 'grant',
    value: function grant(channel, client, secret) {
      /**
       * Grant a client access to a channel
       * @function csModGrant
       * @param {string} channel - the channel in which to grant the client access to
       * @param {string} client - the client to grant access
       * @param {string} secret - the secret key associated with this channel
      */
      return cdModGrant(channel, client, secret, this);
    }
  }]);
  return CatSnake;
}();