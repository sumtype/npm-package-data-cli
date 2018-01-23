#!/usr/bin/env node
'use strict';
const path = require('path');
var packageData = require(path.join(__dirname, '..', 'lib', 'getNpmData'));
process.argv[2] ? packageData(process.argv[2], (data) => {
  var totalUserPackageDownloads = 0;
  for (let i = 0; i < data.length; i++) totalUserPackageDownloads += data[i]['total_downloads'];
  console.log();
  console.log(process.argv[2], 'package downloads: ', totalUserPackageDownloads);
  for(let i = 0; i < data.length; i++) {
    console.log();
    console.log('Name: ', data[i]['name']);
    console.log('Description: ', data[i]['description']);
    console.log('Version: ', data[i]['version']);
    console.log('Total downloads: ', data[i]['total_downloads']);
    console.log('Downloads last month: ', data[i]['last_month_downloads']);
    console.log('Github url: ', data[i]['github']);
    console.log('NPM url: ', data[i]['url']);
    if (i + 1 === data.length) console.log();
  }
}) : console.log('You must specify a username to search for package information.');
