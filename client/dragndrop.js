/*globals XMLHttpRequest*/

const $ = require('jquery');

const updateFiles = require('./files.js');

//$(function () {




//});
const app = require('./app.js');
app.controller('dropController', function ($scope, $sharedProps) {

  const allowDrop = function (event) { event.preventDefault(); };

  const sendFile = function (file) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/save', true);
    xhr.setRequestHeader('filename', file.name);
    xhr.send(file);

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // updateFiles(file.name);
        $sharedProps.updateFiles[0](file.name);
      }
    };
  };

  const extractData = function (event) {};

  const blockDrop = function (event) { event.preventDefault(); }; 

  const drop = function (event) {
    event.preventDefault();
    event.dataTransfer = event.originalEvent.dataTransfer;
    // currently only hardcoded for single files
    var file = event.dataTransfer.files[0];
    sendFile(file);
  };

  $('body').on({drop: blockDrop, dragover: allowDrop});

  const $dropbox = $('#dropbox');
  $dropbox.on({drop: drop, dragover: allowDrop});    
  $scope.loggedIn = $sharedProps.loggedIn;
  $scope.username = $sharedProps.username;
});
