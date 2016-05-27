'use strict';

const fs = require('fs');
const db = require('./db/database.js')();
const shortenedUrls = require('./shortenedUrls');
const setExistingUrls = shortenedUrls.setExistingUrls;
const generateUrl = shortenedUrls.generateUrl;

// hard coded for now. Remove when authentication is added
var username = 'louie';
var userindex = '1';
///// /////  ///// /////  ///// /////  ///// /////  ///// /////  

module.exports = (app) => {
  
  const setFileEndpoint = (filename, link) => {
    app.get(link, (request, response) => {
      db.fetch('files', 'filedata', {filename:filename})
      .then((results) => {
        var buffer = new Buffer(results.rows[0].filedata, 'hex');
        var wstream = fs.createWriteStream('uploads/' + filename);
        wstream.write(buffer); 
        wstream.end();

        var readStream = fs.createReadStream('uploads/' + filename);
        readStream.pipe(response);
      });
    });
  };
  
  app.post('/save', (request, response) => {

    var filedata = '';
    var filename = request.headers.filename || 'no_name_file';

    let url = generateUrl();

    request.on('readable', function(){
      var buffer = request.read();
      if (buffer) { 
        filedata += buffer.toString('hex');
      }
    });
    request.on('end', function () {
      db.insertInto('files', {userindex: userindex, link: url, filename: filename, filedata: filedata})
      .then(()=>{
        setFileEndpoint(filename, url);

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
    var urls = results.rows.map((file) => file.link.slice(1) );
    setExistingUrls(urls);
    results.rows.forEach( (file) => {
      setFileEndpoint(file.filename, file.link);
    });
  });

};

