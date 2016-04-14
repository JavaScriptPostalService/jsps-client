[![Logo](https://avatars1.githubusercontent.com/u/18083257?v=3&s=100)](http://catsnake.io)

 [![npm](https://img.shields.io/npm/v/pubsub.svg?style=flat-square)]()
[![GitHub issues](https://img.shields.io/github/issues/catsnakejs/catsnake-client.svg?style=flat-square)](https://github.com/catsnakejs/catsnake-client/issues)
[![deps](https://img.shields.io/david/catsnakejs/catsnake-client.svg?style=flat-square)]()
[![codes style](https://img.shields.io/badge/code%20style-Airbnb-brightgreen.svg?style=flat-square)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)


# What is CatSnake?

CatSnake is a package built on top of WebSockets to allow for a publish & subscribe style messaging for quickly building fast realtime applications. Catsnake also utilizes
[MessagePack](http://msgpack.org) so package sizes are very small making Catsnake very fast.

# Docs

For detailed documentation [visit this link.](https://rawgit.com/catsnakejs/catsnake-client/master/docs/global.html)

# Quickstart Guide

## Install
[![](https://nodei.co/npm/pubsub.png?downloads=true&downloadRank=true)](https://npmjs.com/package/pubsub)

For quick use you can simply include catsnke in your `<head>`.

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/catsnake/0.2.5/catsnake.js"></script>
```

For installation with npm just install with
```bash
npm i --save pubsub
```
and then require it
```javascript
const PubSub = require('pubsub');
```
Now connect to the PubSub server.
See [pubsub-server](http://npmjs.com/package/pubsub-server) to run your own server, Otherwise you can use the example below to use our free server. (note that channel names may already be reserved, so be creative!)
```javascript
const cs = new PubSub('ws://catsnake.io:3081', {
    commonName: 'A Random Catsnake'
});
```

## Methods

### Subscribe
Before you can start sending messages, you should subscribe to a channel (but you don't have to). Don't worry, it's super easy.

```javascript
cs.subscribe('General', data => console.log(data));
```

### Publish
Now that you've subscibed to a channel, let's publish a message to all of the other subscribers, and ourselves ofcourse.

```javascript
cs.publish('General', {
    message: 'Ahh! Your dog is attacking me! What is it with mail men and dogs anyways?'
}).then(msg => { console.log('Yay, the server got our message.') });
```

### History

Wanna fetch some history? Easy.

```javascript
cs.history('General', limit);
```

History will be sent back in the subscribe method with the `metadata.type` of 'history'.

### Info

Nice, now let's get info from the channel, this will return information like connected clients, author, etc.

```javascript
cs.info('General');
```

### Access Control

Catsnake gives you multiple options for access control to a channel.

Denying a client access to a channel protected by access control is easy
```javascript
cs.deny('General', 'client-123215', 'secretKey');
```

Granting a client access to a channel protected by access control is just as simple.
```javascript
cs.grant('General', 'client-123215', 'secretKey');
```

### Unsubscribe
Before exiting your application you should unsubscribe from the channel. This will leave your client in an offline state but
you can later reconnect with the same client id via the `new Catsnake` method, we will go over this more in the advanced
features below.

```javascript
cs.unsubscribe('General');
```

### Private Servers
In the event that you are trying to access a private server, after connecting to the server
be sure to authenticate with the correct secret.

Catsnake also provides chaining for most methods, so you can prepend authenticate to the beginning of your subscribe function to keep things clean!

```javascript
cs.authenticate('mostSecureSecretEver');
```

## Contributing

For catsnake to keep up to date, and become the best tool it can be; we need contributors like you!
We know trying to add your own work might be scary, what will people say? Is my code quality good enough? What if I look dumb?
It's fine! Just go ahead and submit your work, worst case we'll tidy things up a bit; I'm positive we can benifit from seeing your ideas.

See the [Contributing.md over here](https://github.com/catsnakejs/catsnake-client/blob/master/CONTRIBUTING.md) for a full list of instructions.
