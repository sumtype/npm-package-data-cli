'use strict';
const path = require('path'), request = require('superagent'), npmUserPackages = require('npm-user-packages'), parseNpmPackageData = require(path.join(__dirname, 'parseNpmData')).parseNpmPackageData, parseNpmDownloadData = require(path.join(__dirname, 'parseNpmData')).parseNpmDownloadData, EventEmitter = require('events').EventEmitter;
module.exports = exports = function(username, callback) {
  new NpmUserData(username, callback);
};
var NpmUserData = function(username, callback) {
  var totalNpmDownloadCount = 0, lastMonthNpmDownloadCount = 0, currentTotalNpmDownloads = 0, currentLastMonthNpmDownloads = 0, totalNpmDownloadsComplete = false, lastMonthNpmDownloadsComplete = false, processedNpmData = null;
  EventEmitter.call(this);
  this.on('totalNpmDownloadProgress', () => {
    currentTotalNpmDownloads += 1;
    if (currentTotalNpmDownloads === totalNpmDownloadCount) totalNpmDownloadsComplete = true;
    this.emit('returnNpmData');
  });
  this.on('lastMonthNpmDownloadProgress', () => {
    currentLastMonthNpmDownloads += 1;
    if (currentLastMonthNpmDownloads === lastMonthNpmDownloadCount) lastMonthNpmDownloadsComplete = true;
    this.emit('returnNpmData');
  });
  this.on('returnNpmData', () => {
    if (totalNpmDownloadsComplete && lastMonthNpmDownloadsComplete) callback(processedNpmData);
  });
  var that = this;
  npmUserPackages(username).then((npmData) => {
    var date = new Date(), year = date.getFullYear().toString(), month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString(), day = date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate().toString();
    npmData = parseNpmPackageData(npmData);
    processedNpmData = npmData;
    totalNpmDownloadCount = npmData.length;
    lastMonthNpmDownloadCount = npmData.length;
    for (let i = 0; i < npmData.length; i++) {
      let lastMonthDownloadsUrl = 'https://api.npmjs.org/downloads/point/last-month/' + npmData[i]['name'].toString();
      request.get(lastMonthDownloadsUrl).end((err, npmLastMonthDownloadsRes) => {
        processedNpmData[i]['last_month_downloads'] = npmLastMonthDownloadsRes.body['downloads'] ? npmLastMonthDownloadsRes.body['downloads'] : 0;
        that.emit('lastMonthNpmDownloadProgress');
      });
      let totalDownloadsUrl = 'https://api.npmjs.org/downloads/range/2009-01-01:' + year + '-' + month + '-' + day + '/' + npmData[i]['name'].toString();
      request.get(totalDownloadsUrl).end((err, npmTotalDownloadsRes) => {
        processedNpmData[i]['total_downloads'] = parseNpmDownloadData(npmTotalDownloadsRes.body);
        that.emit('totalNpmDownloadProgress');
      });
    }
  });
};
NpmUserData.prototype = Object.create(EventEmitter.prototype);
