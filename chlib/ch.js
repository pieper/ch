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

var _ = require("underscore");
var util = require("util");
var cradle = require("cradle");
var chlib = require("../");

exports.options = {
  database: 'chronicle',
}

exports.setup = function (settings) {
  cradle.setup(settings);  
  if (settings.database) {
    this.database = database;
  }
}

exports.Connection = function Connection() {
  this.couchdb = new(cradle.Connection)();
  this.chronicle = this.couchdb.database('chronicle');

  var connection = this;
  _.each(chlib.ch.modules, function(element, index, list) {
    connection[index] = element;
  });
}
