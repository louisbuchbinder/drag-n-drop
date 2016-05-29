const app = require('./app.js');

var setUsername, getUsername, isLoggedIn;

app.controller('navigationController', function ($scope, $http) {
  
  $scope.loggedIn = false;
  $scope.username = null;

  isLoggedIn = function () {
    return $scope.loggedIn;
  };

  getUsername = function () { return $scope.username; };

  setUsername = function () {
    return $http({
      url:'/username',
      method:'GET'
    })
    .then(function (results) {
      var username = results.data.username;
      $scope.username = username;
      if (username) {
        $scope.loggedIn = true; 
      } else {
        $scope.loggedIn = false;        
      }
      return username;
    })
    .catch(function () {
      $scope.loggedIn = false;
    });
  };
  setUsername();

});

// not sure if this is the best way to do this. Probably a better way...
module.exports.isLoggedIn = function () { return isLoggedIn(); };
module.exports.setUsername = function () { return setUsername(); };
module.exports.getUsername = function () { return getUsername(); };
