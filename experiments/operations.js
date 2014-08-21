var _ = require("underscore");
var util = require("util");
var cradle = require("cradle");
var chlib = require("../");

var ch = new(chlib.ch.Connection)();

var seriesList = [];

console.log('checking for series');
ch.context.eachSeries (ch,
  eachCallback = function(key) {
    seriesList.push(key);
console.log('got series', key);
  },
  finishedCallback = function() {
    console.log(seriesList);
  }
);

