var _ = require("underscore");
var util = require("util");
var stream = require("stream");
var cradle = require("cradle");
var chlib = require("../");

var ch = new(chlib.ch.Connection)();

var studyList = [];

console.log('checking for study');
var req = ch.context.eachStudy ( {
  ch : ch,
  eachCallback : function(value, key, list) {
    console.log(value, key, list);
    studyList.push(key);
  },
  finishedCallback : function() {
    console.log(studyList);
  },
  errorCallback : function() {
    console.log("Got an error!");
  }
});


var studyStream = new stream.Stream();
studyStream.writable = true

studyStream.write = function (chunk) {
  console.log('got: ', chunk.toString());
};

studyStream.end = function () {
  console.log('finished!');
};

req.pipe(studyStream);
