//
// Copyright 2014 Isomics, Inc.
// Author: Steve Pieper
//
// Distributed under the terms of the Slicer Licesnse v 1.0
// (see License.txt in this distribution).
//

//
// Provide helper functions related to dicom objects
//

uuid = require("node-uuid");
bignum = require("browserify-bignum");

//---------------------------------------------------------------------------

/**
 * Creates a '2.25' style dicom UID
 * Returns a string.
 */
exports.uid = function() {
  var bytes = uuid.parse(uuid.v4());
  var idNumber = new bignum(0);
  var two = new bignum(2);

  for (var i = 0; i < bytes.length; i++) {
    var contribution = new bignum(bytes[i]);
    var shifted = contribution.times(two.toPower(8*i));
    idNumber = idNumber.plus(shifted);
  }
  return "2.25." + idNumber.toString(10);
}


var testing = false; // TODO: use a testing package like mocha

if (testing) {
  console.log(exports.uid());
}
