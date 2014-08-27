//
// Copyright 2014 Isomics, Inc.
// Author: Steve Pieper
//
// Distributed under the terms of the Slicer Licesnse v 1.0
// (see License.txt in this distribution).
//

//
// Provide helper functions related to making agents to engage in 
// activities related to performing steps in response to a changes
// feed from the steps view
//


//---------------------------------------------------------------------------

moment = require('moment');

// When a change that matches the stepActivities filter is received, this callback
// prints out a time-stamped list of all the activities related to that
// step.
exports._changeCallback = function(ch, change) {
  startkey = [change.id,];
  endkey = [change.id, {}];
  viewOptions = {
    reduce : true,
    level : 1,
    startkey : startkey,
    endkey : endkey,
    stale : 'update_after',
  };

  console.log('got a change for step', change.id);
  ch.chronicle.view("activities/stepActivities", viewOptions, function(error,response) {
    if (error) {
      console.log(error);
    } else {
      console.log("At", moment().format(), "stepActivities for", change.id, ":", response);
    }
  });
}

// by default, look at all steps
var _agentOptionsDefaults = {
  stepName : "*",
  changeCallback : exports._changeCallback,
  cradleOptions : {},
}

// filter the changes feed to only look for step activities
var _agentCradleDefaults = {
  filter : "_view",
  view : "activities/stepActivities",
}

/**
 * Starts an agent based on any steps that don't have an
 * activity marked finalized
 * 
 */
exports.agent = function(options) {

  options = _.defaults(options || {}, _agentOptionsDefaults);
  options.cradleOptions = _.defaults(_agentCradleDefaults);

  // find out the current sequence number and then
  // listen for all subsequent changes
  options.ch.chronicle.info(function (err, info) {
    var ch = options.ch;
    options.cradleOptions.since = info.committed_update_seq;
    var feed = ch.chronicle.changes(options.cradleOptions);

    feed.on('change', function(change) {options.changeCallback(ch, change);});
  });

}

