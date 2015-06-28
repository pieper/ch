//
// Copyright 2014 Isomics, Inc.
// Author: Steve Pieper
//
// Distributed under the terms of the Slicer License v 1.0
// (see License.txt in this distribution).
//

//
// Manage file-system-like path mapping to the Chronicle rest api
// - these are all synchronous helper methods
//

_ = require("underscore");

//---------------------------------------------------------------------------

/**
 * Splits a path and un-escapes illegal slash character
 */
exports.pathSplit = function (path) {
  var rawPathComponents = path.split('/');
  var pathComponents = [];
  _.each(rawPathComponents, function(element, index) {
    element = element.replace('.slash.', '/');
    pathComponents.push(element);
  });
  return(pathComponents);
}

/**
 * escapes illegal slash character
 */
exports.escapePathComponent = function (component) {
  return (component.replace('/', '.slash.'));
}

/**
 * Accepts a fuse path and returns the corresponding 
 * chronicle search key version.
 */
exports.pathToKey = function (path) {
  var pathComponents = exports.pathSplit(path);
  var key = [];
  _.each(pathComponents, function(element, index) {
    if (element !== "") {
      var listForm = [];
      element = element.replace('[','').replace(']','');
      if (element.indexOf(',') < 0) {
        listForm = element;
      } else {
        _.each(element.split(','), function(part,index) {
          listForm.push(part);
        });
      }
      key.push(listForm);
    }
  });
  console.log('path', path, 'became key', key);
  return(key);
}

/**
 * Accepts a chronicle search key
 * and returns the corresponding fuse path.
 */
exports.keyToPath = function (key) {
  var path = "";
  _.each(key, function(element,index) {
    element = exports.escapePathComponent(element);
    if (typeof element !== 'string') {
      path += "/[" + element + "]";
    } else {
      path += "/" + element;
    }
  });
  console.log('key', key, 'became path', path);
  return(path);
}

/**
 * Accepts a path and true if it is a document path
 */
exports.pathIsDocument = function (path) {
  var key = exports.pathToKey(path);
  return (key.length === 4);
}

/**
 * Accepts a path and true if it is an attachment path
 * (dataset is special case of attachment)
 */
exports.pathIsAttachment = function (path) {
  // TODO: check if it actually exists
  var key = exports.pathToKey(path);
  return (key.length > 4);
}

/**
 * Accepts a path and returns attachment path (path past id)
 * (dataset is special case of attachment)
 */
exports.pathAttachmentPath = function (path) {
  var pathComponents = exports.pathSplit(path);
  return (pathComponents[5]);
}

/**
 * Accepts a path and returns the doc ID if there is one
 */
exports.pathDocumentID = function (path) {
  var pathComponents = exports.pathSplit(path);
  return (pathComponents[4]);
}

/**
 * Accepts a path and returns the cradle viewOptions
 * needed to query the context view
 */
exports.pathToViewOptions = function (path) {
  var viewOptions = {};

  if (exports.pathIsDocument(path)) {
    // nothing - illegal path
  } else {
    var key = exports.pathToKey(path);
    viewOptions.reduce = true;
    viewOptions.group_level = key.length + 1;
    if (key.length >= 1) {
      viewOptions.startkey = key;
      var endkey = key.slice(0); // shallow copy
      endkey.push({});
      viewOptions.endkey = endkey;
    }
  }
  return(viewOptions);
}

/*
forTests:

A chronicle key looks like this:

[
 ["Brigham and Womens Hosp 221 15", "0001-01001"],
 ["novartis thighs and left arm", "1.3.6.1.4.1.35511635217625025614132.1"],
 ["MR", "Band 0 (without tumors)", "1.3.6.1.4.1.35511635217625025614132.1.4.0"],
 "1.3.6.1.4.1.35511635217625025614132.1.4.0.3.0"
]

which is [[inst,patid],[studydes,studid],[modality,serdesc,serid],instid]

which maps to a path like this:

/[inst,patid]/[studydes,studid]/[modality,serdesc,serid]/instid

Note the various descriptions can have invalid (or confusing) characters
for a file system path.  TODO: urlencode the worst offenders

Design decisions:
- make the filename match the key, including UID to avoid name clashes
- include the square brakets in the filenames, but remove the quotes
  (bash autocomplete will escape the brackets and other chars)
  (use quotes when cutting and pasting a file path)
- slashes and commas are the characters that need to be url encoded for now



TODO: Should make a (set of) custom views that expose useful paths
to simplify processing.  Possible options:

/inst/modality/date/studyid-studydesc/seriesnumber-seriesdesc/instanceno

/referring/modality/date/studyid-studydesc/seriesnumber-seriesdesc/instanceno

/studydesc/patient/seriesnumber-seriesdesc/instanceno

*/

//TODO: move these to tests/path-tests.js
if (false) {

//TODO: move these to tests/path-tests.js
var paths = [
    , "/[inst,patid]/[studydes,studid]/[modality,serdesc,serid]/instid"
    , "/[inst,patid]/[studydes,studid]/[modality,serdesc,serid]"
    , "/[inst,patid]/[studydes,studid]/"
    , "/[inst,patid]/"
    , "/"
];

_.each(paths, function(path) {
  console.log('Path: ', path);
  console.log('viewOptions: ', exports.pathToViewOptions(path));
});


var path = "/[inst,patid]/[studydes,studid]/[modality,serdesc,serid]/instid"
console.log(path);
console.log("maps to ");
var key = exports.pathToKey(path);
console.log(key);
console.log("maps to ");
var newPath = exports.keyToPath(key);
console.log(newPath);

console.log("\npath and key are equal?", path == newPath);
}

