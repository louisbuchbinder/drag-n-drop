const app = require('./app.js');


app.controller('formController', function ($scope, $http) {

  $scope.submit = function (action) {
    $http({
      method: 'POST',
      url: action,
      data: {username: $scope.username, password: $scope.password}
    })
    .then( function (results) { console.log(results); })
    .catch( function (error) { console.error(error); });
  };
  


  $scope.username = '';
  $scope.password = '';
});
