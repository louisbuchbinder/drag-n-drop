  const angular = require('angular');
require('angular-route');
const app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl : 'pages/home.html'//,
    // controller  : 'homeController'
  })
  .when('/about', {
    templateUrl : 'pages/about.html'//,
    //controller  : 'aboutController'
  })
  .when('/login', {
    templateUrl : 'pages/login.html'//,
    // controller  : 'loginController'
  })
  .when('/signup', {
    templateUrl : 'pages/signup.html'//,
    // controller  : 'signupController'
  })
  // .when('/drop', {
  //   templateUrl : 'pages/drop.html'//,
  //   // controller  : 'dropController'
  // })
  .when('/files', {
    templateUrl : 'pages/files.html'//,
    // controller  : 'filesController'
  })
  .when('/logout', {
    templateUrl : 'pages/home.html',
    controller  : 'logoutController'
  });

  $locationProvider.html5Mode(true);
});


app.service('$sharedProps', function () {
  var loggedIn = false;
  var username = null;
  return {
    getLoggedIn: function () {
        return loggedIn;
    },
    setLoggedIn: function(value) {
        loggedIn = value;
    },
    getUsername: function () {
        return username;
    },
    setUsername: function(value) {
        username = value;
    }
  };
});


app.controller('homeController', function ($scope) {

});

app.controller('aboutController', function ($scope) {});


/* globals location */
app.controller('logoutController', function ($scope, $http) {
  $http({
    url: '/logout',
    method: 'GET'
  })
  .then(function () {
    location.href = '/';
  });
});


module.exports = app;

