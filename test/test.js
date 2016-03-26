var Shout = new PubSub('ws://localhost:3000', {
  commonName: 'mdwisniewski'
});

document.getElementById('send').onclick = function(e){
  Shout.publish('General', {
    message: document.getElementById('message').value
  });
}

Shout.subscribe('General', msg => {
  document.getElementById('data').innerHTML += '\n' + JSON.stringify(msg)
  console.log(msg);
});

Shout.clients('General');
