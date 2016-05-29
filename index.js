
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
else if (process.env.NODE_ENV) { 
  // environment  previously defined. This case is for testing.
}
else { console.log('Error: No environment detected'); process.exit(1); }

///// /////  ///// /////  ///// /////  ///// /////  ///// /////  ///// /////  ///// /////  
// Initialize Application
const app = require('./server/configuration.js');
const port = process.env.PORT || 3000;

// if (module.parent) {
//   module.exports = app; // so we can require in tests
// } else {
  app.listen(port, () => { console.log('Server listening at port %d', port); });
// }

///// /////  ///// /////  ///// /////  ///// /////  ///// /////  ///// /////  ///// /////  
