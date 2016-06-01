/*globals XMLHttpRequest*/

const $ = require('jquery');

const resetXHR = (xhr) => {
  // on a failed xmlHttpRequest the subsequent request is blocked for some reason so my hacky solution at this point is to sumbit a blank post to wipe the xmlHttpRequest and allow for the next real request to function correctly
  xhr = new XMLHttpRequest();
  xhr.open('POST', '/save', true);
  xhr.setRequestHeader('filename', 'empty');
  xhr.send();
  setTimeout(() => { xhr.abort(); }, 1000); // super hacky wait for the request to reach the server before aborting. The abort is to stop the request on the client side. Although the request is not visible to the /save on the backend either way. Very strange behavior.
};

const app = require('./app.js');
app.controller('dropController', function ($scope, $sharedProps) {

  const allowDrop = function (event) { event.preventDefault(); };

  const sendFile = function (file) {
    console.log('send file');
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/save', true);
    xhr.setRequestHeader('filename', file.name);
    xhr.send(file);

    xhr.onreadystatechange = function() {

      if (xhr.readyState === 4 && xhr.status === 400) {
        $scope.$apply(function () { 
          $scope.errorMessage = xhr.response;
          $scope.error = true;
          $scope.processing = false;
        });
        resetXHR(xhr);
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
      $scope.error = false;
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
