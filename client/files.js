
const app = require('./app.js');


app.controller('filesController', function ($scope, $http, $sharedProps) {
  $scope.loggedIn = $sharedProps.loggedIn;
  $scope.files = $sharedProps.files;
  var links = {};

  $sharedProps.updateFiles[0] = function (filename, callback) {
    // use filename='all' to update all files
    // if (filename === 'all') { files = []; }
    $http({
      method: 'GET',
      url: '/fetchFiles' + '?filename='+filename
    })
    .then( function (results) { 
      results.data.forEach(function (file, index) {
        if (!links[file.link]) $sharedProps.files.files.push(file); 
        links[file.link] = true;
        if (index === results.data.length -1) $sharedProps.lastFile[0] = file;
      });
      callback();
    })
    .catch( function (error) { console.error(error); });
  };
  
  $scope.setCurrent = function (data) {
    $scope.currentFile.filename = data.filename;
    $scope.currentFile.link = data.link;
  };
  
  /*globals alert*/
  $scope.inDevelopment = function () {
    alert('In Development!');
  };

  $scope.currentFile = {};
  $scope.updateFiles = $sharedProps.updateFiles;
  // $scope.files = files;

  if ($scope.files.files.length === 0) $sharedProps.updateFiles[0]('all', function () {});
});

