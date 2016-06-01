#Drop Zone#
###Drag-n-Drop File Transfer Server###

***Visit the (Drop Zone)[https://drop-zone.herokuapp.com]***

###Save Your Most Important Files###

###Access Your Files Anytime From Anywhere###

###Share Files and Directories With Your Team###


***Contributions Welcome***
Please make pull requests to the dev branch


```
// Dependencies
npm install

// Run locally
npm start

// or Run in Dev Mode
npm run start-dev

// Run Tests
npm test



// PostgreSQL Instructions:

// Download postgres if not installed
brew install postgres

// Create the databases
createdb drag-n-drop
createdb test

// Initialize the database
pg_ctl init --pgdata=database/drag-n-drop --log=logfile

// or Start the database
pg_ctl start --pgdata=database/drag-n-drop --log=logfile

// View database in REPL
psql drag-n-drop

// Stop the database server
pg_ctl stop --pgdata=database/test

```


***Next Steps***

0. Add public drop zone to home page
  Back End:
  1. Limit Public saves to 25mb
  2. Possibly fetch by ip address (look into this)
  
  Front End:
  2. Add message on error saved file
  3. Limit Public saves to 25mb



0. Set custom drag image when over the dropbox
1. Testing
2. Delete File in edit modal
3. Change Permissions in edit modal
4. toggle collapse only if aria expanded...
5. Allow for dropped directories




