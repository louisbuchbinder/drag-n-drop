
require('dotenv').config({path: __dirname + '/../../../.envTest'});
require(__dirname + '/../../../index.js');
const port = process.env.PORT || 3001;



const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
chai.use(chaiAsPromised);
const axios = require('axios');
// come back to this to add tests
const db = require(__dirname + '/../../db/database.js');

var cookie;

describe('Authentication Integration Tests', function() {
  beforeEach(function (done) {
    done();
  });

  it('should block the protected page', function() {
    return expect(
      axios.get('http://localhost:' + port + '/protected')
      .catch(function (error) { return error; })
      .then(function (res) { return res.status; })
    ).to.eventually.equal(400);
  });
  
  it('should wipe the test database before the following tests', function () {
    return expect(
      new Promise((resolve) => {
        db.initialize(true, () => resolve('clean')); // reset the tables;
      })).to.eventually.equal('clean');
  });

  it('should create a session token and save it as a cookie', function () {
    return expect(
      axios.post('http://localhost:' + port + '/signup', {username: 'louie', password: 'password123'})
      .then(function (res) { 
        cookie = res.headers['set-cookie'][0].split(';')[0];
        return res.status;
      })
    ).to.eventually.equal(201);
  });

  it('should use the cookie to access the protected page', function () {
    return expect(
      axios.get('http://localhost:' + port + '/protected', {headers: {cookie: cookie}})
      .catch(function (val) {return val; })
      .then(function (res) { return res.status; })
    ).to.eventually.equal(200);
  });
});




