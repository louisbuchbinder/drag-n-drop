const angular = require('angular');

const $ = require('jquery');

var files = [];
var updateFiles = function () {};
// const updateFiles = (filename) => {
//   $.ajax({
//     method: 'GET',
//     url: '/files' + '?filename='+filename,
//     success: (results) => {
//       console.log(results, files);
//       results.forEach((file) => files.push(file));
//     },
//     error: (error) => console.log(error)
//   });
// };


var app = angular.module('app', []);
// var savedFiles = angular.module('savedFiles', []);
files.push({filename:'myFile', link:'/link'});

// console.log(files);

// var updateFiles = function () {};


app.controller('savedFiles', function ($scope, $http) {
  // $scope.files = ['file1.txt', 'file2.txt'];
  // $scope.files = currentDirectory.files;

  updateFiles = (filename) => {
    console.log('update called on ' + filename);
    $http({
      method: 'GET',
      url: '/files' + '?filename='+filename
    })
    .then( (results) => {
      console.log(results);
      results.data.forEach((file) => files.push(file));
    })
    .catch( (error) => console.log(error) )
    .then(() => console.log(files));
  };
  


  $scope.updateFiles = updateFiles;

  $scope.files = files;
  updateFiles('all');
});



module.exports = (filename) => {updateFiles(filename);};




