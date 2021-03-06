'use strict';

// testing environment should be triggered by environment variable instead of query parameters
const db = require(__dirname + '/../db/database.js');
const db_test = db; //come back to this later to remove dbtest//= require(__dirname + '/../db/database.js')();


const jwt = require('jsonwebtoken');
const hash = require('./hash.js');
const secret = process.env.JWT_SECRET;

// this module requires the body-parser middleware to be used previously
function handleLogin(req, res) {
  var username = req.body.username;
  var password =  req.body.password;
  var test = req.query.test;
  var database = test ? db_test : db;
  
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).send('bad request');
  }

  database.fetch('users', 'password', {username: username})
  .then((user) => {
    if (user.rows.length === 1) {
      user = user.rows[0];
      return hash.checkHash(password, user.password);
    }
    return Promise.reject('username and password do not match');
  })
  .then((bool) => {
    if (bool) {
      return Promise.resolve()
    }
    return Promise.reject('username and password do not match');
  })
  .then(() => {
    let token = jwt.sign({username: username}, secret);
    res.cookie('authorization', 'Bearer ' + token).status(200).send();
  })
  .catch((error) => {
    console.error(error);
    res.status(400).send(error);
  });
}

function handleSignup(req, res) {
  var username = req.body.username;
  var password =  req.body.password;
  var test = req.query.test;
  var database = test ? db_test : db;

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).send('bad request');
  }

  // check if username is taken then create new user if the name is unique
  database.fetch('users', '', {username: username})
  .then((existingUser) => {
    if (existingUser.rows.length > 0) {
      return Promise.reject('username already exists');
    } else {
      return hash.makeHash(password);
    }
  })
  .then((hashed) => {
    return database.insertInto('users', {username: username, password: hashed, created: String(Date.now())});
  })
  .then(() => {
    var token = jwt.sign({username: username}, secret);
    res.cookie('authorization', 'Bearer ' + token).status(201).send();
    return Promise.resolve();
  })
  .catch((error) => {
    console.error(error);
    res.status(400).send(error);
  });
}


// this function requires the cookie-parser middleware
const verifyUsername = (request, response) => {
  let auth = request.cookies.authorization;
  let token = auth ? auth.slice(7) : '';
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, payload) => {
      if (error) return reject(error);
      if (!payload) return reject('no token payload found');
      else return resolve(payload.username);
    });
  });
}



module.exports =  {
                    login: handleLogin,
                    signup: handleSignup,
                    verifyUsername: verifyUsername
                  };

