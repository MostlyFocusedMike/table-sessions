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
  wrong: [], 
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
    this.setupRound();
    this.xEl.textContent = this.startRound;
    this.yEl.textContent = this.includedNum[0];
    // set the x and y variable values 
    this.x = this.startRound;
    this.y = this.includedNum[0];
    // set up the total points possible 
    this.restart();
  },
  restart: function() {
    this.usedNum.length = 0;
    this.wrong.length = 0;
    this.correct = 0;
    this.totalPoints = (13 - this.startRound) * this.includedNum.length;
    this.showScore();
    document.getElementById('cct-msg').style.display = "none";
    document.getElementById('wng-msg').style.display = "none";
    document.getElementById("end-msg").style.display = "none";
  },
  checkAnswer: function() {
  // compares user answer and shows a correct or wrong message, adds score
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
      this.wrong.push(this.x + " * " + this.y);
      document.getElementById("mis-qs").innerHTML += "<p>" + this.x + " * " + this.y + " = " + (this.x * this.y) + "</p>";
      document.getElementById('cct-msg').style.display = "none";
      document.getElementById('wng-msg').style.display = "block";
      document.getElementById('real-ans').textContent = ans;
      this.setupNextQ();
    } 
    this.showScore();
    userAnsEl.value ="";
  },
  randomY: function() { 
  // randomly sets the y value so it is not a number before seen in the current round
    while (true) {
      this.y = Math.floor((Math.random() * 12) + 1);
      if ((this.includedNum.includes(this.y)) && (this.usedNum.includes(this.y) == false)) {
        this.yEl.textContent = this.y;
        break;
      }
    }
  },
  setupNextQ: function() {
  // set up all but initial question for the x and Y html content
    this.usedNum.push(this.y);
    console.log(this.usedNum);
    console.log(this.includedNum);
    if (this.usedNum.length < this.includedNum.length) {
      this.randomY(); 
      console.log('all ok');
    } else {
      console.log('next part');
      this.nextRound();
    }
    
  },
  nextRound: function() {
  //allows user to skip a round, or progress naturally
    this.x += 1;
    if (this.x == 13) {
      document.getElementById("end-msg").style.display = "block"; 
      this.initialSetup();
      this.adjustScore(); 
      return;
    }
    this.xEl.textContent = this.x;
    this.adjustScore(); 
    this.usedNum.length = 0;
    this.randomY(); // sets y value and html content 
    this.showScore();
  },
  adjustScore: function() {
    if (this.usedNum.length !== this.includedNum.length) {
      var scoreAdjuster = this.includedNum.length - this.usedNum.length;
      this.totalPoints -= scoreAdjuster;
      alert(scoreAdjuster);
      alert(this.includedNum.length);
    }
  },
  showScore: function() {
  // tallys user's score
    var score = document.getElementsByClassName("fin-score");
    for (var i=0; i<score.length; i++) {
      score[i].textContent = this.correct + "/" + this.totalPoints;
    }
  },
  endPractice: function() {

  }
}; // don't forget to use ; after objects

// the skip_round function just has to 

// MAIN PROGRAM BELOW /////////////////////////////////////////////////
// /////////////////////////////////////////////////

(function() { 
//  alert("hello");
  timesTable.setupRound();
  timesTable.initialSetup();
  timesTable.showScore();
})();
var start = document.getElementById("start-button"),
  skip = document.getElementById("skip-button"),
  uInput = document.getElementById("u-ans");

// start practice session
start.addEventListener("click", function() { 
  timesTable.initialSetup();
});

// skip round 
skip.addEventListener("click", function() {
  timesTable.nextRound();
  // focuses on the answer input field so a user hitting "enter" again accidentally
  // won't skip the whole round since the button was still in focuse 
  uInput.focus();
});

// clears input field 
uInput.addEventListener("click", function() {
  uInput.value = "";
});

// submit answer
uInput.addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode; // certain browsers use e.which for keypress id-ing, others use e.keyCode
    if (key === 13) { // 13 is enter
      timesTable.checkAnswer();
    }
});

// hide end message and restart new round 
document.getElementById("hide-end").addEventListener("click", function() {
  timesTable.restart();
});
}());
