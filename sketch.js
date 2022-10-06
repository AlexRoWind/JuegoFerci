var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg
var score = 0;
var jumpSound, collidedSound;

var restart;
var edges;


function preload() {
  jumpSound = loadSound("assets/sounds/jump.wav")
  collidedSound = loadSound("assets/sounds/collided.wav")

  backgroundImg = loadImage("assets/backgroundImg.png")
  sunAnimation = loadImage("assets/sun.png");

  trex_running = loadAnimation("assets/trex_2.png", "assets/trex_1.png", "assets/trex_3.png", "assets/trex_4.png");
  trex_collided = loadAnimation("assets/trex_collided.png");

  groundImage = loadImage("assets/ground.png");

  cloudImage = loadImage("assets/cloud.png");

  obstacle1 = loadImage("assets/obstacle1.png");
  obstacle2 = loadImage("assets/obstacle2.png");
  obstacle3 = loadImage("assets/obstacle3.png");
  obstacle4 = loadImage("assets/obstacle4.png");

  restartImg = loadImage("assets/restart.png");
}

function spawnObstacles() {
  if (frameCount % 150 === 0) {
    var obstacle = createSprite(1500, height - 95, 20, 30);
    obstacle.setCollider('circle', 0, 0, 40)
    obstacle.y = Math.round(random(390, 900));
    // obstacle.debug = true
    obstacle.velocityX = -(6 + 2 * score / 300);


    //generate random obstacles
    var rand = Math.round(random(1, 4));
    switch (rand) {
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      case 3: obstacle.addImage(obstacle4);
        break;
      case 4: obstacle.addImage(obstacle4);
        break;
      default: break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    obstacle.depth = trex.depth;
    trex.depth += 1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);

  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  sun = createSprite(width - 180, 70, 10, 10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.4

  trex = createSprite(50, height - 70, 20, 50);


  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.setCollider('circle', 330, 30, 250)
  trex.scale = 0.3;
  // trex.debug=true

  invisibleGround = createSprite(width / 2, height - 3, width, 50);
  invisibleGround.shapeColor = "#f4cbaa";

  ground = createSprite(width / 2, height, width, 2);
  ground.addImage("ground", groundImage);
  ground.x = width / 2
  ground.velocityX = -(6 + 3 * score / 300);

  restart = createSprite(width / 2, height / 2);
  restart.addImage(restartImg);
  restart.scale = 0.38;

  restart.visible = false;


  // invisibleGround.visible =false

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  //trex.debug = true;
  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Score: " + score, 30, 50);


  if (gameState === PLAY) {
    score = score + Math.round(getFrameRate() / 60);
    ground.velocityX = -(6 + 3 * score / 100);

    if ((touches.length > 0 || keyDown("UP_ARROW")) && trex.y >= height - 520) {
      jumpSound.play()
      trex.velocityY = -5;
      touches = [];
    }
    if ((touches.length > 0 || keyDown("DOWN_ARROW")) && trex.y >= height - 520) {
      jumpSound.play()
      trex.velocityY = +10;
      touches = [];
    }

    if ((touches.length > 0 || keyDown("LEFT_ARROW")) && trex.y >= height - 320) {
      jumpSound.play()
      trex.velocityX = -3;
      touches = [];
    }
    if ((touches.length > 0 || keyDown("RIGHT_ARROW")) && trex.y >= height - 320) {
      jumpSound.play()
      trex.velocityX = +3;
      touches = [];
    }

    trex.velocityY = trex.velocityY + 0.5

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      collidedSound.play()
      gameState = END;
    }
  }
  else if (gameState === END) {

    restart.visible = true;

    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    //change the trex animation
    trex.changeAnimation("collided", trex_collided);
    trex.scale = 0.65;

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    if (touches.length > 0 || keyDown("SPACE")) {
      reset();
      touches = []
    }
  }

  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width + 20, height - 300, 40, 10);
    cloud.y = Math.round(random(80, 500));
    cloud.addImage(cloudImage);
    cloud.scale = 0.3;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 500;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }

}

function reset() {
  gameState = PLAY;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("running", trex_running);
  trex.scale = 0.3;

  score = 0;

}
