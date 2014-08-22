var _ = require("underscore");
var util = require("util");
var cradle = require("cradle");
var chlib = require("../");

var ch = new(chlib.ch.Connection)();

var studyList = [];

console.log('checking for study');
ch.context.eachStudy ( {
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
