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

exports.ch.modules              = {}
exports.ch.modules.activities   = require('./chlib/activities');
exports.ch.modules.agents       = require('./chlib/agents');
exports.ch.modules.context      = require('./chlib/context');
exports.ch.modules.contextPaths = require('./chlib/contextPaths');
exports.ch.modules.dicom        = require('./chlib/dicom');
exports.ch.modules.steps        = require('./chlib/steps');
exports.ch.modules.tags         = require('./chlib/tags');
exports.ch.modules.views        = require('./chlib/views');

