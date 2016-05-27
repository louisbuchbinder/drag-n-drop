
const $ = require('jquery');

const updateFiles = require('./files.js');

$(() => {
  // console.log(updateFiles);

  // files.push({name:'myFile', link:'/link'});
  // files.push({name:'myFile2', link:'/link2'});


  // const addToFilesList = (name, link) => {
  //   var files = require('./files.js');
  //   files.push({name: name, link: link});
  // };


  // require('./files.js')('myFile', '/link');



  const allowDrop = (event) => event.preventDefault(); 

  // const drag = (event) => event.dataTransfer.setData('text', event.target.id);

  const sendFile = (file) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/save', true);
    xhr.setRequestHeader('filename', file.name);
    xhr.send(file);


    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // var response = xhr.responseText.split(' /');
        // var text = response[0];
        // var link = '/' + response[1];
        // $('#message').text(text);
        // var $link = $('#link');
        // $link.attr('href', link);
        // $link.text(link);

        updateFiles(file.name);


        // require('./files.js')(file.name, link);
        

        // files.push({name:'myFile', link:'/link'});
        // files.push({name: name, link: link});
        // console.log('pushed to files', files);

      }
    };
  };

  const extractData = (event) => {};

  /*globals XMLHttpRequest*/

  const drop = (event) => {
    event.preventDefault();
    event.dataTransfer = event.originalEvent.dataTransfer;
    // var data = event.dataTransfer.getData('text'); 
    // console.log(data);

    var file = event.dataTransfer.files[0];


    // console.log(file);
    
    sendFile(file);
  };



  const $dropbox = $('#dropbox');

  $dropbox.on({drop: drop, dragover: allowDrop});
});
