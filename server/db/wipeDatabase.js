
///// /////  ///// /////  ///// /////  ///// /////  ///// /////  ///// /////  ///// ///// 
// Initialize Environment

if (environment === '-d' || environment === '-dev' || environment === '-development' ) {
  require('dotenv').config({path: './.envDevelopment'});
}
else if (environment === '-t' || environment === '-test') {
  require('dotenv').config({path: './.envTest'});
}
else { console.log('Error: No environment detected'); process.exit(1); }
///// /////  ///// /////  ///// /////  ///// /////  ///// /////  ///// /////  ///// /////  

const db = require('./database');
db.initialize(true, ()=> { console.log('done'); process.exit(); });

