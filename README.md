#Drag-n-Drop File Transfer Server#

###Save Your Most Important Files###

###Access Your Files Anytime From Anywhere###

###Share Files and Directories With Your Team###


***Contributions Welcome***

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
1. Authentication with Bcrypt
2. Files fetched from db with username token
3. Allow for dropped directories
4. Pipe files as downloadable
5. BootstrapCSS
6. Shortened Urls in separate file
7. directly pipe files from db




