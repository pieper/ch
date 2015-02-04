var csv_parse = require("csv-parse");
var fs = require("fs");
var stream = require("stream");

var chlib = require("../");

// Open the connection to the database
var ch = new(chlib.ch.Connection)();

var filePattern = '/Volumes/encrypted/babybrains/rpdr_data/2013-07-09_RPDR_data/RG057_20130709_112708_MGH_%s.txt'

var tags = ['Car', 'Con', 'Dem', 'Dia', 'Dis', 'Enc', 'End', 'Lhm', 'Lme', 'Lno', 'Lpr', 'Lvs', 
            'Med', 'Mic', 'Mrn', 'Opn', 'Pat', 'Phy', 'Prc', 'Pul', 'Rad', 'Rdt', 'Rnd']

// for testing
//tags = ['Con',]
tags = ['Lno',]


parseFile = function(filePath) {
  console.log('reading: ', filePath);
  var header = null;
  fs.readFile(filePath, function(err,data) {
    if (err) throw err;
    var parser = csv_parse();
    parser.on('error', console.log);
    parser.on('readable', function() {
      var row = parser.read();
      if (header === null) {
        header = row;
      } else {

        console.log(row);


        /*
        var patientID = row[0];
        var instanceUID = ch.dicom.uid();
        var seriesUID = ch.dicom.uid();

        var viewOptions = {
            reduce : true,
            group_level : 2,
            startkey : [["UnspecifiedInstitution", patientID], ""],
            endkey : [["UnspecifiedInstitution", patientID], {}],
        };
        ch.chronicle.view('instances/context', viewOptions, function(err, response) {
            if (err) throw err;
            if (response.length) {
              console.log(response[0].key);
              // one study for each patient
              var studyUID = response[0].key[1][1];
              var doc = {
                dataset : {
                  "00080018": {
                    "vr": "UI",
                    "Value": instanceUID,
                  },
                  "0008103E": {
                    "vr": "LO",
                    "Value": "CIBL Lung3 Clinical Data",
                  },
                  "00100020": {
                    "vr": "UI",
                    "Value": patientID,
                  },
                  "0020000D": {
                    "vr": "UI",
                    "Value": studyUID,
                  },
                  "0020000E": {
                    "vr": "UI",
                    "Value": seriesUID,
                  },
                }
              };
              for (var i = 0; i < row.length; i++) {
                doc[header[i]] = row[i];
              }
              var doc = JSON.parse(JSON.stringify(doc));
              console.log(doc);
              ch.chronicle.save(instanceUID, doc, function(err,result) {
                if (err) throw err;
                console.log(result);
              });
            }
          }
        );
        */
      }
    });
    parser.write(data);
  });
};

_.each(tags, function(tag, index, list) {
  var filePath = filePattern.replace('%s', tag);
  parseFile(filePath);
});



var testing = true;

if (testing) {

}
