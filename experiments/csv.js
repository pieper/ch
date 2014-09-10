var parse = require("csv-parse");
var fs = require("fs");
var stream = require("stream");

var chlib = require("../");

// Open the connection to the database
var ch = new(chlib.ch.Connection)();


var filePath = '/Users/pieper/Google Drive/Isomics/shared projects/NIGMS-P41-2014/lung3/Lung3.metadata.csv'
fs.readFile(filePath, function(err,data) {
  if (err) throw err;
  var parser = parse();
  parser.on('error', console.log);
  parser.on('readable', function() {
    console.log(parser.read());
  });
  parser.on('finish', function() {
    console.log('done');
  });
  parser.write(data);
});


var testing = true;

if (testing) {

}
