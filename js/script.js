/*jslint plusplus: true*/
/*jslint white: true*/
/*globals $:false */

(function () {
"use strict"
var timesTable = {
  included: [],
  startRound: 1,
  x: 1,
  y: 1,
  correct: 0,
  wrong: 0,
  totalPoints: 0,
  setupRound: function() {
  // set up the round start number and what numbers to include
    var radios = document.getElementsByName("start-round"),
      //radiosLength = radios.length, //just realized the legth will always be 12, but just in case that changes, these are still here
      checks = document.getElementsByName("include-num");
      //checksLength = checks.length;
    this.included.length = 0; // resets included array to prevent the entries from stacking up
    for (var i = 0; i < 12; i++) {
      if (radios[i].checked) {
        this.startRound = radios[i].value;
        break;
       }
    };
    for (var i = 0; i < 12; i++) {
      if (checks[i].checked) {
        this.included.push(radios[i].value);
       }
    }
    // set up the total points possible 
    this.totalPoints = (13 - this.startRound) * this.included.length;
  },
}; // don't forget to use ; after objects

// MAIN PROGRAM BELOW /////////////////////////////////////////////////
// /////////////////////////////////////////////////

(function() { 
//  alert("hello");
})();
var start = document.getElementById("start-button");
start.addEventListener("click", function() { 
  timesTable.setupRound();
  alert(timesTable.startRound); 
  alert(timesTable.included.toString());
  alert(timesTable.totalPoints);
});

}());
