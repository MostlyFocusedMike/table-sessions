/*jslint plusplus: true*/
/*jslint white: true*/
/*globals $:false */

// DON'T FORGET A POLYFILL FOR THE INCLUDES METHOG
// OK??

(function () {
"use strict"
var timesTable = {
  includedNum: [],
  usedNum: [],
  startRound: 1,
  x: 1,
  y: 1,
  xEl: document.getElementById ("x-id"),
  yEl: document.getElementById("y-id"),
  correct: 0,
  wrong: 0, // this may be useless
  totalPoints: 0,
  setupRound: function() {
  // set up the round start number and what numbers to include
    var radios = document.getElementsByName("start-round"),
      //radiosLength = radios.length, //just realized the legth will always be 12, but just in case that changes, these are still here
      checks = document.getElementsByName("include-num");
      //checksLength = checks.length;
    this.includedNum.length = 0; // resets includedNum array to prevent the entries from stacking up
    for (var i = 0; i < 12; i++) {
      if (radios[i].checked) {
        this.startRound = Number(radios[i].value);
        break;
       }
    };
    for (var i = 0; i < 12; i++) {
      if (checks[i].checked) {
        this.includedNum.push(Number(radios[i].value));
       }
    }
  },
  initialSetup: function() {
  // sets up the x,y variables and html content, and the total points
    // set the x and y html content
    this.xEl.textContent = this.startRound;
    this.yEl.textContent = this.includedNum[0];
    // set the x and y variable values 
    this.x = this.startRound;
    this.y = this.includedNum[0];

    // set up the total points possible 
    this.totalPoints = (13 - this.startRound) * this.includedNum.length;
    document.getElementById('cct-msg').style.display = "none";
    document.getElementById('wng-msg').style.display = "none";

  },
  checkAnswer: function() {
    var userAnsEl = document.getElementById("u-ans"),
    userAns = Number(userAnsEl.value),
    ans = this.x * this.y;
    if (Number.isNaN(userAns) || userAnsEl.value === "") {
      window.alert("Only numbers in the answer form please");
      userAnsEl.value ="";
      return;
    }
    if (userAns == ans) { // if they got it right
      this.correct += 1;
      //alert('right');
      document.getElementById('cct-msg').style.display = "block";
      document.getElementById('wng-msg').style.display = "none";
      this.setupNextQ();
    } else {
      //alert('wrong');
      // this.wrong += 1; // this might be useless
      document.getElementById('cct-msg').style.display = "none";
      document.getElementById('wng-msg').style.display = "block";
      document.getElementById('real-ans').textContent = ans;
      this.setupNextQ();
    } 
    userAnsEl.value ="";
  },
  setupNextQ: function() {
  // set up all but initial question for the x and Y html content
    this.usedNum.push(this.y);
    if (this.usedNum.length < this.includedNum.length) {
      this.y = randomY(this.includedNum, this.usedNum, this.yEl); 
      this.yEl.textContent = this.y;
    } else {
      this.x += 1;
      this.xEl.textContent = this.x;
      this.usedNum.length = 0;
      this.y = randomY(this.includedNum, this.usedNum, this.yEl); 
    }
    function randomY(includedNum, usedNum, yEl) { 
    // randomly sets the y value so it is not a number before seen in the current round
      while (true) {
        var y = Math.floor((Math.random() * 12) + 1);
        if ((includedNum.includes(y)) && (usedNum.includes(y) == false)) {
          yEl.textContent = y;
          return y;
        }
      }
    }
  }
}; // don't forget to use ; after objects

// the skip_round function just has to 

// MAIN PROGRAM BELOW /////////////////////////////////////////////////
// /////////////////////////////////////////////////

(function() { 
//  alert("hello");
  timesTable.setupRound();
  timesTable.initialSetup();

})();
var start = document.getElementById("start-button");
start.addEventListener("click", function() { 
  timesTable.setupRound();
  timesTable.initialSetup();
  timesTable.correct;
});
document.getElementById("u-ans").addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode; // certain browsers use e.which for keypress id-ing, others use e.keyCode
    if (key === 13) { // 13 is enter
      timesTable.checkAnswer();
      //alert(timesTable.correct);
    }
});

}());
