const angular = require('angular');
require('angular-route');
const app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl : 'pages/home.html',
    controller  : 'homeController'
  })
  .when('/about', {
    templateUrl : 'pages/about.html',
    controller  : 'aboutController'
  })
  .when('/login', {
    templateUrl : 'pages/login.html',
    controller  : 'loginController'
  })
  .when('/signup', {
    templateUrl : 'pages/signup.html',
    controller  : 'signupController'
  })
  .when('/drop', {
    templateUrl : 'pages/drop.html',
    controller  : 'dropController'
  })
  .when('/files', {
    templateUrl : 'pages/files.html',
    controller  : 'filesController'
  });

  $locationProvider.html5Mode(true);
});


app.controller('homeController', function ($scope) {});
app.controller('aboutController', function ($scope) {});


module.exports = app;

