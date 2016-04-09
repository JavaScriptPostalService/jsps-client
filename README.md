[![](https://nodei.co/npm/catsnake.png?downloads=true&downloadRank=true)](https://npmjs.com/package/catsnake)

## What is CatSnake JS?

CatSnake JS is a PubSub solution that allows realtime communications between clients and
devices. With CatSnake you can simply subscribe a device to a channel and any time
a JavaScript object is published to that channel your device or client will be notified.

The best part is Catsnake is built using WebSockets and
[MessagePack](http://msgpack.org) so it's incredibly fast.


## Something worth noting

Catsnake will soon feature pluggable modules for things like Mapping, IOT and more.
In addition we will have libraries for Python and Java, as well as native implementations for mobile development. Stay tuned :)

## Docs

For detailed documentation [visit this link.](https://rawgit.com/catsnakejs/catsnake-client/master/docs/global.html)

## Quickstart Guide

### Setup

For quick use you can simply include catsnke in your `<head>`.

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/catsnake/0.2.5/catsnake.js"></script>
```

If you're using npm you can simply require and create a catsnake client.
```javascript
const catsnake = require('catsnake');
const CatSnake = new catsnake('ws://catsnake.io:3081', {
    commonName: 'A Random Catsnake'
});
```

If you're using this without a module builder just go ahead and use the following without the require. CatSnake will
already be defined.


### Subscribe
Before you can start sending messages, you should subscribe to a channel (but you don't have to). Don't worry, it's super easy.

```javascript
CatSnake.subscribe('General', msg => console.log(msg));
```

### Publish
Now that you've subscibed to a channel, let's publish a message to all of the other subscribers, and ourselves ofcourse.

```javascript
CatSnake.publish('General', msg => {
    message: 'Ahh! Your dog is attacking me! What is it with mail men and dogs anyways?'
});
```

### Access Control

Catsnake gives you multiple options for access control to a channel. We'll talk
about denying access to a channel as well as granting access.

Denying a client access to a channel protected by access control is easy
```javascript
CatSnake.deny('General', 'client-123215', 'secretKey');
```

Granting a client access to a channel protected by access control is just as simple.
```javascript
CatSnake.grant('General', 'client-123215', 'secretKey');
```

### Info

Nice, now let's get info from the channel, this will return information like connected clients, author, etc.

```javascript
CatSnake.info('General');
```

### Unsubscribe
Well that was easy. Let's go over one last thing, before we get into the more advanced features of jsps.
Once you're done pubsubbing you can unsubscribe from the channel. This will leave your client in an offline state but
you can later reconnect with the same client id via the `new Catsnake` method, we will go over this more in the advanced
features below.

```javascript
CatSnake.unsubscribe('General');
```

### History

Wanna get some history? Just put the channel, the limit, and a privateKey if the channel is private.
History will be sent back in the subscriber function, you can check the metadata.type for the type of 'history'
```javascript
CatSnake.history('General', limit);
```
