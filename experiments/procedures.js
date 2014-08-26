var _ = require("underscore");
var stream = require("stream");
var cradle = require("cradle");
var chlib = require("../");

var ch = new(chlib.ch.Connection)();

var studyRenderStep = {
  name : "Study Render",
  desiredProvenance : {
    application : "3D Slicer",
    version : "4.3*",
    operation : "ChronicleStudyRender",
  },
}


var studyOptions = {
  ch : ch,
  eachCallback : function(value, key, list) {
    var stepDoc = JSON.parse(JSON.stringify(studyRenderStep));
    stepDoc.inputs = [key,];
    var req = ch.steps.step({
      ch : ch,
      doc : stepDoc,
    });
  },
};


var studyStream = new stream.Stream();
studyStream.writable = true

var chunks = 0;
studyStream.write = function (chunk) {
  console.log('got: ', chunk.toString());
  chunks++;
};

studyStream.end = function () {
  console.log('finished after ' + chunks + ' chunks');
};


var testing = true;

if (testing) {
  
  var changesFeed = ch.agents.agent( {ch : ch} );

  console.log('checking for study');
  ch.context.eachStudy(studyOptions).pipe(studyStream);
}
