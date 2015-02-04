//
// Copyright 2014 Isomics, Inc.
// Author: Steve Pieper
//
// Distributed under the terms of the Slicer License v 1.0
// (see License.txt in this distribution).
//

//
// Overall access to the database
//


//---------------------------------------------------------------------------

// npm provided standard utilities
var commander = require("commander");
var nano    = require("nano");
var moment    = require("moment");
var _         = require("underscore");
var util      = require("util");

// this package
var chlib = require("../");

// ch options
var _defaultOptions = {
  database: 'chronicle',
  nanoOptions: {
    url: 'http://127.0.0.1:5984',
  },
}

// create and return a new object
// -- modules are defined in chlib's index.js
exports.Connection = function Connection(options) {
  options = _.defaults(options || {}, _defaultOptions);

  // set up the connection to the database
  this.nano = nano(options.nanoOptions);
  this.chronicle = this.nano.use(options.database);
  var connection = this;

  // register the design documents with the database
  // (Note: since couchdb caches a hash of the design document
  // this operation is lightweight after the first time)
  _.each(chlib.ch.modules, function(element, index, list) {
    design = element._design || {};
    _.each(design, function(value,key) {
      connection.chronicle.insert(value, '_design/'+key);
    });
  });

  // associate method modules with new connection instance
  _.each(chlib.ch.modules, function(element, index, list) {
    connection[index] = element;
  });
};
