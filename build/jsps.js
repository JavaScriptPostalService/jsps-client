'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var jsps = function () {
  function jsps(address, options) {
    var _this = this;

    _classCallCheck(this, jsps);

    this.socket = new WebSocket(address);
    this.connected = false;
    this.client = this.clientid();
    this.commonName = options.commonName ? options.commonName : 'Anonymous';
    this.socket.onopen = function (event) {
      _this.connected = true;
      window.onbeforeunload = function () {
        _this.socket.close();
      };
    };
  }

  _createClass(jsps, [{
    key: 'clientid',
    value: function clientid() {
      var d = new Date().getTime();
      var uuid = 'client-xxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
      });
      return uuid;
    }
  }, {
    key: 'stringify',
    value: function stringify(data, cb) {
      try {
        cb(JSON.stringify(data));
      } catch (e) {
        console.warn('attempted to send invalid data to the pubsub server.');
      }
    }
  }, {
    key: 'publish',
    value: function publish(channel, data, privateKey) {
      var _this2 = this;

      // If we're connected, let's go ahead and publish our payload.
      if (this.connected) {
        // Safely stringify our data before sending it to the server.
        this.stringify({
          channel: channel,
          privateKey: privateKey,
          payload: data,
          metadata: {
            time: Date.now(),
            client: this.client,
            commonName: this.commonName,
            type: 'publish'
          }
        }, function (payload) {
          _this2.socket.send(payload);
        });
      } else {
        // Crap, Something is wrong and we're not connected yet, let's try again later.
        console.warn('Failed to publish, not connected to server, attempting again in 1 second.');
        setTimeout(function () {
          _this2.publish(channel, data, privateKey);
        }, 500);
      }
    }
  }, {
    key: 'clients',
    value: function clients(channel, data, privateKey) {
      var _this3 = this;

      // If we're connected, let's go ahead and publish our payload.
      if (this.connected) {
        // Safely stringify our data before sending it to the server.
        this.stringify({
          channel: channel,
          privateKey: privateKey,
          payload: data,
          metadata: {
            time: Date.now(),
            client: this.client,
            commonName: this.commonName,
            type: 'clients'
          }
        }, function (payload) {
          _this3.socket.send(payload);
        });
      } else {
        // Crap, Something is wrong and we're not connected yet, let's try again later.
        console.warn('Failed to publish, not connected to server, attempting again in 1 second.');
        setTimeout(function () {
          _this3.clients(channel, data, privateKey);
        }, 500);
      }
    }
  }, {
    key: 'subscribe',
    value: function subscribe(channel, cb, privateKey) {
      var _this4 = this;

      if (this.connected) {
        // Safely stringify our data before sending it to the server.
        this.stringify({
          channel: channel,
          privateKey: privateKey,
          metadata: {
            time: Date.now(),
            client: this.client,
            commonName: this.commonName,
            type: 'subscribe'
          }
        }, function (payload) {
          _this4.socket.send(payload);
          _this4.socket.onmessage = function (msg) {
            if (JSON.parse(msg.data).channel === channel) {
              cb(JSON.parse(msg.data));
            }
          };
          window.onbeforeunload = function () {
            _this4.stringify({
              channel: channel,
              privateKey: privateKey,
              metadata: {
                time: Date.now(),
                client: _this4.client,
                commonName: _this4.commonName,
                type: 'unsubscribe'
              }
            }, function (payload) {
              _this4.socket.send(payload);
            });
          };
        });
      } else {
        // Crap, Something is wrong and we're not connected yet, let's try again later.
        console.warn('Failed to publish, not connected to server, attempting again in 1 second.');
        setTimeout(function () {
          _this4.subscribe(channel, cb, privateKey);
        }, 500);
      }
    }
  }]);

  return jsps;
}();

;