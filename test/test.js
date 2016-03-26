var Shout = new PubSub('ws://localhost:3000/ps');

Shout.subscribe('General', msg => {
  console.log(msg);
});


Shout.publish('General', {
  message: 'test'
});
