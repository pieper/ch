var chlib = require("../");
var fs = require("fs");
var minimatch = require("minimatch");
var os = require("os");
var rimraf = require("rimraf");

// Open the connection to the database
var ch = new(chlib.ch.Connection)();

var saveDir = os.tmpdir() + "/lungs";

console.log(saveDir);

if (fs.existsSync(saveDir)) {
  rimraf.sync(saveDir);
}
fs.mkdirSync(saveDir);

// download each rendered image per series and study
var seriesOptions = {
  ch : ch,
  eachCallback : function(value, key, list) {
    var instancePath = ch.contextPaths.keyToPath(value);
    console.log(value);
    console.log(instancePath);
    var path = saveDir + instancePath;
    var description = value[2][1];
    var seriesUID = value[2][2];
    if (minimatch(description, "Slicer*")) {
      var patientName = value[0][1];
      var patientDir = saveDir + "/" + patientName;
      if (!fs.existsSync(patientDir)) {
        fs.mkdirSync(patientDir);
      }
      var filePathPrefix = patientDir + "/" + description;
      var seriesOptions = {
        key : seriesUID,
        reduce : false
      }
      ch.chronicle.view('instances/seriesInstances', seriesOptions, function(err,response) {
        if (err) throw err;
        response.forEach( function(value, key, list) {
          var instanceUID = key[1];
          console.log("value,key");
          console.log(value,key);
          ch.chronicle.getAttachment(instanceUID, "image.jpg", function(err, reply) {
            if (err) {
              console.log(err);
              return;
            }
            var filePath = filePathPrefix + "-" + instanceUID + ".jpg";
            fs.writeFile(filePath, reply.body, function(err,fd) {
              if (err) throw err;
              console.log("Saved %s", filePath);
            });
          });
        });
      });
    }
  },
};



var testing = true;

if (testing) {

  // create the per-study steps
  ch.context.eachSeries(seriesOptions);
}
