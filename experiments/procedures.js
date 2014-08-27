var stream = require("stream");
var chlib = require("../");

// Open the connection to the database
var ch = new(chlib.ch.Connection)();

// Set up a render step
var studyRenderStep = {
  name : "Study Render",
  desiredProvenance : {
    application : "3D Slicer",
    version : "4.3*",
    operation : "ChronicleStudyRender",
  },
}


// this will be passed to the ch.context.eachStudy method
// and will create a study render step document in the
// database for each of the studies.
// TODO: we should be checking if there is an existing
// step like this in the database before requesting a new step.
var steps = 0;
var studyOptions = {
  ch : ch,
  eachCallback : function(value, key, list) {
    var stepDoc = JSON.parse(JSON.stringify(studyRenderStep));
    stepDoc.inputs = [];
    stepDoc.inputs.push(value);
    var req = ch.steps.step({
      ch : ch,
      doc : stepDoc,
      saveCallback : function(err, res) {},
    });
    steps++;
  },
  finishedCallback : function() {
    console.log('entered ', steps, ' steps');
  },
};


// Note that this stream allows you to respond to each
// row in the view as it comes in on the network, not
// after they are all aggregated.  Not currently being used
// in this example, but we count them as a test.
var studyStream = new stream.Stream();
studyStream.writable = true

var chunks = 0;
studyStream.write = function (chunk) {
  var s = chunk.toString();
  try {
    s = s.slice(s.indexOf('{'))
    JSON.parse(s);
    chunks++;
  }
  catch(err) {
    //console.log('ignoring ', chunk.toString(), ' due to ', err);
  }
  finally {
  }
};

studyStream.end = function () {
  console.log('finished after ' + chunks + ' chunks');
};


var testing = true;

if (testing) {

  // Create an agent - by default this will print
  // the current state of the step activities related
  // so we can watch them getting acted on by other parties
  var changesFeed = ch.agents.agent( {ch : ch} );

  // create the per-study steps
  ch.context.eachStudy(studyOptions).pipe(studyStream);
}
