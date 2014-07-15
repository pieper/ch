//
// Copyright 2014 Isomics, Inc.
// Author: Steve Pieper
//
// Distributed under the terms of the Slicer Licesnse v 1.0
// (see License.txt in this distribution).
//

//
// This is the main entry point for the ch package
//

var contextPaths = require('./lib/contextPaths.js')
  , views = require('./lib/views.js')
  ;

exports.contextPaths = contextPaths;
exports.views = views;
