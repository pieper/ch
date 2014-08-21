//
// Copyright 2014 Isomics, Inc.
// Author: Steve Pieper
//
// Distributed under the terms of the Slicer License v 1.0
// (see License.txt in this distribution).
//

//
// This is the main entry point for the ch package
//

exports.ch           = require('./chlib/ch');

exports.ch.modules = {}
exports.ch.modules.contextPaths = require('./chlib/contextPaths');
exports.ch.modules.context      = require('./chlib/context');
exports.ch.modules.views        = require('./chlib/views');

