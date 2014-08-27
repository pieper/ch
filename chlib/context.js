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

var _defaultOptions = {
  eachCallback : function(value, key, list) {},
  finishedCallback : function() {},
  errorCallback : console.log,
}

/**
 * Calls the eachCallback for every query in the database.
 * Calls the finishedCallback after all have been processed.
 */
exports._each = function(group_level, options) {
  options = _.defaults(options || {}, _defaultOptions);
  options.viewOptions = _.defaults(options.viewOptions || {}, _commonOptions);
  options.viewOptions.group_level = group_level;
  return options.ch.chronicle.view('instances/context', options.viewOptions, function(err,response) {
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

// Since this can buffer a lot of view rows before
// calling the callback, consider using the 'request'
// return value with a stream as shown in experiments/procedures.js
exports.eachSeries = function(options) {
  return exports._each(3, options);
}

var instancesDesign = {
    views : {
        context : {
            map :
              function(doc) {
                var tags = [
                  ['institution', '00080080', 'UnspecifiedInstitution'],
                  ['patientID', '00100020', 'UnspecifiedPatientID'],
                  ['studyUID', '0020000D', 'UnspecifiedStudyUID'],
                  ['studyDescription', '00081030', 'UnspecifiedStudyDescription'],
                  ['seriesUID', '0020000E', 'UnspecifiedSeriesUID'],
                  ['seriesDescription', '0008103E', 'UnspecifiedSeriesDescription'],
                  ['instanceUID', '00080018', 'UnspecifiedInstanceUID'],
                  ['modality', '00080060', 'UnspecifiedModality'],
                ];
                var key = {};
                if (doc.dataset) {
                  var i;
                  for (i = 0; i < tags.length; i++) {
                    var tag = tags[i];
                    var name     = tag[0];
                    var t        = tag[1];
                    var fallback = tag[2];
                    key[name] = fallback;
                    if (doc.dataset[t] && doc.dataset[t].Value) {
                      key[name] = doc.dataset[t].Value || fallback;
                    }
                  }
                  emit([
                      [key.institution,key.patientID],
                      [key.studyDescription,key.studyUID],
                      [key.modality,key.seriesDescription,key.seriesUID],
                      key.instanceUID
                    ],
                    1
                  );
                }
              },
            reduce : "_count()",
        },
        seriesInstances : {
            map :
              function(doc) {
                var tags = [
                  ['seriesUID', '0020000E', 'UnspecifiedSeriesUID'],
                  ['classUID', '00080016', 'UnspecifiedClassUID'],
                  ['instanceUID', '00080018', 'UnspecifiedInstanceUID'],
                ];
                var key = {};
                if (doc.dataset) {
                  var i;
                  for (i = 0; i < tags.length; i++) {
                    var tag = tags[i];
                    var name     = tag[0];
                    var t        = tag[1];
                    var fallback = tag[2];
                    key[name] = fallback;
                    if (doc.dataset[t] && doc.dataset[t].Value) {
                      key[name] = doc.dataset[t].Value || fallback;
                    }
                  }
                  emit( key.seriesUID, [key.classUID, key.instanceUID] );
                }
              },
            reduce : "_count()",
        },
        instanceReferences : {
            "map" :
              // TODO: this needs to be generalized to instance->instance reference
              // for now this is specific to instancePoints
              function(doc) {
                if (doc.instancePoints) {
                  instanceUIDs = Object.keys(doc.instancePoints);
                  for (var i in instanceUIDs) {
                    emit( instanceUIDs[i], doc._id );
                  }
                }
              },
            reduce : "_count()",
        }
    }
}

exports._design = { instances : instancesDesign };
