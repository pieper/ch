//
// Copyright 2014 Isomics, Inc.
// Author: Steve Pieper
//
// Distributed under the terms of the Slicer Licesnse v 1.0
// (see License.txt in this distribution).
//

//
// Provide helper functions related to activity related so a procedure step
//


//---------------------------------------------------------------------------


var _activityDocDefaults = {
  type : "ch.activity",
  status : "Unknown status",
  stamp : NaN,
  agent : "Unknown agent",
}

var _activityOptionsDefaults = {
  callback : function(err,res) {console.log('saved activity', err,res)},
}

/**
 * Add a activity document to the database
 * Calls the finishedCallback after all have been processed.
 */
exports.activity = function(options) {

  uid = options.ch.dicom.uid();
  options = _.defaults(options || {}, _activityOptionsDefaults);
  options.doc = _.defaults(options.doc || {}, _activityDocDefaults);

  console.log('saving activity', uid, options.doc);
  return options.ch.chronicle.save(uid, options.doc, options.callback);
}

var activitiesDesign = {
    views : {
        byStatus : {
            map :
              function(doc) {
                if (doc.type === 'ch.activity') {
                  emit( [doc.status, doc.agent, doc.step], 1 );
                }
              },
            reduce : "_count()",
        },
        byTime : {
            map :
              function(doc) {
                if (doc.type === 'ch.activity') {
                  emit( [doc.stamp, doc.agent, doc.step], 1 );
                }
              },
            reduce : "_count()",
        },
        stepActivities : {
            map :
              function(doc) {
                if (doc.type === 'ch.activity') {
                  emit( [doc.step, doc.status], 1 );
                }
                if (doc.type === 'ch.step') {
                  emit( [doc._id, ''], 1 );
                }
              },
            reduce : "_count()",
        },
    }
}

exports._design = { activities : activitiesDesign };
