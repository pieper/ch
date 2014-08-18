var _ = require("underscore");
var util = require("util");
var cradle = require("cradle");

var chronicle = new(cradle.Connection)().database('chronicle');

var jsonList = []


// get a distribution of the number os instances
// in each series in the database
exports.seriesInstanceTable  = function(callback) {
  viewOptions = {
    reduce: true,
    group_level: 3,
    stale: 'update_after',
    limit: 1000
  };
  chronicle.view('instances/context', viewOptions, function(err,response) {
    if (err) {
      console.log(err);
      return;
    }
    util.inspect(response);
    response.forEach(function(key,row,id) {
      callback(key,row);
    });
    console.log(jsonList);
  });
}

exports.seriesInstanceTable( function(key,row) {
  var json = {};
  json.institution = key[0][0];
  json.studyDescription = key[1][0];
  json.seriesDescription = key[2][1];
  json.instanceCount = row;
  jsonList.push(json);
});
console.log(jsonList);


