// const angular = require('angular');
const app = require('./app.js');

var files = [];
var updateFiles = function () {};


// var app = angular.module('app', []);


app.controller('filesController', function ($scope, $http) {

  updateFiles = function (filename) {
    // use filename='all' to update all files
    // if (filename === 'all') { files = []; }
    $http({
      method: 'GET',
      url: '/fetchFiles' + '?filename='+filename
    })
    .then( function (results) { results.data.forEach(function (file) { files.push(file); }); })
    .catch( function (error) { console.error(error); });
  };
  
  $scope.updateFiles = updateFiles;
  $scope.files = files;

  if (files.length === 0) updateFiles('all');
});

module.exports = function (filename) { updateFiles(filename); };

