
module.exports = function (server) {
  var socket = require('socket.io')(server);
  var stream = require('socket.io-stream');
  var path = require('path');
  var fs = require('fs');
   
  socket.of('/').on('connection', function(socket) {
    stream(socket).on('file', function(stream, data) {
      console.log('name', data.name);
      var filename = path.basename(data.name);
      stream.pipe(fs.createWriteStream(filename));
    });
  });
};
