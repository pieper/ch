//
// Copyright 2014 Isomics, Inc.
// Author: Steve Pieper
//
// Distributed under the terms of the Slicer Licesnse v 1.0
// (see License.txt in this distribution).
//

//
// Provide helper functions for accessing the context view
//

_ = require("underscore");

//---------------------------------------------------------------------------

var _commonOptions = {
  reduce: true,
  stale: 'update_after',
}

/**
 * Calls the eachCallback for every series in the database.
 * Calls the finishedCallback after all have been processed.
 */
exports._each = function(group_level, options) {
  options.viewOptions = _.defaults(options.viewOptions || {}, _commonOptions);
  options.viewOptions.group_level = group_level;
  options.ch.chronicle.view('instances/context', options.viewOptions, function(err,response) {
    if (err) {
      options.errorCallback(err);
      return;
    }
    response.forEach(options.eachCallback);
    options.finishedCallback();
  });
}

exports.eachPatient = function(options) {
  return exports._each(1, options);
}

exports.eachStudy = function(options) {
  return exports._each(2, options);
}

// Don't use until cradle view response is streamed
exports.eachSeries = function(options) {
  return exports._each(3, options);
}
