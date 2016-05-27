
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
chai.use(chaiAsPromised);
const axios = require('axios');
const db = require(__dirname + '/../../database/database.js')(__dirname + '/../../../database/authentication-test.sqlite3');

var cookie;

xdescribe('Authentication Unit Tests', function() {
  beforeEach(function (done) {
    done();
  });

  it('should block the protected page', function() {
    return expect(
      axios.get('http://localhost:8000/protected')
      .catch(function (error) { return Promise.resolve(error); })
      .then(function (res) { return Promise.resolve(res.status); })
    ).to.eventually.equal(400);
  });
  
  it('should wipe the test database before the following tests', function () {
    db.initialize(true); // reset the tables;
    expect(true).to.equal(true);
  });

  it('should create a session token and save it as a cookie', function () {
    return expect(
      axios.post('http://localhost:8000/signup?test=true', {username: 'louie', password: 'password123'})
      .then(function (res) { 
        cookie = res.headers['set-cookie'][0].split(';')[0];
        return Promise.resolve(res.status);
      })
    ).to.eventually.equal(200);
  });

  it('should use the cookie to access the protected page', function () {
    return expect(
      axios.get('http://localhost:8000/protected', {headers: {cookie: cookie}})
      .catch(function (val) {return Promise.resolve(val);})
      .then(function (res) { return Promise.resolve(res.status); })
    ).to.eventually.equal(200);
  });



});




