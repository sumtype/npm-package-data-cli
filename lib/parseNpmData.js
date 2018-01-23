'use strict';
var parseNpmPackageData = function(data) {
  let output = [];
  for (let i = 0; i < data.length; i++) {
    let entry = {};
    entry['name'] = data[i]['name'];
    entry['description'] = data[i]['description'];
    entry['url'] = 'https://www.npmjs.com/package/' + data[i]['name'].toString();
    entry['github'] = data[i]['homepage'];
    entry['version'] = data[i]['version'];
    output.push(entry);
  }
  return output;
};
exports.parseNpmPackageData = parseNpmPackageData;
var parseNpmDownloadData = function(data) {
  var output = 0;
  if(data['downloads']) for (let i = 0; i < data['downloads'].length; i++) output += data['downloads'][i]['downloads'];
  return output;
};
exports.parseNpmDownloadData = parseNpmDownloadData;
module.exports = exports;
