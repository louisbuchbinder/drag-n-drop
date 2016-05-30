'use strict';

// const fs = require('fs');
const cookieParser = require('cookie-parser');

const db = require('./db/database.js');
const shortenedUrls = require('./shortenedUrls');
const setExistingUrls = shortenedUrls.setExistingUrls;
const generateUrl = shortenedUrls.generateUrl;

// const cookieParser = require('cookie-parser');

// hard coded for now. Remove when authentication is added
// var username = 'louie';
// var userindex = '1';

///// /////  ///// /////  ///// /////  ///// /////  ///// /////  
const authentication = require('./authentication/authentication.js');

///// /////  ///// /////  ///// /////  ///// /////  ///// /////  
const stream = require('stream');
var ReadableBuffer = function (buffer) {
  stream.Readable.call(this);
  this.buffer = buffer;
};
ReadableBuffer.prototype = stream.Readable.prototype;
ReadableBuffer.prototype._read = function () {
  this.push(this.buffer);
  this.buffer = null;
};
///// /////  ///// /////  ///// /////  ///// /////  ///// /////  
const mime = require('mime');

const setResponseHeadersForFile = (response, filename) => {
  response.setHeader('Content-disposition', 'attachment; filename=' + filename);
  response.setHeader('Content-type', mime.lookup(filename));
};

const pipeFile = (response, filename) => {
  setResponseHeadersForFile(response, filename);
  db.fetch('files', 'filedata', {filename:filename})
  .then((results) => {
    let buffer = new Buffer(results.rows[0].filedata, 'hex');
    let readableBuffer = new ReadableBuffer(buffer);
    readableBuffer.pipe(response);
  })
  .catch((error) => console.log('Error fetching the file: ' + filename, error));
}; 
///// /////  ///// /////  ///// /////  ///// /////  ///// /////

module.exports = (app) => {

  if (process.env.NODE_ENV === 'test') {
    authentication.protect(app, '/protected');
    app.get('/protected', (request, response) => response.status(200).send());
  }
  
  app.get('/signup', (request, response) => response.redirect('/'));
  app.get('/login', (request, response) => response.redirect('/'));
  app.get('/drop', (request, response) => response.redirect('/'));
  app.get('/files', (request, response) => response.redirect('/'));
  app.get('/about', (request, response) => response.redirect('/'));
  app.get('/logout', (request, response) => response.cookie('authorization', '').redirect('/'));


  app.get('/username', cookieParser(), (request, response) => {
    authentication.verifyUsername(request, response)
    .then((username) => response.send({username: username}))
    .catch(() => response.send({username: null}));
  });


  const setFileEndpoint = (filename, link) => {
    app.get(link, (request, response) => pipeFile(response, filename) );
  };
  
  // authentication.protect(app, '/save');
  app.post('/save', cookieParser(), (request, response) => {

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
      authentication.verifyUsername(request, response)
      .then((username) => db.fetch('users', 'index', {username: username}) )
      .catch(() => db.fetch('users', 'index', {username: 'public'}) )
      .then((results) => {
        if (results.rows.length !== 1) { return Promise.reject('invalid user token'); }
        return String(results.rows[0].index);
      })
      .then((userindex) => {
        return db.insertInto('files', {userindex: userindex, link: url, filename: filename, filedata: filedata});
      })
      .then(()=>{
        setFileEndpoint(filename, url);
        response.status(200).send('Your file was saved at ' + url); 
      })
      .catch((error)=>response.status(400).send());
      
    });
  });


  // authentication.protect(app, '/fetchFiles');
  app.get('/fetchFiles', cookieParser(), (request, response) => {
    let filename = request.query.filename;
    let where = filename !== 'all' ? {'files.filename': filename} : {};
    where['users.index'] = ['files.userIndex'];
    authentication.verifyUsername(request, response)
    .then((username) => {
      where['users.username'] = username;
      return db.join('users', 'files', where, 'JOIN', 'files.filename, files.link');
    })
    .catch(() => {
      where['users.username'] = 'public';
      return db.join('users', 'files', where, 'JOIN', 'files.filename, files.link');
    })
    .then((results) => response.send(results.rows))
    .catch((error) => {console.log(error);response.sendStatus(400);});
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

