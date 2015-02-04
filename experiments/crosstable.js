var _ = require("underscore");
var util = require("util");
var cradle = require("cradle");
var fs = require('fs');

/* from Kalli's notes after the meeting with Issa:
 *
Random id replacing MRN/EMPI
age in days
sex
series and studies descriptions
magnetic field strength/scanner model/manufacturer
mracquisitiontype (denotes 2D or 3D)
station id
image thumbnail

*/

var tags = {
  "id" : "00100020",
  "age" : "00101010",
  "sex" : "00100040",
  "studyDescription" : "00081030",
  "seriesDescription" : "0008103E",
  "fieldStrength" : "00180087",
  "acquisitionType" : "00180023",
  "repetitionTime" : "00180080",
  "echoTime" : "00180081",
  "inversionTime" : "00180082",
  "stationName" : "00081010",
};

//var chronicle = new(cradle.Connection)().database('chronicle');
var chronicle = new(cradle.Connection)().database('ch-babies');

var seriesKeyList = [];
var seriesData = [];

// get a distribution of the number os instances
// in each series in the database
var getAllData  = function(callback) {
  viewOptions = {
    reduce: true,
    group_level: 3,
    stale: 'update_after',
    limit: 100
  };
  chronicle.view('instances/context', viewOptions, function(err,response) {
    if (err) {
      console.log(err);
      return;
    }
    util.inspect(response);
    response.forEach(function(key,row,id) {
      seriesKeyList.push(key);
    });
    getSeriesData();
  });
};


var getOneSeriesData = function(key, finishedCallback) {

  viewOptions = {
    reduce: false,
    stale: 'update_after',
    include_docs: true,
    limit: 1,
  };
  chronicle.view('instances/seriesInstances', viewOptions, function(err,response) {
    if (err) {
      console.log(err);
      return;
    }
    util.inspect(response);
    response.forEach(function(key,row,id) {
      seriesKeyList.push(key);
    });
    finishedCallback();
  });
};

var getSeriesData = function() {
  if (seriesKeyList.length == 0) {
    fs.writeFile("/tmp/test", JSON.stringify(seriesData, null, " "), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    }); 
  } else {
    var key = seriesKeyList.pop();
    getSeriesData(key, getSeriesData);
  }
};
