// const angular = require('angular');
const app = require('./app.js');

var files = [];
var updateFiles = function () {};


// var app = angular.module('app', []);


app.controller('savedFiles', function ($scope, $http) {

  updateFiles = (filename) => {
    // use filename='all' to update all files
    $http({
      method: 'GET',
      url: '/files' + '?filename='+filename
    })
    .then( (results) => results.data.forEach((file) => files.push(file)) )
    .catch( (error) => console.error(error) );
  };
  
  $scope.updateFiles = updateFiles;

  $scope.files = files;
  updateFiles('all');
});

module.exports = (filename) => updateFiles(filename);

