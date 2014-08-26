//
// Copyright 2014 Isomics, Inc.
// Author: Steve Pieper
//
// Distributed under the terms of the Slicer Licesnse v 1.0
// (see License.txt in this distribution).
//

//
// Provide helper functions related to processing steps as parts of procedures
//


//---------------------------------------------------------------------------


var _stepDocDefaults = {
  type : "ch.step",
  name : "Unnamed step",
  inputs : [],
  parameters : [],
  outputs : [],
  desiredProvenance : {},
}

var _stepOptionsDefaults = {
  callback : function(err,res) {console.log(err,res)},
}

/**
 * Add a step document to the database
 * Calls the finishedCallback after all have been processed.
 */
exports.step = function(options) {

  uid = options.ch.dicom.uid();
  options = _.defaults(options || {}, _stepOptionsDefaults);
  options.doc = _.defaults(options.doc || {}, _stepDocDefaults);

  console.log('saving ', uid, options);
  return options.ch.chronicle.save(uid, options.doc, options.callback);
}

var stepsDesign = {
    views : {
        byName : {
            map :
              function(doc) {
                if (doc.type === 'ch.step') {
                  emit( doc.name, 1 );
                }
              },
            reduce : "_count()",
        },
    }
}

exports._design = { steps : stepsDesign };
