var canvas = document.querySelector("canvas");

canvas.height = window.innerHeight - 30;
canvas.width = window.innerWidth - 30;

var c = canvas.getContext("2d");

var player1;
var player2;

var birdRadius = 25;
var gravity = .3;
var jumpHeight = 7;
var pipeMin = 150;
var pipeGap = 175;
var pipeRange = canvas.height - pipeMin - pipeGap;
var pipeWidth = 100;
var scrollSpeed = 2;
var birdX = canvas.width / 5;
var text1;


var tick = 0;

window.addEventListener('keyup', function(e) {
  // console.log(e.keyCode);
  var key = e.keyCode;
  if (e.keyCode == 32) {
    player2.enabled = true;
  }
  if (e.keyCode == 87) {
    // PLAYER 1
    player1.jump();
  }
  if (player2.enabled) {
    if (e.keyCode == 38) {
      // PLAYER 2
      player2.jump();
    }
  }

});


function dist(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow((y2 - y1), 2) + Math.pow((x2 - x1), 2));
}

function pass() {}

function Bird(x, y, dy, radius, color, hasLost, enabled) {
  this.x = x;
  this.y = y;
  this.dy = dy;
  this.radius = radius;
  this.color = color;
  this.enabled = enabled;

  this.draw = function() {
    c.beginPath();
    c.fillStyle = this.color;
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fill();
  }

  this.update = function() {
    if (this.y + this.radius > canvas.height) {
      // this.hasLost = true;
      this.dy = -this.dy;
      this.y -= 5;
      pass();
    } else {
      this.dy += gravity;
    }
    this.y += this.dy;
    this.draw();
  }

  this.jump = function() {
    this.dy = -jumpHeight;
  }

}

var pipes = [];

function Pipe(x, topHeight, color, isChecking) {
  this.x = x;
  this.topHeight = topHeight;
  this.color = color;
  this.isChecking = isChecking;

  this.draw = function() {
    // TOP PIPE
    c.fillStyle = this.color;
    c.fillRect(this.x, 0, pipeWidth, this.topHeight)
    // BOTTOM PIPE
    c.fillRect(this.x, this.topHeight + pipeGap, pipeWidth, canvas.height - (this.topHeight + pipeGap))
  }

  this.update = function() {
    this.draw();
    this.x -= scrollSpeed;
  }

  this.ifCollide = function() {
    if ((player1.y - player1.radius > this.topHeight) && (player1.y < this.topHeight + pipeGap - player1.radius)) {
      // ITS GOOD
      pass();
    } else {
      player1.hasLost = true;
    }
    if (player2.enabled){
      if ((player2.y - player2.radius > this.topHeight) && (player2.y + player2.radius < this.topHeight + pipeGap - player2.radius)) {
        // ITS GOOD
        pass();
      } else {
        player2.hasLost = true;
      }
    }

  }
}

function TextDescription(txt, color, x, y, deg) {
  this.txt = txt;
  this.color = color;
  this.x = x;
  this.y = y;
  this.deg = deg;

  this.write = function() {
    c.font = "40px Quicksand";
    c.textAlign = "center";
    c.fillStyle = this.color;
    c.fillText(this.txt, this.x, this.y);
    // console.log("sdf");
  }

  this.update = function() {
    this.write();
    this.x -= scrollSpeed* .75;
  }

}

function init() {
  player1 = new Bird(birdX, canvas.height * .2, 0, birdRadius, "rgb(220,0,0)", false, true);
  player2 = new Bird(birdX, canvas.height * .3, 0, birdRadius, "rgb(0,0,220)", false, false);
  text1 = new TextDescription("Press W to Flap", "rgb(0,0,0)", canvas.width * .8, canvas.height / 2, 0);
}

function animate() {
  if (!player1.hasLost && !player2.hasLost) {
    requestAnimationFrame(animate);
  } else {
    console.log("you lose!");
    text1.x = canvas.width / 2;
    text1.y = canvas.height / 2;
    text1.deg = 90;
    text1.txt = "Click the screen to restart.";
    window.addEventListener('click', function(e) {
      location.reload();
    });

  }
  // console.log("hey");


  c.clearRect(0, 0, canvas.width, canvas.height);
  text1.update();
  switch (tick){
    case 150:
      text1.txt = "Press SPACE to add a second player."
      break;
    case 300:
      text1.txt = "Player 2 presses UP ARROW to Flap"
  }
  player1.update();
  if (player2.enabled) {
    player2.update();
  }
  for (var i = 0; i < pipes.length; i++) {
    pipes[i].update();
    if ((pipes[i].x < birdX + birdRadius) && (pipes[i].x + pipeWidth > birdX + birdRadius)) {
      console.log("checking!");
      pipes[i].color = "rgb(256,200,0)";
      pipes[i].ifCollide();
    }
    if (pipes[i].x < -200) {
      pipes.shift();
      console.log("shifted!");
    }
  }

  if (tick % 225 == 150) {
    console.log("pipe!");
    pipes.push(new Pipe(canvas.width + pipeWidth * 2, Math.ceil((Math.random() *pipeRange) + pipeMin), "rgb(0,200,0)", false));
  }

  // console.log(tick);
  tick++;
}

init();
animate();
