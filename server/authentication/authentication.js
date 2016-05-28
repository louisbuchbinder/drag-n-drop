
const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const authenticationHandler = require('./authenticationHandler.js');

const secret = process.env.JWT_SECRET;

module.exports.protect = function initializeJWTApp (app, route, exceptions) {
  route = route ? route : '/';
  exceptions = exceptions ? exceptions : [];
  app.use(
    route,
    cookieParser(),
    function extendHeaderWithAuthCookie(req, res, next) {
      // extend the headers with the authorization cookie 
      // expects the cookie-parser middleware to be used previously
      var auth = req.cookies.authorization;
      // replace '%20' with ' ' to reverse the url encoding
      if (typeof auth === 'string' && auth.slice(6,9) === '%20') { auth = auth.slice(0,6) + ' ' + auth.slice(9); }
      req.headers.authorization = auth;
      next();
    },
    expressJWT({secret: secret}).unless({path: exceptions}), 
    function handleUnauthorizedError (error, request, response, next) {
  	  if (error.name === 'UnauthorizedError') {
  	    response.status(400).send('invalid token...');
  	  } else { next(); }
    }
  );
};

module.exports.initializeEndpoints = (app) => {
  app.post(
    '/signup', 
    bodyParser.json(),
    bodyParser.urlencoded({extended: true}),
    authenticationHandler.signup
  );
  app.post(
    '/login',
    bodyParser.json(),
    bodyParser.urlencoded({extended: true}),
    authenticationHandler.login
  );
};


module.exports.verifyUsername = authenticationHandler.verifyUsername;



