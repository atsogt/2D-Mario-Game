/*

The Game Project 4 - Side scrolling

Week 6

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var treeFloor;
var trees_x;
var clouds;
var mountains;
var canyons;

var collectable;
var game_score;
var flagpole;
var lives;

var platforms;
var enemies;

function setup() {
  createCanvas(1024, 576);
  floorPos_y = (height * 3) / 4;
  game_score = 0;
  lives = 3;
  startGame();
}

function draw() {
  background(100, 155, 255); // fill the sky blue

  noStroke();
  fill(0, 155, 0);
  rect(0, floorPos_y, width, height / 4); // draw some green ground

  push();
  translate(scrollPos, 0);

  // Draw clouds.
  drawClouds();
  // Draw mountains.

  drawMountains();

  drawTrees();

  for (var i = 0; i < platforms.length; i++) {
    platforms[i].draw();
  }

  for (const canyon of canyons) {
    checkCanyon(canyon);
    drawCanyon(canyon);
  }

  // Draw the game character - this must be last

  for (var i = 0; i < collectables.length; i++) {
    if (!collectables[i].isFound) {
      drawCollectable(collectables[i]);
      checkCollectable(collectables[i]);
    }
  }
  renderFlagPole();

  for (var i = 0; i < enemies.length; i++) {
    enemies[i].draw();
    var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);

    if (isContact) {
      if (lives > 0) {
        lives -= 1;
        startGame();

        break;
      } else {
        setup();
      }
    }
  }

  pop();

  checkPlayerDie();

  //CHARACTER STANDING STRAIGHT//
  drawGameChar();

  fill(255);
  stroke(0);
  strokeWeight(5);
  textSize(50);
  text("Score: " + game_score, 20, 100);

  fill(255);
  textSize(50);

  text("Live: " + lives, 20, 150);

  if (lives < 1) {
    textSize(32);
    fill(255);
    text("Game Over. Press H to Continue", 200, height / 2);
    lives = 0;
    return;
  }

  if (flagpole.isReached == true) {
    textSize(32);
    fill(255);
    text("Level Complete. Press H to Continue", 200, height / 2);
    return;
  }

  // noStrokeWeight();

  //////// Game character logic ///////
  // Logic to move

  if (isLeft) {
    if (gameChar_x > width * 0.2) {
      gameChar_x -= 5;
    } else {
      scrollPos += 5;
    }
  }

  if (isRight) {
    if (gameChar_x < width * 0.8) {
      gameChar_x += 5;
    } else {
      scrollPos -= 5; // negative for moving against the background
    }
  }
  // isFalling = gameChar_y < floorPos_y;

  if (gameChar_y < floorPos_y) {
    var isContact = false;
    for (var i = 0; i < platforms.length; i++) {
      if (platforms[i].checkContact(gameChar_world_x, gameChar_y) == true) {
        isContact = true;
        isFalling = false;
        break;
      }
    }
    if (isContact == false) {
      gameChar_y += 2;
      isFalling = true;
    }
  } else {
    isFalling = false;
  }

  if (isPlummeting && gameChar_y < displayHeight) {
    gameChar_y += 6;
    isLeft = false;
    isRight = false;
  }
  if (flagpole.isReached == false) {
    checkFlagpole();
  }

  //
  gameChar_world_x = gameChar_x - scrollPos;

  // createPlatforms.draw();
}

function keyPressed() {
  if (key == "A" || keyCode == 37) {
    isLeft = true;
  }

  if (key == "D" || keyCode == 39) {
    isRight = true;
  }
  if (keyCode == 38 || keyCode == 32 || key == "W") {
    if (!isFalling) {
      gameChar_y -= 120;
    }
  }
}

function keyReleased() {
  if (key == "A" || keyCode == 37) {
    isLeft = false;
  }

  if (key == "D" || keyCode == 39) {
    isRight = false;
  }
  if (key == "H") {
    if (lives == 0 || flagpole.isReached == true) {
      setup();
    }
  }
}

function drawGameChar() {
  strokeWeight(1);
  if (isLeft && isFalling) {
    // add your jumping-left code
    stroke(0);
    noFill();
    beginShape();
    vertex(gameChar_x + 10, gameChar_y - 42);
    vertex(gameChar_x + 15, gameChar_y - 43);
    vertex(gameChar_x + 16, gameChar_y - 53);
    endShape();
    fill(150, 180, 200);
    ellipse(gameChar_x + 16, gameChar_y - 53, 5, 5);

    //left arm
    stroke(0);
    noFill();
    beginShape();
    vertex(gameChar_x - 10, gameChar_y - 42);
    vertex(gameChar_x - 15, gameChar_y - 43);
    vertex(gameChar_x - 16, gameChar_y - 53);
    endShape();
    fill(150, 180, 200);
    ellipse(gameChar_x - 16, gameChar_y - 53, 5, 5);

    //body
    fill(10, 100, 70);
    stroke(1);
    beginShape();
    //left shoulder
    vertex(gameChar_x - 10, gameChar_y - 42);
    //right shoulder
    vertex(gameChar_x + 10, gameChar_y - 42);
    vertex(gameChar_x + 6, gameChar_y - 18);
    vertex(gameChar_x - 5, gameChar_y - 18);
    vertex(gameChar_x - 10, gameChar_y - 42);
    endShape();

    //right leg

    noFill();
    stroke(0);
    beginShape();
    vertex(gameChar_x + 6, gameChar_y - 18);
    vertex(gameChar_x, gameChar_y - 25);

    vertex(gameChar_x + 2, gameChar_y - 12);
    endShape();

    //left leg
    stroke(0);
    beginShape();
    vertex(gameChar_x - 5, gameChar_y - 18);
    vertex(gameChar_x - 12, gameChar_y - 25);
    vertex(gameChar_x - 10, gameChar_y - 12);
    endShape();

    //head
    fill(75, 100, 150);
    ellipse(gameChar_x, gameChar_y - 50, 20, 20);
    //hat
    stroke(0);
    fill(150, 180, 200);
    triangle(
      gameChar_x + 10,
      gameChar_y - 55,
      gameChar_x + 5,
      gameChar_y - 70,
      gameChar_x - 6,
      gameChar_y - 60
    );
  } else if (isRight && isFalling) {
    // add your jumping-right code
    stroke(0);
    noFill();
    beginShape();
    vertex(gameChar_x + 10, gameChar_y - 42);
    vertex(gameChar_x + 15, gameChar_y - 43);
    vertex(gameChar_x + 16, gameChar_y - 53);
    endShape();
    fill(150, 180, 200);
    ellipse(gameChar_x + 16, gameChar_y - 53, 5, 5);
    stroke(0);
    noFill();
    beginShape();
    vertex(gameChar_x - 10, gameChar_y - 42);
    vertex(gameChar_x - 15, gameChar_y - 43);
    vertex(gameChar_x - 16, gameChar_y - 53);
    endShape();
    fill(150, 180, 200);
    ellipse(gameChar_x - 16, gameChar_y - 53, 5, 5);
    fill(10, 100, 70);
    stroke(1);
    beginShape();
    vertex(gameChar_x - 10, gameChar_y - 42);
    vertex(gameChar_x + 10, gameChar_y - 42);
    vertex(gameChar_x + 6, gameChar_y - 18);
    vertex(gameChar_x - 5, gameChar_y - 18);
    vertex(gameChar_x - 10, gameChar_y - 42);
    endShape();
    noFill();
    stroke(0);
    beginShape();
    vertex(gameChar_x + 6, gameChar_y - 18);
    vertex(gameChar_x + 12, gameChar_y - 25);
    vertex(gameChar_x + 10, gameChar_y - 12);
    endShape();
    stroke(0);
    beginShape();
    vertex(gameChar_x - 5, gameChar_y - 18);
    vertex(gameChar_x, gameChar_y - 25);
    vertex(gameChar_x, gameChar_y - 12);
    endShape();
    stroke(1);
    fill(75, 100, 150);
    ellipse(gameChar_x, gameChar_y - 50, 20, 20);
    stroke(0);
    fill(150, 180, 200);
    triangle(
      gameChar_x - 10,
      gameChar_y - 55,
      gameChar_x - 5,
      gameChar_y - 70,
      gameChar_x + 6,
      gameChar_y - 60
    );
  } else if (isLeft) {
    // add your walking left code
    stroke(0);
    fill(150, 180, 200);
    ellipse(gameChar_x + 15, gameChar_y - 20, 5, 5);
    beginShape();
    vertex(gameChar_x + 10, gameChar_y - 42);
    vertex(gameChar_x + 15, gameChar_y - 23);
    endShape();
    ellipse(gameChar_x - 15, gameChar_y - 20, 5, 5);
    stroke(0);
    noFill();
    beginShape();
    vertex(gameChar_x - 10, gameChar_y - 42);
    vertex(gameChar_x - 15, gameChar_y - 23);
    endShape();
    stroke(0);
    beginShape();
    vertex(gameChar_x + 2, gameChar_y - 18);
    vertex(gameChar_x + 5, gameChar_y);
    endShape();
    stroke(0);
    beginShape();
    vertex(gameChar_x - 2, gameChar_y - 18);
    vertex(gameChar_x - 5, gameChar_y);
    endShape();
    fill(10, 100, 70);
    stroke(1);
    beginShape();
    vertex(gameChar_x - 10, gameChar_y - 42);
    vertex(gameChar_x + 10, gameChar_y - 42);
    vertex(gameChar_x + 6, gameChar_y - 18);
    vertex(gameChar_x - 5, gameChar_y - 18);
    vertex(gameChar_x - 10, gameChar_y - 42);
    endShape();
    stroke(1);
    fill(75, 100, 150);
    ellipse(gameChar_x, gameChar_y - 50, 20, 20);
    stroke(0);
    fill(150, 180, 200);
    triangle(
      gameChar_x + 10,
      gameChar_y - 55,
      gameChar_x + 5,
      gameChar_y - 70,
      gameChar_x - 6,
      gameChar_y - 60
    );
  } else if (isRight) {
    stroke(0);
    fill(150, 180, 200);
    ellipse(gameChar_x + 15, gameChar_y - 20, 5, 5);
    beginShape();
    vertex(gameChar_x + 10, gameChar_y - 42);
    vertex(gameChar_x + 15, gameChar_y - 23);
    endShape();
    ellipse(gameChar_x - 15, gameChar_y - 20, 5, 5);
    stroke(0);
    noFill();
    beginShape();
    vertex(gameChar_x - 10, gameChar_y - 42);
    vertex(gameChar_x - 15, gameChar_y - 23);
    endShape();
    stroke(0);
    beginShape();
    vertex(gameChar_x + 2, gameChar_y - 18);
    vertex(gameChar_x + 5, gameChar_y);
    endShape();
    stroke(0);
    beginShape();
    vertex(gameChar_x - 2, gameChar_y - 18);
    vertex(gameChar_x - 5, gameChar_y);
    endShape();
    fill(10, 100, 70);
    stroke(1);
    beginShape();
    vertex(gameChar_x - 10, gameChar_y - 42);
    vertex(gameChar_x + 10, gameChar_y - 42);
    vertex(gameChar_x + 6, gameChar_y - 18);
    vertex(gameChar_x - 5, gameChar_y - 18);
    vertex(gameChar_x - 10, gameChar_y - 42);
    endShape();
    stroke(1);
    fill(75, 100, 150);
    ellipse(gameChar_x, gameChar_y - 50, 20, 20);
    stroke(0);
    fill(150, 180, 200);
    triangle(
      gameChar_x - 10,
      gameChar_y - 55,
      gameChar_x - 5,
      gameChar_y - 70,
      gameChar_x + 6,
      gameChar_y - 60
    );
    // add your walking right code
  } else if (isFalling || isPlummeting) {
    // add your jumping facing forwards code
    stroke(0);
    noFill();
    beginShape();
    vertex(gameChar_x - 10, gameChar_y - 42);
    vertex(gameChar_x - 20, gameChar_y - 40);
    vertex(gameChar_x - 15, gameChar_y - 30);
    endShape();
    stroke(0);
    fill(150, 180, 200);
    ellipse(gameChar_x - 15, gameChar_y - 30, 5, 5);
    stroke(0);
    noFill();
    beginShape();
    vertex(gameChar_x + 10, gameChar_y - 42);
    vertex(gameChar_x + 20, gameChar_y - 40);
    vertex(gameChar_x + 15, gameChar_y - 30);
    endShape();
    stroke(0);
    fill(150, 180, 200);
    ellipse(gameChar_x + 15, gameChar_y - 30, 5, 5);
    noFill();
    stroke(0);
    beginShape();
    vertex(gameChar_x - 5, gameChar_y - 18);
    vertex(gameChar_x - 13, gameChar_y - 20);
    vertex(gameChar_x - 10, gameChar_y - 10);
    endShape();
    beginShape();
    vertex(gameChar_x + 5, gameChar_y - 18);
    vertex(gameChar_x + 13, gameChar_y - 20);
    vertex(gameChar_x + 10, gameChar_y - 10);
    endShape();
    fill(10, 100, 70);
    stroke(1);
    beginShape();
    vertex(gameChar_x - 10, gameChar_y - 42);
    vertex(gameChar_x + 10, gameChar_y - 42);
    vertex(gameChar_x + 6, gameChar_y - 18);
    vertex(gameChar_x - 5, gameChar_y - 18);
    vertex(gameChar_x - 10, gameChar_y - 42);
    endShape();
    stroke(1);
    fill(75, 100, 150);
    ellipse(gameChar_x, gameChar_y - 50, 20, 20);
    stroke(0);
    fill(150, 180, 200);
    triangle(
      gameChar_x - 10,
      gameChar_y - 55,
      gameChar_x,
      gameChar_y - 70,
      gameChar_x + 10,
      gameChar_y - 55
    );
  } else {
    // add your standing front facing code
    fill(10, 100, 70);
    stroke(1);
    beginShape();
    vertex(gameChar_x - 10, gameChar_y - 42);
    vertex(gameChar_x + 10, gameChar_y - 42);
    vertex(gameChar_x + 6, gameChar_y - 18);
    vertex(gameChar_x - 5, gameChar_y - 18);
    vertex(gameChar_x - 10, gameChar_y - 42);
    endShape();
    stroke(0);
    beginShape();
    vertex(gameChar_x - 5, gameChar_y - 18);
    vertex(gameChar_x - 5, gameChar_y);
    endShape();
    stroke(0);
    beginShape();
    vertex(gameChar_x + 6, gameChar_y - 18);
    vertex(gameChar_x + 6, gameChar_y);
    endShape();
    stroke(1);
    fill(75, 100, 150);
    ellipse(gameChar_x, gameChar_y - 50, 20, 20);
    stroke(0);
    fill(150, 180, 200);
    triangle(
      gameChar_x - 10,
      gameChar_y - 55,
      gameChar_x,
      gameChar_y - 70,
      gameChar_x + 10,
      gameChar_y - 55
    );
    ellipse(gameChar_x - 15, gameChar_y - 20, 5, 5);
    stroke(0);
    noFill();
    beginShape();
    vertex(gameChar_x - 10, gameChar_y - 42);
    vertex(gameChar_x - 15, gameChar_y - 23);
    endShape();
    fill(150, 180, 200);
    ellipse(gameChar_x + 15, gameChar_y - 20, 5, 5);
    beginShape();
    vertex(gameChar_x + 10, gameChar_y - 42);
    vertex(gameChar_x + 15, gameChar_y - 23);
    endShape();
  }
}
function drawClouds() {
  for (var i = 0; i < clouds.length; i++) {
    fill(100, 100, 130);
    ellipse(clouds[i].x_pos + 5, clouds[i].y_pos + 4, clouds[i].dia);
    ellipse(
      clouds[i].x_pos + 55,
      clouds[i].y_pos + 4,
      clouds[i].dia * clouds[i].size
    );
    ellipse(
      clouds[i].x_pos + 90,
      clouds[i].y_pos + 4,
      (clouds[i].dia * clouds[i].size) / 1.5
    );

    fill(255);
    ellipse(clouds[i].x_pos, clouds[i].y_pos, clouds[i].dia);
    ellipse(
      clouds[i].x_pos + 50,
      clouds[i].y_pos,
      clouds[i].dia * clouds[i].size
    );
    ellipse(
      clouds[i].x_pos + 85,
      clouds[i].y_pos,
      (clouds[i].dia * clouds[i].size) / 1.5
    );
  }
}
function drawMountains() {
  for (var i = 0; i < mountains.length; i++) {
    stroke(0);
    strokeWeight(1);
    fill(70, 80, 250);
    triangle(
      mountains[i].x_pos,
      mountains[i].y_pos,
      mountains[i].x_pos + 200,
      mountains[i].y_pos - 170,
      mountains[i].x_pos + 400,
      mountains[i].y_pos
    );

    fill(0, 20, 90);
    triangle(
      mountains[i].x_pos + 200,
      mountains[i].y_pos,
      mountains[i].x_pos + 200,
      mountains[i].y_pos - 170,
      mountains[i].x_pos + 400,
      mountains[i].y_pos
    );
    fill(190, 190, 255);
    triangle(
      mountains[i].x_pos + 117,
      mountains[i].y_pos - 100,
      mountains[i].x_pos + 200,
      mountains[i].y_pos - 170,
      mountains[i].x_pos + 200,
      mountains[i].y_pos - 100
    );
    fill(150, 150, 175);
    triangle(
      mountains[i].x_pos + 200,
      mountains[i].y_pos - 100,
      mountains[i].x_pos + 200,
      mountains[i].y_pos - 170,
      mountains[i].x_pos + 283,
      mountains[i].y_pos - 100
    );

    fill(20, 20, 100);
    triangle(
      mountains[i].x_pos + 250,
      mountains[i].y_pos,
      mountains[i].x_pos + 450,
      mountains[i].y_pos - 250,
      mountains[i].x_pos + 650,
      mountains[i].y_pos
    );
    fill(60, 40, 170);
    triangle(
      mountains[i].x_pos + 250,
      mountains[i].y_pos,
      mountains[i].x_pos + 450,
      mountains[i].y_pos - 250,
      mountains[i].x_pos + 450,
      mountains[i].y_pos
    );
    fill(220, 220, 255);
    triangle(
      mountains[i].x_pos + 370,
      mountains[i].y_pos - 150,
      mountains[i].x_pos + 450,
      mountains[i].y_pos - 250,
      mountains[i].x_pos + 450,
      mountains[i].y_pos - 150
    );
    fill(150, 150, 200);
    triangle(
      mountains[i].x_pos + 450,
      mountains[i].y_pos - 150,
      mountains[i].x_pos + 450,
      mountains[i].y_pos - 250,
      mountains[i].x_pos + 531,
      mountains[i].y_pos - 150
    );
    fill(100, 100, 250);
    triangle(
      mountains[i].x_pos,
      mountains[i].y_pos,
      mountains[i].x_pos + 200,
      mountains[i].y_pos - 170,
      mountains[i].x_pos + 400,
      mountains[i].y_pos
    );

    fill(0, 20, 100);
    triangle(
      mountains[i].x_pos + 200,
      mountains[i].y_pos,
      mountains[i].x_pos + 200,
      mountains[i].y_pos - 170,
      mountains[i].x_pos + 400,
      mountains[i].y_pos
    );
    fill(255, 255, 255);
    triangle(
      mountains[i].x_pos + 117,
      mountains[i].y_pos - 100,
      mountains[i].x_pos + 200,
      mountains[i].y_pos - 170,
      mountains[i].x_pos + 200,
      mountains[i].y_pos - 100
    );
    fill(200, 200, 225);
    triangle(
      mountains[i].x_pos + 200,
      mountains[i].y_pos - 100,
      mountains[i].x_pos + 200,
      mountains[i].y_pos - 170,
      mountains[i].x_pos + 283,
      mountains[i].y_pos - 100
    );
  }
}
function drawTrees() {
  noStroke();

  // Draw trees.
  for (var i = 0; i < trees_x.length; i++) {
    fill(125, 50, 50);
    rect(trees_x[i] + 50, floorPos_y / 2 + 156, 30, 60);
    fill(155, 50, 50);
    rect(trees_x[i] + 50, floorPos_y / 2 + 156, 10, 60);
    fill(50, 120, 50);
    triangle(
      trees_x[i],
      treeFloor + 70,
      trees_x[i] + 65,
      treeFloor - 50,
      trees_x[i] + 130,
      treeFloor + 70
    );
    triangle(
      trees_x[i] - 10,
      treeFloor + 110,
      trees_x[i] + 65,
      treeFloor - 10,
      trees_x[i] + 140,
      treeFloor + 110
    );
  }
}

function drawCanyon(t_canyon) {
  fill(0); // The canyon will be the color of the sky
  rect(t_canyon.x_pos, floorPos_y, t_canyon.width, 140);
  fill(255, 0, 0);
  rect(t_canyon.x_pos, floorPos_y + 120, t_canyon.width, 20);
  fill(97, 83, 66);
  // The walls of the canyon
  rect(t_canyon.x_pos, 570, t_canyon.width, 5);
  rect(t_canyon.x_pos, floorPos_y, 5, 138);
  rect(t_canyon.x_pos + t_canyon.width - 5, floorPos_y, 5, 138);
}

function checkCanyon(t_canyon) {
  if (
    gameChar_world_x >= t_canyon.x_pos &&
    gameChar_world_x <= t_canyon.x_pos + t_canyon.width &&
    gameChar_y == floorPos_y
  ) {
    isPlummeting = true;
  }
}
function drawCollectable(coll) {
  fill(250, 150, 0);
  stroke(1);
  ellipse(coll.x_pos, coll.y_pos, coll.size / 2);
}

function checkCollectable(coll) {
  var d = dist(coll.x_pos, coll.y_pos, gameChar_world_x, gameChar_y);
  if (d <= coll.size) {
    coll.isFound = true;
    game_score += 1;
  }
}

function renderFlagPole() {
  push();

  stroke(0);

  rect(flagpole.x_pos, floorPos_y - 250, 10, 249);

  if (flagpole.isReached) {
    fill(50, 250, 50);
    ellipse(flagpole.x_pos + 5, floorPos_y - 250, 50, 50);
  } else {
    fill(255, 50, 50);
    ellipse(flagpole.x_pos + 5, floorPos_y - 250, 50, 50);
  }
  pop();
}

function checkFlagpole() {
  var d = abs(gameChar_world_x - flagpole.x_pos);
  if (d < 20) {
    flagpole.isReached = true;
  }
}
function checkPlayerDie() {
  if (gameChar_y > 709) {
    if (gameChar_y > 709) {
      lives = lives - 1;
      if (lives >= 1) {
        startGame();
      } else if (lives <= 0) {
        lives = 0;
      } else {
        return;
      }
    } else if (lives <= 0) {
      startGame();
    }
  }
}

function startGame() {
  gameChar_x = width / 2;
  gameChar_y = floorPos_y;
  treeFloor = floorPos_y / 2 + 47;

  // Boolean variables to control the movement of the game character.
  isLeft = false;
  isRight = false;
  isFalling = false;
  isPlummeting = false;

  // Variable to control the background scrolling.
  scrollPos = 0;
  gameChar_world_x = gameChar_x - scrollPos;

  canyons = [
    { x_pos: 600, width: 200 },
    { x_pos: 1200, width: 120 },
    { x_pos: 1500, width: 300 },
    { x_pos: 1500, width: 300 }
  ];
  enemies = [];
  enemies.push(new Enemies(100, floorPos_y - 15, 100));
  enemies.push(new Enemies(800, floorPos_y - 15, 100));
  enemies.push(new Enemies(1200, floorPos_y - 15, 100));
  enemies.push(new Enemies(2000, floorPos_y - 15, 100));

  // Initialise arrays of scenery objects.

  trees_x = [-200, 0, 200, 500, 800, 1000, 1400, 1900];
  clouds = [
    {
      x_pos: 100,
      y_pos: 100,
      dia: 100,
      size: 0.7
    },
    {
      x_pos: 380,
      y_pos: 150,
      dia: 100,
      size: 0.7
    },
    {
      x_pos: 800,
      y_pos: 100,
      dia: 100,
      size: 0.7
    },
    {
      x_pos: 1000,
      y_pos: 100,
      dia: 100,
      size: 0.7
    },
    {
      x_pos: 1500,
      y_pos: 100,
      dia: 100,
      size: 0.7
    },
    {
      x_pos: 2000,
      y_pos: 150,
      dia: 100,
      size: 0.7
    }
  ];

  flagpole = { x_pos: 2100, y_pos: floorPos_y, isReached: false };

  mountains = [
    { x_pos: gameChar_x - 150, y_pos: floorPos_y },
    {
      x_pos: gameChar_x - 205,
      y_pos: floorPos_y
    },
    { x_pos: gameChar_x + 220, y_pos: floorPos_y }
  ];

  collectables = [
    { x_pos: 580, y_pos: floorPos_y - 80, size: 50, isFound: false },
    { x_pos: 800, y_pos: floorPos_y - 80, size: 50, isFound: false },
    { x_pos: 910, y_pos: floorPos_y - 120, size: 50, isFound: false },
    { x_pos: 1440, y_pos: floorPos_y - 20, size: 50, isFound: false },
    { x_pos: 1500, y_pos: floorPos_y - 120, size: 50, isFound: false }
  ];

  platforms = [];
  platforms.push(createPlatforms(620, floorPos_y - 85, 100));
  platforms.push(createPlatforms(1530, floorPos_y - 85, 120));
  noStroke();
}

function createPlatforms(x, y, length) {
  var p = {
    x: x,
    y: y,
    length: length,
    draw: function() {
      stroke(0);

      fill(10, 255, 255);
      rect(this.x, this.y, this.length, 20);
      textSize(18);
      fill(0);
      text("Platform :)", this.x + 5, this.y + 17);
    },
    checkContact: function(gc_x, gc_y) {
      if (gc_x > this.x && gc_x < this.x + this.length) {
        var d = this.y - gc_y;
        if (d >= 0 && d < 5) {
          return true;
        }
      }
      return false;
    }
  };
  return p;
}

function Enemies(x, y, range) {
  this.x = x;
  this.y = y;
  this.range = range;

  this.currentX = x;
  this.inc = 1;

  this.update = function() {
    this.currentX += this.inc;

    if (this.currentX >= this.x + this.range) {
      this.inc = -1.5;
    } else if (this.currentX < this.x) {
      this.inc = 1.5;
    }
  };
  this.draw = function() {
    this.update();

    fill(0);
    rect(this.currentX - 13, this.y - 13, 25, 25);
    fill(255, 0, 0);
    ellipse(this.currentX, this.y, 20, 20);
    fill(0);
    textSize(20);
    text("X", this.currentX - 7, this.y + 8);
  };
  this.checkContact = function(gc_x, gc_y) {
    var d = dist(gc_x, gc_y, this.currentX, this.y);
    if (d < 20) {
      return true;
    }
    return false;
  };
}
