/*globals XMLHttpRequest*/

const $ = require('jquery');

const updateFiles = require('./files.js');

$(function () {

  const allowDrop = function (event) { event.preventDefault(); };

  const sendFile = function (file) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/save', true);
    xhr.setRequestHeader('filename', file.name);
    xhr.send(file);

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        updateFiles(file.name);
      }
    };
  };

  const extractData = function (event) {};


  const drop = function (event) {
    event.preventDefault();
    event.dataTransfer = event.originalEvent.dataTransfer;

    // currently only hardcoded for single files
    var file = event.dataTransfer.files[0];
    
    sendFile(file);
  };

  const $dropbox = $('#dropbox');
  $dropbox.on({drop: drop, dragover: allowDrop});
});
