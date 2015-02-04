var n = require('nano')('http://localhost:5984');

var babies = n.use('ch-babies');
//var babies = n.use('chronicle');

babies.view('tags', 'byTagAndValue', function (err, body) { 
  body.rows.forEach( function(doc) { 
    console.log(doc);
  });
});

// get a distribution of the values of the given tag
// - a count is returned for each unique value of the element
exports.elementValueDistribution  = function(tag, callback) {
  viewOptions = {
    startkey: [tag, ""],
    endkey  : [tag, {}],
    reduce: true,
    group_level: 2,
    stale: 'update_after'
  };
  console.log(viewOptions);
  babies.view('tags', 'byTagAndValue', viewOptions, function(err,body) {
    console.log(body);
    if (err) {
      console.log(err);
      return;
    }
    body.rows.forEach(function(doc) {
      callback(doc);
    });
  });
}

exports.elementValueDistribution('00180080', function(doc) {
  //console.log('TR: ', key[1], 'Count: ', row);
  console.log('TR: ', doc);
});

exports.elementValueDistribution('00100020', function(doc) {
  //console.log('TR: ', key[1], 'Count: ', row);
  console.log('PatientID: ', doc);
});

