var sqlite3 = require('sqlite3');
var async = require('async');
var hashes = require('jshashes');
var sha1 = new hashes.SHA1;

var chlib = require("../");

// Open the connection to the database
var options = { database: 'baby-rpdr' };
var ch = new(chlib.ch.Connection)(options);

var sqlFile = '/Volumes/encrypted/babybrains/rpdr_data/2013-07-09_RPDR.sqlite';
var irbTagPrefix = 'RG057_20130709_112708_MGH_'

var sqliteDB = new sqlite3.Database(sqlFile, sqlite3.OPEN_READONLY);

var tags = ['Car', 'Con', 'Dem', 'Dia', 'Dis', 'Enc', 'End', 'Lhm', 'Lme', 'Lno', 'Lpr', 'Lvs',
            'Med', 'Mic', 'Mrn', 'Opn', 'Pat', 'Phy', 'Prc', 'Pul', 'Rad', 'Rdt', 'Rnd'];

//tags = ['Con',]
//tags = ['Rdt',]
//



//var statementPattern = 'SELECT * from %s LIMIT 100 OFFSET 300';
//var statementPattern = 'SELECT * from %s LIMIT 100';
var statementPattern = 'SELECT * from %s';

function insert_doc(ch, doc, name, completedCallback, tried) {
  tried = tried || 0;
  ch.chronicle.insert(doc, name, function (error,http_body,http_headers) {
    if (error) {
      if (error.message === 'no_db_file'  && tried < 1) {
        // create database and retry
        return ch.nano.db.create(options.database, function () {
          insert_doc(ch, doc, name, completedCallback, tried+1);
        });
      } else if (error.error === 'conflict') {
        console.log('ignoring conflict');
        completedCallback();
        // ignore this, since the doc id is the sha1, it means contents are identical
      } else {
        return console.log("Unknown error", error);
      }
    } else {
      console.log(name, 'inserted, no conflict');
      completedCallback();
    }
  });
}

function dump_objects(tag) {
  var statement = statementPattern.replace('%s', tag);
  var dbStatement = sqliteDB.prepare(statement, function(error) {
    if (error) {
      console.log(error);
    }
  });
  var getCallback = function(err, row) {
    if (err) {
      console.log(error);
    }
    if (row) {
      var doc = {
        source: 'rpdr',
        irbTag: irbTagPrefix + tag,
        table: tag,
        rpdr_dataset: row,
      };
      var docSHA1 = sha1.hex(JSON.stringify(doc));
      console.log(doc, docSHA1);
      insert_doc(ch, doc, docSHA1, function() {
        dbStatement.get(getCallback);
      });
    }
  };
  dbStatement.get(getCallback);
};

_.each(tags, function(tag, index, list) {
  dump_objects(tag);
});

/*
function dump_objects(tag, stream) {
  var statement = statementPattern.replace('%s', tag);
  var dbStatement = sqliteDB.prepare(statement, function(error) {
    if (error) {
      console.log(error);
    }
  });
  var getCallback = function(err, row) {
    if (err) {
      console.log(error);
    }
    if (row) {
      // here we try to write to stream, and if we get a true, we call recursively
      // else we wait on drain
      if (stream.write(JSON.stringify(row))) {
        dbStatement.get(getCallback);
      } else {
        process.stderr.write('BLOCKING');
        stream.once('drain', function() {
          process.stderr.write('unblocking');
          dbStatement.get(getCallback);
        });
      }
    }
  };

  dbStatement.get(getCallback);
};
*/


  /*
 sqliteDB.each(statement, function(err, row) {
    if (err) console.log(err);
    var doc = {
      source: 'rpdr',
      table: tag,
      rpdr_dataset: row,
    };
    console.log(JSON.stringify(doc));
  });
  */


/*
  // parent
  var child = require('child_process').spawn(process.argv[0], [process.argv[1], "dump"]);
  child.stdout.on('data', function (data) {
    var docs = JSON.parse(data);
    _.each(docs, function(doc) {
      var docSHA1 = sha1.hex(JSON.stringify(doc));
      console.log(docSHA1);
      //insert_doc(ch, doc, docSHA1);

      //_.defer(insertQueue.push, task, function (err) {
       //   console.log('finished processing', task.docSHA1);
      //});
    });
  });

  child.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  child.on('close', function (code) {
    console.log('child finished with', code);
  });

}
*/

/*
// create a queue object with concurrency 10
var insertQueue = async.queue(function (task, callback) {

    insert_doc(task.ch, task.doc, task.docSHA1);

    console.log('called insert on', task.docSHA1);
    callback();
}, 10);

// assign a drain callback, triggered when finished
insertQueue.drain = function() {
    console.log('all inserts have been started');
}
*/
