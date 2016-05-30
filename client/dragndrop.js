/*globals XMLHttpRequest*/

const $ = require('jquery');

const app = require('./app.js');
app.controller('dropController', function ($scope, $sharedProps) {

  const allowDrop = function (event) { event.preventDefault(); };

  const sendFile = function (file) {
    console.log('send file');
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/save', true);
    xhr.setRequestHeader('filename', file.name);
    xhr.send(file);

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 400) {
        console.error('400 received');
        // xhr.abort();
      }
      if (xhr.readyState === 4 && xhr.status === 200) {
        // updateFiles(file.name);
        $sharedProps.updateFiles[0](file.name, function () {

          console.log('saved');
          $scope.lastFile = $sharedProps.lastFile[0];
          $scope.saved = true;
          $scope.processing = false;
        });

      }
    };
  };

  const extractData = function (event) {};

  const blockDrop = function (event) { event.preventDefault(); }; 

  const drop = function (event) {
    console.log('drop file');
    $scope.$apply(function () { 
      $scope.saved = false;
      $scope.processing = true; 
    });
    event.preventDefault();
    event.dataTransfer = event.originalEvent.dataTransfer;
    // currently only hardcoded for single files
    var file = event.dataTransfer.files[0];
    sendFile(file);
  };

  $('body').on({drop: blockDrop, dragover: allowDrop});

  const $dropbox = $('#dropbox');
  $dropbox.on({drop: drop});    

  $scope.loggedIn = $sharedProps.loggedIn;
  $scope.username = $sharedProps.username;

});
