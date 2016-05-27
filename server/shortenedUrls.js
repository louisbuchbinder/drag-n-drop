'use strict';

var urls = {};
const alphabet = 'abcdefghijklmnopqrstuvwxyz';

const generateUrl = (url) => {
  url = url ? url : '';
  let index = Math.floor(Math.random() * alphabet.length);
  url += alphabet[index];

  if (url.length < 4) { return generateUrl(url); }
  if (urls[url]) { return generateUrl(url); }
  
  urls[url] = true; 
  return '/' + url;
};

const setExistingUrls = (existingUrls) => existingUrls.forEach((url) => urls[url] = true);

module.exports.setExistingUrls = setExistingUrls;
module.exports.generateUrl = generateUrl;
