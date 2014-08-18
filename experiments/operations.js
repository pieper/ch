var _ = require("underscore");
var util = require("util");
var cradle = require("cradle");

var couchdb = new(cradle.Connection)();
var chronicle = couchdb.database('chronicle');


// get a list of all series
// series in the database
exports.eachSeries = function(eachCallback,finishedCallback) {
  viewOptions = {
    reduce: true,
    group_level: 3,
    stale: 'update_after',
  };
  chronicle.view('instances/context', viewOptions, function(err,response) {
    if (err) {
      console.log(err);
      return;
    }
    response.forEach(function(key,row,id) {
      eachCallback(key);
    });
    finishedCallback();
  });
}

var seriesList = [];

exports.eachSeries ( 
  eachCallback = function(key) {
    seriesList.push(key);
  },
  finishedCallback = function() {
    // console.log(seriesList);
  }
);

console.log(couchdb.uuids(10, console.log));

console.log(couchdb.info(console.log));
