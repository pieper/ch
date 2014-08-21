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

/**
 * Calls the eachCallback for every series in the database.
 * Calls the finishedCallback after all have been processed.
 */
exports.eachSeries = function(ch, eachCallback,finishedCallback) {
  viewOptions = {
    reduce: true,
    group_level: 3,
    stale: 'update_after',
  };
  ch.chronicle.view('instances/context', viewOptions, function(err,response) {
    if (err) {
      console.log(err);
      return;
    }
    response.forEach(eachCallback);
    finishedCallback();
  });
}
