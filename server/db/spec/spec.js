
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var expect = chai.expect;
chai.use(chaiAsPromised);

var db = require(__dirname + '/../database.js')('test');


describe('Database Unit Tests', function() {
  // reset the tables
  beforeEach((done) => db.initialize(true, () => done()));

  it('should insert items into the database', function() {
    return expect(db.insertInto('users', {username: 'louie', password: 'pass', created: String(Date.now())})
    .then((results)=>results.command))
    .to.eventually.equal('INSERT');
  });

  it('should fetch items previously stored in the database', function() {
    var username = 'louie';
    return expect(
      db.insertInto('users', {username: username, password: 'pass', created: String(Date.now())})
      .then(() => {
        return db.fetch('users', 'username, password', {username: username})
        .then((results) => results.rows)
      })
    ).to.eventually.deep.equal([{username:'louie',password:'pass'}]);
  });

  it('should join items from the database', function() {
    return expect(db.insertInto('users', {username: 'louie', password: 'pass', created: String(Date.now())})
    .then(() => db.insertInto('users', {username: 'john', password: 'pass', created: String(Date.now())}))
    .then(() => db.insertInto('files', {userindex: '1', filename: 'myfile', filedata: 'myfiledata'}))
    .then(() => db.insertInto('files', {userindex: '1', filename: 'myfile2', filedata: 'myfiledata2'}))
    .then(() => db.insertInto('files', {userindex: '2', filename: 'myfile3', filedata: 'myfiledata3'}))
    .then(() => db.join('users', 'files', {'users.username': 'louie', 'users.index': 'files.userindex'}, 'JOIN', 'filename, filedata'))
    .then((results) => results.rows)
    ).to.eventually.deep.equal([ { filename: 'myfile', filedata: 'myfiledata' }, { filename: 'myfile2', filedata: 'myfiledata2' } ]);
  });
});




