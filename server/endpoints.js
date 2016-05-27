'use strict';

const fs = require('fs');
// const axios = require('axios');
const db = require('./db/database.js')();

var username = 'louie';
var userindex = '1';

var shortenedUrls = {};
var alphabet = 'abcdefghijklmnopqrstuvwxyz';
const generateUrl = () => {
  var url = '';
  for (var i = 0; i < 6; i++) {
    var index = Math.floor(Math.random()*alphabet.length);
    url += alphabet[index];
  }
  if (!shortenedUrls[url]) { 
    shortenedUrls[url] = true; 
    return '/' + url;
  } else { return generateUrl(); }
};

module.exports = (app) => {
  app.post('/save', (request, response) => {

    var filedata = '';
    var filename = request.headers.filename || 'no_name_file';

    let url = generateUrl();

    // var wstream = fs.createWriteStream('uploads/' + filename);
    request.on('readable', function(){
      var buffer = request.read();
      
      if (buffer) { 
        // wstream.write(buffer); 
        filedata += buffer.toString('hex');
      }
    });
    request.on('end', function () {
      // wstream.end();
      db.insertInto('files', {userindex: userindex, link: url, filename: filename, filedata: filedata})
      .then(()=>{
        app.get(url, (request, response) => {
          console.log('request received');
          // response.send('hello');

          db.fetch('files', 'filedata', {filename:filename})
          .then((results) => {
            var buffer = new Buffer(results.rows[0].filedata, 'hex');
            var wstream = fs.createWriteStream('uploads/' + filename);
            wstream.write(buffer); 
            wstream.end();

            var readStream = fs.createReadStream('uploads/' + filename);
            readStream.pipe(response);

            // response.send(buffer);
          });
        });

        response.status(200).send('Your file was saved at ' + url); 
        console.log('done');
      })
      .catch((error)=>console.log(error));
      
    });
  });

  



  app.get('/files', (request, response) => {
    let filename = request.query.filename;
    let where = filename !== 'all' ? {filename: filename} : '';
    db.fetch('files', 'filename, link', where)
    .then((results) => response.send(results.rows))
    .catch((error) => response.send(400));
  });


  db.fetch('files', 'filename, link')
  .then((results) => {
    results.rows.forEach( (file) => {
      app.get(file.link, (request, response) => {
        db.fetch('files', 'filedata', {filename:file.filename})
        .then((results) => {
          var buffer = new Buffer(results.rows[0].filedata, 'hex');
          var wstream = fs.createWriteStream('uploads/' + file.filename);
          wstream.write(buffer); 
          wstream.end();

          var readStream = fs.createReadStream('uploads/' + file.filename);
          readStream.pipe(response);

          // response.send(buffer);
        });
      });
    });
  });

};

