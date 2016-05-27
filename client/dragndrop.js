/*globals XMLHttpRequest*/

const $ = require('jquery');

const updateFiles = require('./files.js');

$(() => {

  const allowDrop = (event) => event.preventDefault(); 

  const sendFile = (file) => {
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

  const extractData = (event) => {};


  const drop = (event) => {
    event.preventDefault();
    event.dataTransfer = event.originalEvent.dataTransfer;

    // currently only hardcoded for single files
    var file = event.dataTransfer.files[0];
    
    sendFile(file);
  };

  const $dropbox = $('#dropbox');
  $dropbox.on({drop: drop, dragover: allowDrop});
});
