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
var cradle = require("commander");
var cradle = require("cradle");
var moment = require("moment");
var _      = require("underscore");
var util   = require("util");

moment();

// this package
var chlib = require("../");

// ch options
var _defaultOptions = {
  database: 'chronicle',
  cradleOptions: {
    host: '127.0.0.1',
    port: 5984,
  },
}

// create and return a new object
// -- modules are defined in chlib's index.js
exports.Connection = function Connection(options) {
  options = _.defaults(options || {}, _defaultOptions);

  // set up the connection to the database
  this.couchdb = new(cradle.Connection)(options.cradleOptions);
  this.chronicle = this.couchdb.database(options.database);
  var connection = this;

  // register the design documents with the database
  // (Note: since couchdb caches a hash of the design document
  // this operation is lightweight after the first time)
  _.each(chlib.ch.modules, function(element, index, list) {
    design = element._design || {};
    _.each(design, function(value,key) {
      connection.chronicle.save('_design/'+key, value);
    });
  });

  // associate method modules with new connection instance
  _.each(chlib.ch.modules, function(element, index, list) {
    connection[index] = element;
  });
};
