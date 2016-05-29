/* globals location */

const app = require('./app.js');


app.controller('signupController', function ($scope, $http) {

  $scope.submit = function () {
    $http({
      method: 'POST',
      url: '/signup',
      data: {username: $scope.username, password: $scope.password}
    })
    .then( function (results) { console.log(results); location.href = '/'; })
    .catch( function (error) { console.error(error); });
  };
  
  $scope.username = '';
  $scope.password = '';
});

app.controller('loginController', function ($scope, $http) {

  $scope.submit = function () {
    $http({
      method: 'POST',
      url: '/login',
      data: {username: $scope.username, password: $scope.password}
    })
    .then( function (results) { console.log(results); location.href = '/'; })
    .catch( function (error) { console.error(error); });
  };
  
  $scope.username = '';
  $scope.password = '';
});

