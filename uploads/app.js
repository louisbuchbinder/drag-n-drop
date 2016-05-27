
/*globals  file*/
var socketIO = require('socket.io-client');
var socketStream = require('socket.io-stream');
var save = require('./ajax.js');



var socket = socketIO.connect('/');
 
  // $('#file').change(function(e) {
    // var file = e.target.files[0];


function upload (file) {
  var stream = socketStream.createStream();

  // upload a file to the server. 
  socketStream(socket).emit('file', stream, {size: file.size});
  socketStream.createBlobReadStream(file).pipe(stream);
}
  // });

/*globals FileReader, Blob, URL*/
function fileReader (file) {
  var reader = new FileReader();
  reader.addEventListener('loadend', function (event) {
    var file = event.target.result;
    console.log('file: ', file);
    var array = new Int8Array(file);
    console.log('array: ', array);

    // save(array);
    


    var blob = new Blob([file], {type: 'image/jpeg'});
    console.log('blob: ', blob);
    var url = URL.createObjectURL(blob);
    console.log('url: ', url);
  });
  reader.readAsArrayBuffer(file);
}



// module.exports = upload;
module.exports = fileReader;


