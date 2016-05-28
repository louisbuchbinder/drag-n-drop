const db = require('./database')();
db.initialize(true, ()=> { console.log('done'); process.exit(); });

