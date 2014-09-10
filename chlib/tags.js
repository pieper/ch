//
// Copyright 2014 Isomics, Inc.
// Author: Steve Pieper
//
// Distributed under the terms of the Slicer License v 1.0
// (see License.txt in this distribution).
//

//
// Provide helper functions for accessing the bytags view
//

_ = require("underscore");
minimatch = require("minimatch");

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
  if (options.spec) {
    var split = options.spec.split(":");
    options.keyword = split[0];
    if (split[1]) {
      options.valueMatch = split[1];
    }
  }
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
    response.forEach(function(key,row,id) {
      if (options.valueMatch) {
        // if there's a valueMatch option, then check it.
        // -- either on the value itself if it's a string
        // -- or on the elements of a list
        var values = key[1];
        if (typeof values == 'string') {
          values = [values,];
        }
        var match = _.find(values,function(value) {
          if (typeof value == 'string') {
            if (minimatch(value, options.valueMatch)) {
              return value;
            }
          }
        });
        if (match) {
          options.eachCallback(key,row,id);
        }
      } else {
        options.eachCallback(key,row,id);
      }
    });
    options.finishedCallback();
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
