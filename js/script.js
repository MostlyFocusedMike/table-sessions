/*jslint plusplus: true*/
/*jslint white: true*/
/*globals $:false */

// DON'T FORGET A POLYFILL FOR THE INCLUDES METHOG
// OK??

(function () {
"use strict"
var timesTable = {
  includedNum: [], usedNum: [], startRound: 1, x: 1, y: 1, qNum: 0,
  xEl: document.getElementById ("x-id"),
  yEl: document.getElementById("y-id"),
  xList: [],
  yList: [],
  endMsg: document.getElementById("end-msg"),
  cctMsg: document.getElementById('cct-msg'),
  wngMsg: document.getElementById('wng-msg'),
  wlcMsg: document.getElementById('welcome-msg'), 
  roundBar: document.getElementById("round-mover"),
  sessionBar: document.getElementById("session-mover"),
  missedQs: document.getElementById("mis-qs"),
  correct: 0,
  totalPoints: 0,
  sessionMode: "random",
  setupRound: function() {
  // set up the round start number and what numbers to include
    var radios = document.getElementsByName("start-round"),
      checks = document.getElementsByName("include-num");
      this.includedNum.length = 0; // resets includedNum array to prevent the entries from stacking up from previous sessions/rounds
    for (var i = 0; i < 12; i++) {
      if (radios[i].checked) {
        this.startRound = Number(radios[i].value);
        console.log("start round" + this.startRound);
        //break;
      }
      if (checks[i].checked) {
        this.includedNum.push(Number(radios[i].value));
      }
    };
    if (this.sessionMode === "sequence") {
      this.totalPoints = (13 - this.startRound) * this.includedNum.length;
      this.showScore();
    } else {
      this.totalPoints = (this.includedNum.length) ** 2;
      this.showScore();
    }
  },
  initialSetup: function() {
  // sets up the x,y variables and html content, and the total points
    // set the x and y html content
    this.reset();
    this.setupRound();
    if (this.sessionMode == "sequence") {
      this.xEl.textContent = this.startRound;
      this.yEl.textContent = this.includedNum[0];
      // set the x and y variable values 
      this.x = this.startRound;
      this.y = this.includedNum[0];
    } else {
      this.randomXY();
      this.nextRandomQ(); 
    }
  },
  reset: function() {
    this.usedNum.length = 0;
    this.correct = 0;
    this.qNum = 0;
    this.xList.length = 0;
    this.yList.length = 0;
    this.wlcMsg.style.display = "block";
    this.cctMsg.style.display = "none";
    this.wngMsg.style.display = "none";
    this.endMsg.style.display = "none";
    this.roundBar.style.left = "0";
    this.sessionBar.style.left = "0";
    this.missedQs.innerHTML = ""; 
  },
  checkAnswer: function() {
  // compares user answer and shows a correct or wrong message, adds score
    var userAnsEl = document.getElementById("u-ans"),
    userAns = Number(userAnsEl.value),
    ans = this.x * this.y;
    if (this.endMsg.style.display === "block") {
      // if the end msg is visible, no values can checked and they will be erased
      userAnsEl.value ="";
      return;
    }
    if (Number.isNaN(userAns) || userAnsEl.value === "") {
      window.alert("Only numbers in the answer form please");
      userAnsEl.value ="";
      return;
    }
    if (userAns == ans) { // if they got it right
      this.correct += 1;
      //alert('right');
      this.cctMsg.style.display = "block";
      this.wngMsg.style.display = "none";
      this.wlcMsg.style.display = "none";
    } else {
      //alert('wrong');
      this.missedQs.innerHTML += "<p>" + this.x + " * " + this.y + " = " + (this.x * this.y) + ", not " + userAns +"</p>";
      this.cctMsg.style.display = "none";
      this.wngMsg.style.display = "block";
      this.wlcMsg.style.display = "none";
      document.getElementById('real-ans').textContent = ans;
    } 
    this.qNum += 1;    // if the answer is right or wrong (not an error) then the question num goes up
    this.setupNextQ();
    this.adjustBars();
    this.showScore();
    userAnsEl.value ="";
  },
  setupNextQ: function() {
  // set up all but initial question for the x and Y html content
    if (this.sessionMode == "sequence") {
      this.usedNum.push(this.y);
      if ((this.usedNum.length < this.includedNum.length) && (this.usedNum.length !== 1)) {
        this.randomY(); 
      } else {
        this.nextRound();
      }
    } else {
      if (this.qNum < this.totalPoints) {
        this.nextRandomQ();
      } else {
        this.end();
      }
    } 
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
  nextRound: function() {
  //allows user to skip a round, or progress naturally
    this.x += 1;
    while (this.includedNum.includes(this.x) == false) {
      if (this.x == 13) {
        break;
      }
      this.adjustScore();
      this.x += 1;
    }
    if (this.x == 13) {
      this.end(); 
      return;
    }
    this.xEl.textContent = this.x;
    this.adjustScore(); 
    this.adjustBars(); // knocks the round bar back down
    this.usedNum.length = 0;
    this.randomY(); // sets y value and html content 
    this.showScore();
    this.adjustBars(); // knocks the round bar back down
  },
  adjustScore: function() {
  // if user skips a round, this ensures totalPoints goes down as well, and keeps totalPoints from 
  // changing if the endMsg is visibile ie round over
    if (this.sessionMode == "sequence") {
      if ((this.usedNum.length !== this.includedNum.length) && (this.endMsg.style.display === "none")){
        var scoreAdjuster = this.includedNum.length - this.usedNum.length;
        this.totalPoints -= scoreAdjuster;
      }
    }
  },
  end: function() {
    this.adjustScore(); 
    this.qNum = this.totalPoints; // if the user skips to the end, the progress session bar 
    this.adjustBars();            // will also jump to 100%;
    this.showScore();
    document.getElementById("end-msg").style.display = "block"; 
    document.getElementById("tot-q").textContent = this.correct + "/" + this.qNum;
    if (this.missedQs.innerHTML === "") { // if wrong answers is empty, display congratulations message
      if (this.totalPoints > 9) {
        this.missedQs.innerHTML = "<p>You made no mistakes,<br />great job!</p>";  
      } else if (this.totalPoints <= 9 && this.totalPoints > 0){
        this.missedQs.innerHTML = "<p>You skipped a lot,<br />but made no mistakes.";  
      } else {
        this.missedQs.innerHTML = "<p>You didn't actually<br />do the session...";  
      }
    }
    //this.initialSetup();
    this.x = 12 // even though the skip button is covered by the end message 
    return;     // this would stop x from ever going higher no matter what
  },
  showScore: function() {
  // tallys user's score
    var scoreEl = document.getElementsByClassName("fin-score"), 
      score = this.correct / this.qNum * 100;
      score = score.toFixed(0);

    if (isNaN(score)) {
      score = 100;
    }
    for (var i=0; i<scoreEl.length; i++) {
      scoreEl[i].textContent = score + "%"; 
    }
  },
  adjustBars: function() {
    var sesPosVal = (this.qNum / this.totalPoints * 100),
      rouPosVal = (this.usedNum.length / this.includedNum.length * 100);
    this.sessionBar.style.left = sesPosVal + "%"; 
    this.roundBar.style.left = rouPosVal + "%"; 
  },
  randomXY: function() {
    var includeLength = this.includedNum.length, i, k;
    for (i=0;i<includeLength;i++) {
      for (k=0;k<includeLength;k++) {
        this.xList.push(this.includedNum[k]);
        this.yList.push(this.includedNum[k]);
      }
    }
    this.xList.sort(function(a, b){return 0.5 - Math.random()});
    this.yList.sort(function(a, b){return 0.5 - Math.random()});
  },
  nextRandomQ: function() {
    this.x = this.xList[this.qNum];
    this.y = this.yList[this.qNum];
    this.xEl.textContent = this.x;
    this.yEl.textContent = this.y;
  }
}; // don't forget to use ; after objects

// the skip_round function just has to 

// MAIN PROGRAM BELOW /////////////////////////////////////////////////
// /////////////////////////////////////////////////

(function() { 
  timesTable.initialSetup();
})();



var start = document.getElementById("start-button"),
  skip = document.getElementById("skip-button"),
  uInput = document.getElementById("u-ans");

// start practice session
start.addEventListener("click", function() { 
  timesTable.initialSetup();
  uInput.value = "";
});

// skip round 
skip.addEventListener("click", function() {
  timesTable.nextRound();
  // focuses on the answer input field so user hitting "enter" again accidentally
  // won't skip the whole round since the button was still in focuse 
  uInput.focus();
});

// clears input field 
uInput.addEventListener("focus", function() {
  uInput.value = "";
});

// submit answer
uInput.addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode; // certain browsers use e.which for keypress id-ing, others use e.keyCode
    if (key === 13) { // 13="enter" key
      timesTable.checkAnswer();
    }
});

// hide end message and reset new round 
document.getElementById("hide-end").addEventListener("click", function() {
  document.getElementById("end-msg").style.display = "none";
  timesTable.initialSetup();
});

// change to rand
document.getElementById("rand-button").addEventListener("click", function() {
  
  timesTable.sessionMode = "random";
});
// change to seq
document.getElementById("seq-button").addEventListener("click", function() {
  timesTable.sessionMode = "sequence";
});


}());
