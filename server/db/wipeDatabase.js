
///// /////  ///// /////  ///// /////  ///// /////  ///// /////  ///// /////  ///// ///// 
// Initialize Environment
const environment = process.argv[2];
if (environment === '-p' || environment === '-prod' || environment === '-production' ) {
  require('dotenv').config({path: './.envProduction'});
}
else if (environment === '-d' || environment === '-dev' || environment === '-development' ) {
  require('dotenv').config({path: './.envDevelopment'});
}
else if (environment === '-t' || environment === '-test') {
  require('dotenv').config({path: './.envTest'});
}
else { console.log('Error: No environment detected'); process.exit(1); }
///// /////  ///// /////  ///// /////  ///// /////  ///// /////  ///// /////  ///// /////  

const db = require('./database');
db.initialize(true, () => { 
  return db.insertInto('users', {username: 'public', password: '', created: Date.now()})
  .then(() => { console.log('done'); process.exit(); });
});

///// /////  ///// /////  ///// /////  ///// /////  ///// /////  ///// /////  ///// ///// 
