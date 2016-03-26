var Postbox = new jsps('ws://198.11.254.137:3000/', {
  commonName: 'mdwisniewski'
});

document.getElementById('send').onclick = function(e){
  Postbox.publish('General', {
    message: document.getElementById('message').value
  });
}

Postbox.subscribe('General', msg => {
  document.getElementById('data').innerHTML += '\n' + JSON.stringify(msg)
  console.log(msg);
});

Postbox.clients('General');
