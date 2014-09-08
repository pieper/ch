//
// Copyright 2014 Isomics, Inc.
// Author: Steve Pieper
//
// Distributed under the terms of the Slicer Licesnse v 1.0
// (see License.txt in this distribution).
//

//
// Provide helper functions for accessing the bytags view
//

_ = require("underscore");

//---------------------------------------------------------------------------

var _commonViewOptions = {
  reduce: false,
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
exports.each = function(options) {
  options = _.defaults(options || {}, _defaultOptions);
  options.viewOptions = _.defaults(options.viewOptions || {}, _commonViewOptions);
  var tag = options.tag;
  if (options.keyword) {
    tag = options.ch.dicom.dictionary.tagByKeyword[options.keyword];
  }
  if (tag) {
    options.viewOptions.startkey = [tag,""];
    options.viewOptions.endkey = [tag,{}];
  }
  return options.ch.chronicle.view('tags/byTagAndValue', options.viewOptions, function(err,response) {
    if (err) {
      options.errorCallback(err);
      return;
    }
    response.forEach(options.eachCallback);
    options.finishedCallback();
  });
}

// get a distribution of the values of the given tag
// - a count is returned for each unique value of the element
exports.elementValueDistribution  = function(tag, callback) {
  viewOptions = {
    startkey: [tag, ""],
    endkey  : [tag, {}],
    reduce: true,
    group_level: 2,
    stale: 'update_after'
  };
  chronicle.view('tags/byTagAndValue', viewOptions, function(err,response) {
    if (err) {
      console.log(err);
      return;
    }
    util.inspect(response);
    response.forEach(function(key,row,id) {
      callback(key,row);
    });
  });
}

var tagDesign = {
  views: {
    byTagAndValue: {
      map: function (doc) {
        var vrsToExclude = [ 'SQ', 'OW', 'OB', 'OW/OB', 'OW or OB', 'OB or OW', 'US or SS'];
        if (doc.dataset) {
          for (var key in doc.dataset) {
            if (doc.dataset.hasOwnProperty(key)) {
              if (! (doc.dataset[key].vr in vrsToExclude) ) {
                emit([key,doc.dataset[key].Value], 1);
              }
            }
          }
        }
      },
      reduce: "_count()"
    }
  }
};


exports._design = { tags : tagDesign };
