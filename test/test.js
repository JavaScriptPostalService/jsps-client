var Postbox = new jsps('ws://localhost:3000/', {
  commonName: 'mdwisniewski'
});

document.getElementById('send').onclick = function(e){
  Postbox.publish('General', {
    message: 'testing'
  });
}

Postbox.subscribe('General', msg => {
  document.getElementById('data').innerHTML += '\n' + JSON.stringify(msg)
  console.log(msg);
});

Postbox.clients('General');
