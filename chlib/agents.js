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

  ch.chronicle.view("activities/stepActivities", viewOptions, function(error,response) {
    console.log(response);
  });
}

var _agentOptionsDefaults = {
  stepName : "*",
  changeCallback : exports._changeCallback,
  cradleOptions : {},
}

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

  //options.ch.chronicle.info(function);

  var ch = options.ch;
  var feed = ch.chronicle.changes(options.cradleOptions);

  feed.on('change', function(change) {options.changeCallback(ch, change);});
}

