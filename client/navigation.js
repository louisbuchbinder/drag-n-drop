
const app = require('./app.js');

app.controller('navigationController', function ($scope, $http, $sharedProps) {
  
  $scope.loggedIn = $sharedProps.loggedIn;
  $scope.username = $sharedProps.username;

  var setUsername = function () {
    return $http({
      url:'/username',
      method:'GET'
    })
    .then(function (results) {
      var username = results.data.username;
      $sharedProps.username[0] = username;
      if (username) {
        $sharedProps.loggedIn[0] = true;
      } else {
        $sharedProps.loggedIn[0] = false;        
      }
    })
    .catch(function () {
      $sharedProps.loggedIn[0] = false;
    });
  };
  setUsername();
});
