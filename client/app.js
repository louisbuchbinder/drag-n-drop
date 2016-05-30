
const angular = require('angular');
require('angular-route');
const app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl : 'pages/home.html'
  })
  .when('/about', {
    templateUrl : 'pages/about.html'
  })
  .when('/login', {
    templateUrl : 'pages/login.html'
  })
  .when('/signup', {
    templateUrl : 'pages/signup.html'
  })
  .when('/files', {
    templateUrl : 'pages/files.html'//,
  })
  .when('/logout', {
    templateUrl : 'pages/home.html',
    controller  : 'logoutController'
  });

  $locationProvider.html5Mode(true);
});


app.service('$sharedProps', function () {
  var loggedIn = [false];
  var username = [null];
  return {
    loggedIn: loggedIn,
    username: username
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

