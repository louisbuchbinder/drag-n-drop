const express = require('express');
const bodyParser = require('body-parser');

var app = express();
module.exports = app;


// app.use(
//   // function (req, res, next) {
//   //   console.log(req.headers.cookie);
//   //   next();
//   // },
//   bodyParser.json(),
//   bodyParser.urlencoded({extended: true})
// );


app.use('/', express.static(__dirname + '/../dist/'));

require('./endpoints')(app);
// require('./socket');

// const db = require('./db/database.js');
// db.initialize(false, ()=>console.log('database initialized'));
