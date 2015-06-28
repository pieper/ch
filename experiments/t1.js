
// TODO: this needs streams to prevent event buffer overflow


var _ = require("underscore");
var util = require("util");
var stream = require('stream');
var fs = require('fs');

var chlib = require('../');

var pouchdb = require('pouchdb');

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

var mrTags = [
  "00080008", "00280002", "00280004", "00280100", "00180020", "00180021",
  "00180022", "00180023", "00180080", "00180081", "00180091", "00180082",
  "00181060", "00180024", "00180025", "00180083", "00180084", "00180085",
  "00180086", "00180087", "00180088", "00180089", "00180093", "00180094",
  "00180095", "00181062", "00181080", "00181081", "00181082", "00181083",
  "00181084", "00181085", "00181086", "00181088", "00181090", "00181094",
  "00181088", "00181100", "00181250", "00181251", "00181310", "00181312",
  "00181314", "00181316", "00181315", "00181318", "00200100", "00200105",
  "00200110"
]

var babies = new pouchdb('http://localhost:5984/ch-babies');
var filePath = "/tmp/baby-mr-tags.json";

var babyTagValues = {};

var getTags = function(seriesUID) {
  babies.query('instances/seriesInstances', {
    limit : 1,
    startkey : seriesUID,
    reduce : false,
  }).then( function(result) {
    var instanceUID = result.rows[0].value[1];
    console.log('getting', instanceUID);
    babies.get(instanceUID).then(function(doc) {
      var mrInstanceValues = {};
      _.each(mrTags, function(element, index, list) {
        var data = doc.dataset[element];
        if (data != undefined) {
          mrInstanceValues[element] = data.Value;
        }
      });
      babyTagValues[instanceUID] = mrInstanceValues;
      fs.appendFile(filePath, JSON.stringify(mrInstanceValues)+'\n', function(error) {
        if (error) { console.log('could not save!'); }
      });
    }).catch(function(err) {
      console.log(err);
    });
  }).catch(function(err) {
    console.log(err);
  });
};

if (fs.existsSync(filePath)) {
  fs.unlinkSync(filePath);
}

babies.query('instances/context', {
  limit : 3000,
  reduce : true,
  group_level : 3
}).then( function(result) {
  _.each(result.rows, function(element, index, list) {
    var seriesUID = element.key[2][2];
    getTags(seriesUID);
  });
});
