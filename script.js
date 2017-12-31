document.getElementById('timer').innerHTML = 1 + ":" + 00;
var resetButton = document.getElementById("reset-button");
var timerOver = false;
var firstSquare = null;
var gameSquares = [];
var colors = [];
var gameState = "Playing";
var scoreToWin = 0;
var turns = 29;

function gameStateCheck() {
  switch (gameState) {
    case "Lost":
      document.getElementById("game-state").textContent= "Game Over!";
      document.getElementById('timer').innerHTML = 00 + ":" + 00;
    break;
    case "Won":
      document.getElementById("game-state").textContent= "You Won!";
    break;
    default:
      timerOver = false;
      document.getElementById("game-state").textContent= "";
  }
}
for (var i = 0; i < 14; i++) {
  colors.push('square-' + i);
}
function random(n) {
  return Math.floor(Math.random() * n);
}
function getSomeColors() {
  var colorscopy = colors.slice();
  var randomColors= [];
  for (var i = 0; i < 10; i++) {
    var index = random(colorscopy.length);
    randomColors.push(colorscopy.splice(index, 1)[0]);
  }
  return randomColors.concat(randomColors.slice());
}

function randomizeColors() {
  var randomColors = getSomeColors();

  gameSquares.forEach(function(gameSquare) {
    var color = randomColors.splice(random(randomColors.length), 1)[0];
    gameSquare.setColor(color);
  });
}
resetButton.onclick = function() {
  clearGame();
}

function GameSquare(el, color) {
  this.el = el;
  this.isOpen = false;
  this.isLocked = false;
  this.el.addEventListener("click", this, false);
  this.setColor(color);
}
GameSquare.prototype.handleEvent = function(e) {
  if (gameState == "Playing") {
    switch (e.type) {
      case "click":
        if (this.isOpen || this.isLocked) {
          return;
        }
      this.isOpen = true;
      this.el.classList.add('flip');
      if (turns == 0) {
        document.getElementById('turns').innerHTML = 0;
        gameState = "Lost"
        gameStateCheck();
      }
      checkGame(this);
      }
    }
  }

GameSquare.prototype.reset = function() {
  this.isOpen = false;
  this.isLocked = false;
  this.el.classList.remove('flip');
}

GameSquare.prototype.lock = function() {
  this.isLocked = true;
  this.isOpen = true;
}
GameSquare.prototype.setColor = function(color) {
  this.el.children[0].children[1].classList.remove(this.color);
  this.color = color;
  this.el.children[0].children[1].classList.add(color);
}
function setupGame() {
  var array = document.getElementsByClassName("game-square");
  var randomColors = getSomeColors();
  for (var i = 0; i < array.length; i++) {
    var index = random(randomColors.length);
    var color = randomColors.splice(index, 1)[0];
    gameSquares.push(new GameSquare(array[i], color));
  }
}
function checkGame(gameSquare) {
  document.getElementById('turns').innerHTML = turns;

  if (firstSquare === null) {
    firstSquare = gameSquare;
    return;
  }
  if (firstSquare.color === gameSquare.color) {
    turns = turns - 1;
    firstSquare.lock();
    gameSquare.lock();
    scoreToWin = scoreToWin + 1;
    if (scoreToWin == 10) {
        gameState = "Won";
        gameStateCheck();
      return;
    }
  } else {
    turns = turns - 1;
    var a = firstSquare;
    var b = gameSquare;
    setTimeout(function() {
      a.reset();
      b.reset();
      firstSquare = null;
    }, 400);
    }
    firstSquare = null;
  }
  function clearGame() {
    timerOver = true;
    if (timerOver == true) {
      document.getElementById('timer').innerHTML = 00 + ":" + 59;
      timerOver = false;
    }
    gameSquares.forEach(function(gameSquare){
      gameSquare.reset();
    });
    setTimeout(function() {
      randomizeColors();
    }, 500);
    scoreToWin = 0;
    turns = 30;
    document.getElementById('turns').innerHTML = turns;
    gameState = "Playing";
    gameStateCheck();
    startTimer();
  }

  function startTimer() {

    if (timerOver == false && gameState == "Playing") {
      var presentTime = document.getElementById('timer').innerHTML;
      var timeArray = presentTime.split(/[:]+/);
      var m = timeArray[0];
      var s = checkSecond((timeArray[1] - 1));
      if(s == 59) {
        m = m - 1;
      }
      if (m < 0 || s == 0) {
        gameState = 'Lost';
        document.getElementById('timer').innerHTML = 00 + ":" + 00;
        gameStateCheck();
        return;
      }

      document.getElementById('timer').innerHTML =
        m + ":" + s;
      setTimeout(startTimer, 1000);
    } else {
      return;
    }
  }

  function checkSecond(sec) {
    if (sec < 10 && sec >= 0) {sec = "0" + sec}; // add zero in front of numbers < 10
    if (sec < 0) {sec = "59"};
    return sec;
  }
setupGame();
startTimer();
