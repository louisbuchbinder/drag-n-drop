#Drag-n-Drop File Transfer Server#

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
  1. Remove protection from saveFiles route
  2. Still use verify username, On invalid username revert to public
    1. Possibly Save by ip address (look into this)
  3. Limit Public saves to 25mb
  
  Front End:
  4. ngShow "Public" Drop Zone when not LoggedIn
  5. Show Saved files based on user ip?
  6. ngHide Edit Option on saved files when not loggedIn



0. Prevent Default Drop across entire app
1. Testing
2. Delete File in edit modal
3. Change Permissions in edit modal
4. toggle collapse only if aria expanded...
5. Allow for dropped directories




