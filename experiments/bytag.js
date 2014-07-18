
var _ = require("underscore");
var util = require("util");
var cradle = require("cradle");

var chronicle = new(cradle.Connection)().database('chronicle');

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


//chronicle.save('_design/tags', tagDesign);

// get list of number of instances by modality
modalityOptions = {
  startkey: ["00080060", ""], 
  endkey  : ["00080060", {}], 
  reduce: true,
  group_level: 2
};
chronicle.view('tags/byTagAndValue', modalityOptions, function(err,response) {
  if (err) {
    console.log(err);
    return;
  }
  util.inspect(response);
  response.forEach(function(key,row,id) {
    console.log(key,row);
  });
});

// get ids of of instances by modality
exports.idsForModality = function(modality) {
  modalityOptions = {
    startkey: ["00080060", modality], 
    endkey: ["00080060", modality+"\u9999"], 
    reduce: false,
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

exports.idsForModality('SR');

exports.idsForModality('RWV');
