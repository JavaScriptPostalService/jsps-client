# CatSnake JS

CatSnake JS - Open source, free to use persistant pubsub for building realtime applications.

## What is CatSnake JS?

CatSnake JS is a PubSub solution that allows realtime communications between clients and
devices. With CatSnake you can simply subscribe a device to a channel and any time
a JavaScript object is published to that channel your device or client will be notified.

The best part is it's incredibly fast. CatSnake uses WebSockets for communication
which are blazing fast. For practicle use cases check out our website over at http://catsnake.io

## Usage

### Setup

If you're using npm you can simply require and create a catsnake client.
```javascript
const CatSnake = require('catsnake');
const catsnake = new CatSnake('ws://public.catsnake.io', {
    // The common name is how people will know who or what a client is.
    // If no commonName is provided your client will be known as A Random Catsnake
    commonName: 'A Random Catsnake'
});

```

If you're using this without a module builder just go ahead and use the following without the require. CatSnake will
already be defined.
```javascript
const catsnake = new CatSnake('ws://public.catsnake.io', {
    // The common name is how people will know who or what a client is.
    // If no commonName is provided your client will be known as A Random Catsnake
    commonName: 'A Random Catsnake'
});
```


### Subscribe
Before you can start sending messages, you should subscribe to a channel (but you don't have to). Don't worry, it's super easy.

```javascript
CatSnake.subscribe('General', msg => console.log(msg));
```

There are ofcourse additional options avalible.
```javascript
CatSnake.subscribe('General', msg => console.log(msg), {
   // If you're passing around some private information you can make your channel private by simply passing in a privateKey.
   // Anyone who want's to later publish to this channel will need this key to do so!
   privateKey: 'ShhThisIsAPrivateChannel',
   // If you would like to be able to block clients in the future, or promote
   // other clients to be able to manage blocked users etc, add a secret.
   secret: 'MySuperSecretKey',
   // If you want the channel to be invite only, pass in private as true, this
   // is different from the privateKey, with the private key all you need to do
   // is pass the privateKey to an authorized user to grant them pubsub access
   // with private you need to grant them access manually by clientID, which
   // they will need to send to your client before trusting, this is not
   // publicly avalible and creates a handshake.
   private: false
}
```

### Publish
Now that you've subscibed to a channel, let's publish a message to all of the other subscribers, and ourselves ofcourse.

```javascript
CatSnake.publish('General', msg => {
    message: 'Ahh! Your dog is attacking me! What is it with mail men and dogs anyways?'
});
```


Whoops! It looks like the general channel is private. Let's pass in the privateKey the same way we do in our subscribe method.
```javascript
CatSnake.publish('General', msg => {
    message: 'Ahh! Your dog is attacking me! What is it with mail men and dogs anyways?'
}, 'ShhThisIsAPrivateChannel');
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
you can later reconnect with the same client id via the subscribe method, we will go over this more in the advanced
features below.

```javascript
CatSnake.unsubscribe('General');
```

### History

Wanna get some history? Just put the channel, the limit, and a privateKey if the channel is private.
History will be sent back in the subscriber function, you can check the metadata.type for the type of 'history'
```javascript
CatSnake.history('General', limit, {
  privateKey: 'ShhThisIsAPrivateChannel' // Optional
});
```
