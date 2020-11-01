var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudimage, cloudgroup;
var ob1, ob2, ob3, ob4, ob5, ob6, obgroup;  
var score=0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameoverimg;
var gameover;
var restartimg;
var restart;
var jumpsound;
var diesound;
var checkpoint;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  cloudimage = loadImage("cloud.png");
  ob1 = loadImage("obstacle1.png");
  ob2 = loadImage("obstacle2.png");
  ob3 = loadImage("obstacle3.png");
  ob4 = loadImage("obstacle4.png");
  ob5 = loadImage("obstacle5.png");
  ob6 = loadImage("obstacle6.png");
  gameoverimg = loadImage("gameOver.png");
  restartimg = loadImage("restart.png");
  jumpsound = loadSound("jump.mp3");
  diesound = loadSound("die.mp3");
  checkpoint = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -2;
   
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  gameover = createSprite(300,100);
  gameover.addImage(gameoverimg);
  gameover.visible = false;
  restart = createSprite(300, 140);
  restart.addImage(restartimg);
  restart.scale = 0.5;
  restart.visible = false;
  
  cloudgroup = new Group();
  obgroup = new Group();
}

function draw() {
  background(100);
  
  fill("white");
  text("Score: "+ score, 520, 30);
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(6 + 3*score/100);
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if (score>0 && score%100 === 0){
      checkpoint.play();
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    console.log(trex.y);
     //jump when the space key is pressed
    if(keyDown("space") && trex.y >= 162){
      trex.velocityY = -12 ;
      jumpsound.play();
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(obgroup.isTouching(trex)){
      //playSound("jump.mp3");
      gameState = END;
      diesound.play();
    }
  }
  
  else if(gameState === END) {
    gameover.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obgroup.setVelocityXEach(0);
    cloudgroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obgroup.setLifetimeEach(-1);
    cloudgroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  
  //console.log(trex.y);
  
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset(){
  gameState = PLAY;
  
  gameover.visible = false;
  restart.visible = false;
  
  obgroup.destroyEach();
  cloudgroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  
}

  
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,20,40,10);
    cloud.y = Math.round(random(20,120));
    cloud.addImage(cloudimage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudgroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,160,10,40);
    obstacle.velocityX = -6;
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand)
    {
      case 1:
        obstacle.addImage(ob1);
        break;
        case 2:
        obstacle.addImage(ob2);
        break;
        case 3:
        obstacle.addImage(ob3);
        break;
        case 4:
        obstacle.addImage(ob4);
        break;
        case 5:
        obstacle.addImage(ob5);
        break;
        case 6:
        obstacle.addImage(ob6);
        break;
        default:
        break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 100;
    obgroup.add(obstacle);
  }
}