
const bcrypt = require('bcrypt');
const saltRounds = 10;

const makeHash = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (error, salt) => {
      if (error) { return reject('issue generating the salt: ' + error); }
      bcrypt.hash(password, salt, (error, hash) => {
        if (error) { return reject('issue generating the hash' + error); } 
        resolve(hash);
      });
    });
  });
};

const checkHash = (password, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (error, bool) => {
      if (error) { return reject('some issue comparing the password: ' + error); }
      resolve(bool);
    });
  });
};

module.exports = {makeHash: makeHash, checkHash: checkHash};
