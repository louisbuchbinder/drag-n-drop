const app = require('./app.js');


app.controller('formController', function ($scope, $http) {

  $scope.submit = (action) => {
    $http({
      method: 'POST',
      url: action,
      data: {username: $scope.username, password: $scope.password}
    })
    .then( (results) => console.log(results) )
    .catch( (error) => console.error(error) );
  };
  


  $scope.username = '';
  $scope.password = '';
});
