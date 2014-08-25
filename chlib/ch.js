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
var _ = require("underscore");
var util = require("util");
var cradle = require("cradle");

// this package
var chlib = require("../");

// ch options
exports.options = {
  database: 'chronicle',
}

// setup routine, called when a new Connection is created
// -- settings allows user override
exports.setup = function (settings) {
  cradle.setup(settings);
  if (settings.database) {
    this.database = database;
  }
}

// create and return a new object
// -- modules are defined in chlib's index.js
exports.Connection = function Connection() {
  this.couchdb = new(cradle.Connection)();
  this.chronicle = this.couchdb.database('chronicle');

  var connection = this;
  _.each(chlib.ch.modules, function(element, index, list) {
    connection[index] = element;
  });
}
