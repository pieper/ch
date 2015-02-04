
var _ = require("underscore");
var util = require("util");
var cradle = require("cradle");

//var chronicle = new(cradle.Connection)().database('chronicle');
var chronicle = new(cradle.Connection)().database('ch-babies');

// for testing
var emit = console.dir;

var tagDesign = {
  views: {
    byTagAndValue: {
      map: function (doc) {
        var vrsToExclude = [ 'SQ', 'OW', 'OB', 'OW/OB', 'OW or OB', 'OB or OW', 'US or SS'];
        if (doc.dataset) {
          for (var key in doc.dataset) {
            if (doc.dataset.hasOwnProperty(key)) {
              if (! (doc.dataset[key].vr in vrsToExclude) ) {
                emit([key,doc.dataset[key].Value], 1);
              }
            }
          }
        }
      },
      reduce: "_count()"
    }
  }
};


if ( false ) {
  var id = "1.2.840.113619.2.336.2807.624330.14614.1393937735.469";
  chronicle.get(id, function (err,doc) {
    tagDesign.views.byTagAndValue.map(doc);
  });
}


// won't cause re-index unless the hash of the view changes
chronicle.save('_design/tags', tagDesign);

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
  chronicle.view('tags/byTagAndValue', viewOptions, function(err,response) {
    if (err) {
      console.log(err);
      return;
    }
    util.inspect(response);
    response.forEach(function(key,row,id) {
      callback(key,row);
    });
  });
}




// get ids of of instances by modality
exports.idsForModality = function(modality) {
  modalityOptions = {
    startkey: ["00080060", modality],
    endkey: ["00080060", modality+"\u9999"],
    reduce: false,
    stale: 'update_after'
  };
  chronicle.view('tags/byTagAndValue', modalityOptions, function(err,docs) {
    if (err) {
      console.dir(err);
      return;
    }
    _.each(docs, function(doc, index) {
      console.log(doc.key, doc.id);
    });
  });
}


// experiments / Testing

exports.elementValueDistribution('00080060', function(key,row) {
  console.log('Modality: ', key[1], 'Count: ', row);
});

if (true) {

  exports.idsForModality('SR');

  exports.idsForModality('RWV');

  exports.elementValueDistribution('00180080', function(key,row) {
    console.log('TR: ', key[1], 'Count: ', row);
  });

  exports.elementValueDistribution('00080016', function(key,row) {
    console.log('SOPClassUID: ', key[1], 'Count: ', row);
  });

}
