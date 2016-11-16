'use strict';

const url      = require('url'),
      requestp = require('request-promise');

/* Litmus */
function Litmus(options){
  if(!options) { throw new Error('Error. No options were passed in.')}
  this.options = options;
}

/**
 * Litmus Request
 * Wraps all requests from Litmus with correct options
 **/

Litmus.prototype.request = function(method, urlPath, body) {
  var options = this.options;
  options.uri = url.resolve(options.base, urlPath);
  options.method = method;
  if( (options.method === 'POST') || (options.method === 'PUT') ) {
    options.headers = { 'Content-type': 'application/xml', 'Accept': 'application/xml' };
    options.body = body;
  }
  return requestp(options);
};

/**
 * TestSet Methods
 * Functions that deal with reading/updating/deleting TestSets
 **/

Litmus.prototype.getTests = function() {
  var urlPath = 'tests.xml';
  return this.request('GET', urlPath, null);
};

Litmus.prototype.getTest = function(testId) {
  var urlPath = 'tests/'+ testId +'.xml';
  return this.request('GET', urlPath, null);
};

Litmus.prototype.updateTest = function(testId, body) {
  var urlPath = 'tests/'+ testId +'.xml';
  return this.request('PUT', urlPath, body);
};  

Litmus.prototype.deleteTest = function(testId) {
  var urlPath = 'tests/'+ testId +'.xml';
  return this.request('DELETE', urlPath, null);
};

/**
 * TestSet Version Methods
 * Functions that deal with creating/reading/polling TestSet Versions
 **/

Litmus.prototype.getVersions = function(testId) {
  var urlPath = 'tests/'+ testId +'/versions.xml';
  return this.request('GET', urlPath, null);
};

Litmus.prototype.getVersion = function(testId, version) {
  var urlPath = 'tests/'+ testId +'/versions/'+ version +'.xml';
  return this.request('GET', urlPath, null);
};

Litmus.prototype.createVersion = function(testId) {
  var urlPath = 'tests/'+ testId +'/versions.xml';
  return this.request('POST', urlPath, null);
};

Litmus.prototype.pollVersion = function(testId, version) {
  var urlPath = 'tests/'+ testId +'/versions/'+ version +'/poll.xml';
  return this.request('GET', urlPath, null);
};

/**
 * Results Methods
 * Functions that deal with reading/updating/retesting Results
 **/

Litmus.prototype.getResults = function(testId, version) {
  var urlPath = 'tests/'+ testId +'/versions/'+ version +'/results.xml';
  return this.request('GET', urlPath, null);
};

Litmus.prototype.getResult = function(testId, version, resultId) {
  var urlPath = 'tests/'+ testId +'/versions/'+ version +'/results/'+ resultId +'.xml';
  return this.request('GET', urlPath, null);
};

Litmus.prototype.updateResult = function(testId, version, resultId, body) {
  var urlPath = 'tests/'+ testId +'/versions/'+ version +'/results/'+ resultId +'.xml';
  return this.request('PUT', urlPath, body);
};

Litmus.prototype.retestResult = function(testId, version, resultId) {
  var urlPath = 'tests/'+ testId +'/versions/'+ version +'/results/'+ resultId +'/retest.xml';
  return this.request('POST', urlPath, null);
};

/**
 * Creates Litmus Email Test on the Litmus server
 **/

Litmus.prototype.createEmailTest = function(body) {
  var urlPath = 'emails.xml';
  return this.request('POST', urlPath, body);
};

/**
 * Retrieves possible Email clients to test on
 **/

Litmus.prototype.getEmailClients = function() {
  var urlPath = 'emails/clients.xml';
  return this.request('GET', urlPath, null);
};

module.exports = Litmus;