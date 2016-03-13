Utility = {
randomGenerator: function(from, to){
    return Math.floor(Math.random() * (from - to + 1)) + to;
  }
}
var config = {
  cityWorld: {
    backgroundImage: "assets/sprite/nyc.png",
    enemy: {
      name: "heli",
      img: "assets/sprite/heli.gif",
      jsonFrame: "assets/sprite/heli.json",
      scaleX: .8,
      scaleY: .8,
      frames: [0,1,2],
      framesRate: 10
    },
    enemy2: {
      name: "bird",
      img: "assets/sprite/bird.png",
      jsonFrame: "assets/sprite/bird.json",
      scaleX: .35,
      scaleY: .35,
      frames: [0,1,2],
      framesRate: 10
    },
    pipes: {
      name: "pipes",
      img: "assets/sprite/pipe.png",
      jsonFrame: "assets/sprite/pipe_frames.json",
      scaleX: .25,
      scaleY: .25
    },
    savior: {
      name: "honeybee",
      img: "assets/sprite/honey-bee.png",
      jsonFrame: "assets/sprite/honey-bee-frames.json",
      spriteName: "honeyFly01",
      scaleX: .25,
      scaleY: .25
    }
  },
  desertWorld: {
    backgroundImage: "assets/sprite/desert.jpg",
    enemy: {
      name: "dragon",
      img: "assets/sprite/dragon.png",
      x: 116,
      y: 98,
      frames:[0,1,2,3],
      framesRate: 7
    }
  },
  gems: {
    name: "gems",
    img: "assets/sprite/gems.png",
    jsonFrame: "assets/sprite/gems_frames.json",
  },
  gas: {
    name: "gas",
    img: "assets/sprite/gas.png",
    scaleX: .8,
    scaleY: 1
  },
  bullets: {
    name: "bullets",
    img: "assets/sprite/bullets.png",
    jsonFrame: "assets/sprite/bullets_frames.json",
  },
  ground: {
    name: "groud",
    img: "assets/sprite/platform.png"
  },
  buttonUp: {
    name: "button",
    img: "assets/sprite/button-up.png"
  },
  chopper: {
    name: "chopper",
    img: "assets/sprite/helicopter.png",
    jsonFrame: "assets/sprite/chopper_frames.json"
  },
  dragonRider: {
    name: "chopper",
    img: "assets/sprite/dragonrider.png",
    jsonFrame: "assets/sprite/dragon_rider.json"
  },
  gun: {
      name: "gun",
      img: "assets/sprite/gun.gif"
  },
  fire: {
      name: "fire",
      img: "assets/sprite/fire.png",
      jsonFrame: "assets/sprite/fire-frames.json"
  },
  pipedesign: ["uniform", "increasing", "decreasing"],
  killerPlane: {
    name: "",
    image: "assets/sprite/killer-plane.png",
    scaleX: .55,
    scaleY: .75
  },
  missile: {
    image: "assets/sprite/missile.gif",
    scaleX: 1,
    scaleY: 1
  },
  machineGun1:{
      name: "machineGun1",
      img: "assets/sprite/machine-guns.png",
      jsonFrame: "assets/sprite/machine-guns-frames.json",
      spriteName: "machineGun01",
      scaleX: .35,
      scaleY: .35     
  },
  occurance: {
    pipe: Utility.randomGenerator(200, 300),
    enemies: Utility.randomGenerator(200, 300),
    enemies2: Utility.randomGenerator(600, 800),
    savior: Utility.randomGenerator(700, 800),
    //gems: Utility.randomGenerator(400, 500),
    gun: Utility.randomGenerator(500, 800)
  },
  flashColors:[0xF5A9A9, 0xF3F781, 0x9FF781, 0x81F7F3, 0x819FF7, 0xE2A9F3, 0xE6E6E6]
  }

var app = {};
var player;
app.score = 0;
var scoreText;
var gemsScore = 0;
var bulletsCount = 0;
var fired = 0;
var fuel;
var flashIndex= 0;
var swipeCoordX,
    swipeCoordY,
    swipeCoordX2,
    swipeCoordY2,
    swipeMinDistance = 50;
var stage = "cityWorld";
WebFontConfig = {

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Exo+2:700:latin']
    }

};
function setProportions(){
     app.screenHeight = $(window).height() -35;
     app.screenWidth = $(window).width();
     app.objectScale = {};
     app.hurdleScale = {};
     app.objectScale.x = 1;
     app.objectScale.y = 1;
     app.hurdleScale.x = 1;
     app.hurdleScale.y = 1
     if(app.screenWidth > 500){
        app.objectScale.x += (app.screenWidth - 500)/1000;
        app.hurdleScale.x += (app.screenWidth - 500)/350;
     } else {
        app.objectScale.x -= (500 - app.screenWidth)/1000;
        app.hurdleScale.x -= (500 - app.screenWidth)/350;
     }
    if(app.screenHeight > 500){
        app.objectScale.y += (app.screenHeight - 500)/100;
        app.hurdleScale.y += (app.screenHeight - 500)/720;

     } else {
        app.objectScale.y -= (500 - app.screenHeight)/1000;
        app.hurdleScale.y -= (500 - app.screenHeight)/720;
    }
    if(app.objectScale.x/app.objectScale.y > 1.5){
        app.objectScale.x = app.objectScale.y * 1.25
    }
     if(app.objectScale.y/app.objectScale.y > 1.5){
        app.objectScale.y = app.objectScale.x * 1.25
    }
}
function initiateGame(){
      player = null;
      gemsScore = 0;
      bulletsCount = 0;
      fired = 0;
      gas = 100;
      fuel = null;
      this.webkitAudioContext = null;
      this.AudioContext = null;
    $("#game-data").remove();
    app.world = config[stage];
    $("#select-world").hide();
     app.rider = config["chopper"];
     setProportions();
     //console.log("before");
     game = new Phaser.Game(app.screenWidth, app.screenHeight, Phaser.AUTO, '#fighting-chopper',{
    preload: function() {
    //console.log(app);
    game.load.image('bgtile', app.world.backgroundImage);
    game.load.image('platform', config.ground.img);
    game.load.atlasJSONHash('pipes',app.world.pipes.img, app.world.pipes.jsonFrame, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    //app.game.load.image('button', config.buttonUp.img);
    game.load.atlasJSONHash('rider', app.rider.img, app.rider.jsonFrame);
    game.load.atlasJSONHash('gems', config.gems.img, config.gems.jsonFrame, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.image('gas', config.gas.img);
    game.load.atlasJSONHash('playerbullets', config.bullets.img, config.bullets.jsonFrame,Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.atlasJSONHash('saviors', app.world.savior.img, app.world.savior.jsonFrame, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    //app.game.load.spritesheet('pipe', 'assets/sprite/pair.png', 155, 133);
    game.load.atlasJSONHash('enemy', app.world.enemy.img, app.world.enemy.jsonFrame, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.atlasJSONHash('enemy2', app.world.enemy2.img, app.world.enemy2.jsonFrame, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.atlasJSONHash('fire', config.fire.img, config.fire.jsonFrame,Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

    game.load.image('gun', config.gun.img);
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    showDown();
},
   create: function() {
    var newGun = new Gun('playerbullets','bulletred');
    createBasic(app);
    //  The score
   /* scoreText = app.game.add.text(380, 390, 'Score: 0');
    scoreText.anchor.setTo(0.5);
    scoreText.font = 'Revalia';
    scoreText.fontSize = 22;
    grd = scoreText.context.createLinearGradient(0, 0, 0, scoreText.canvas.height);
    grd.addColorStop(0, '#CCFFFF');
    grd.addColorStop(1, '#F0FFFF');
    scoreText.fill = grd;
    scoreText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);*/

    app.enemies = game.add.group();
    app.enemies2 = game.add.group();
    //gems = app.game.add.group();
    app.bullets = game.add.group();
    app.pipes = game.add.group();
    $("canvas").after("<div id='game-data' class='text-style'><span id='score-text'>SCORE:<span id='score'>0</span></span><span id='bullets'></span><div class='meter animate'><img src='assets/sprite/gas.png' class='gas'><span style='width: 100%'><span></span></span></div></div>");
    game.input.onDown.add(function(pointer) {
        swipeCoordX = pointer.clientX;
        swipeCoordY = pointer.clientY;
    }, this);

    game.input.onUp.add(function(pointer) {
        swipeCoordX2 = pointer.clientX;
        swipeCoordY2 = pointer.clientY;
        if(swipeCoordX2 > swipeCoordX + swipeMinDistance && bulletsCount > 0){
            newGun.fire();
            bulletsCount -= 1;
            $("#bullets").text(bulletsCount);
        }
        if(bulletsCount == 0){
            $("#bullets").hide();
        }
    }, this);
    
    changeState = setTimeout(function(){
    game.state.start('cityShowDown');
    }, 18000);
},
update: function() {
    game.physics.arcade.overlap(player, app.platforms, killPlayer);
    game.physics.arcade.overlap(player, app.enemies, killPlayer);
    game.physics.arcade.overlap(player, app.enemies2, killPlayer);
    //app.game.physics.arcade.overlap(player, gems, collectGems);
    game.physics.arcade.overlap(app.enemies, app.bullets, killBoth);
    game.physics.arcade.overlap(app.enemies2, app.bullets, killBoth);
    game.physics.arcade.overlap(player, app.savior, invokeSavior);
    game.physics.arcade.overlap(player, app.gun, collectGun);
    game.physics.arcade.overlap(player, app.pipes, killPlayer);
    game.physics.arcade.overlap(player, app.fire, killPlayer);
    game.physics.arcade.overlap(player, fuel, refuel);
    if(app.savior){
        if(app.savior.body.gravity.y == 300){
          game.physics.arcade.overlap(app.savior, app.enemies, killEnemy);
          game.physics.arcade.overlap(app.savior, app.enemies2, killEnemy);
          player.tint = config.flashColors[flashIndex];
          flashIndex++;
          if(flashIndex > 3){
              flashIndex = 0;
          }
        }
    }
    app.bgtile.tilePosition.x -= 2;
    if (game.input.activePointer.isDown && gas > 0){
      player.body.velocity.y = -90;
      if(app.savior){
          if(app.savior.body.gravity.y == 300){
            app.savior.body.velocity.y = -90;
          }
      }
    }

    if(player.alive){
    app.score += 1;
    }
    if(app.score % 10 == 0){
    $("#score").text(app.score/10);
    gas = gas - 1;
    $(".meter > span").css("width", gas+"%")
    }
     /*if(app.score % config.occurance.gems == 0){
        if(typeof gems.children != "undefined"){
         gems.children=[];
        }
        var createGems = new Groups(gems,'gems','gemgreen',1*app.objectScale.x,1*app.objectScale.y,0,200,2);
        var gemsGroup = createGems.createGroups();
     }*/

     if(app.score % config.occurance.savior == 0){
         app.savior = new Sprite('saviors', app.world.savior.spriteName, game.world.width+150, 110, app.world.savior.scaleX * app.objectScale.x, app.world.savior.scaleY * app.objectScale.y, 200);
         app.savior = app.savior.createSprite();
     }
    if(app.score % config.occurance.enemies == 0){
     var count = Utility.randomGenerator(1,5);
     var createEnemies = new Groups(app.enemies,'enemy', null,app.world.enemy.scaleX * app.objectScale.x, app.world.enemy.scaleY * app.objectScale.y, 500, 10,count);
     var enemyGroup = createEnemies.createGroups();
     enemyGroup.callAll('animations.add', 'animations', 'fly', app.world.enemy.frames, app.world.enemy.framesRate, true);
     enemyGroup.callAll('animations.play', 'animations', 'fly');
    }
    /*if(app.score % config.occurance.enemies2 == 0){
     var count = Utility.randomGenerator(0,3);
     var createEnemies2 = new Groups(app.enemies2,'enemy2', null,app.world.enemy2.scaleX * app.objectScale.x, app.world.enemy2.scaleY * app.objectScale.y, 500, 10,count);
     var enemyGroup2 = createEnemies2.createGroups();
     enemyGroup2.callAll('animations.add', 'animations', 'fly', app.world.enemy2.frames, app.world.enemy2.framesRate, true);
     enemyGroup2.callAll('animations.play', 'animations', 'fly');
    }*/
    if(app.score % config.occurance.pipe == 0){
     app.hurdle = app.score/350;
     if(app.hurdle > 4){
         app.hurdle -= 1;
     }
     var createHurdles = new Groups(app.pipes,'pipes', 'pipeup~pipedown',1,1,0,200,app.hurdle);
     createHurdles = createHurdles.createHurdles();
     game.world.bringToTop(app.enemies);
     game.world.bringToTop(app.enemies2);
    }
   if(app.score % config.occurance.gun == 0){
        var y = Utility.randomGenerator(50, 150);
        app.gun = game.add.sprite(game.world.width - 50, game.world.height - y, 'gun');
        app.gun.scale.set(.3,.3);
        game.physics.enable(app.gun, Phaser.Physics.ARCADE);
        app.gun.body.velocity.x = -200;
    }
    if((gas == 55 || gas == 30) && app.score % 10 == 0){
      fuel = new Sprite('gas', '', game.world.width + 100, Utility.randomGenerator(100,150), config.gas.scaleX * app.objectScale.x, config.gas.scaleY * app.objectScale.y, 200);
      fuel = fuel.createSprite();
    }
}});
game.paused = false;
}

function createBasic(app){
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = "#81BEF7";
  game.world.height = app.screenHeight;
  app.bgtile = game.add.tileSprite(0, 0, app.screenWidth, app.screenHeight, 'bgtile');
  app.bgtile.tileScale.y = app.screenHeight/382;
  app.platforms = game.add.group();
  app.platforms.enableBody = true;
  // Creating ground
  var ground = app.platforms.create(0, game.world.height -16, 'platform');
  ground.scale.setTo(2 * app.objectScale.x * 2, .5);
  ground.body.immovable = true; // ground won't move

  //button = app.game.add.button(app.game.world.width/3 - 20, app.game.world.height - 54, 'button', actionOnClick, this, 2, 1, 0);

  // Creating player
    createPlayer(32, app.screenHeight - 200, 'rider');
}
function createPlayer(x, y, sprite, clean){
  if(clean){
    player.kill();
    player = null;
  }
  player = game.add.sprite(x, y, sprite);
  player.scale.set(.35 * app.objectScale.x, .35 * app.objectScale.y);
  app.fly = player.animations.add('fly',[1,2,3]); // adding animation
  app.fly.play(10, true);
  game.physics.arcade.enable(player);
  player.body.gravity.y = 300;   
}
function completeStage(){
    $("canvas").remove();
}
function actionOnClick(){
    player.body.velocity.y = -105;
}
function killPlayer(player){
    player.kill();
    //scoreText.text = "GAME OVER";
    var explosion = game.add.sprite(player.body.x,player.body.y,"rider");
    explosion.scale.set(.35 * app.objectScale.x, .35 * app.objectScale.y);
    var explode= explosion.animations.add("destroy",[4,5,6], 10);
    explode.onComplete.add(function(){
        game.paused = true;
        $(".replay").show();
    });
    explode.play(10, false);
    clearTimeout(changeState);
}
function collectGun(player, gun){
    gun.kill();
    bulletsCount += 6;
    $("#bullets").show().text(bulletsCount);
    /*cursors = app.game.input.keyboard.createCursorKeys();
    spaceBar = app.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceBar.onDown.add();*/
}
function collectGems(player, gem) {
    gem.kill();
    gemsScore++;
    $("#gems").text(gemsScore);
}

function invokeSavior(player, savior){
    savior.body.x = player.body.x + 80 * app.objectScale.x;
    savior.body.y = player.body.y * app.objectScale.y;
    saviorFly = savior.animations.add('fly',[0,1,2]); // adding animation
    saviorFly.play(10, true);
    game.physics.arcade.enable(savior);
    savior.body.gravity.y = 300;
    savior.body.velocity.x = 0;
    setTimeout(function(){
        saviorFly = savior.animations.add('blink',[0,3,1,4,2]);
        saviorFly.play(10, true);
    },6000);
    setTimeout(function(){
      app.savior.kill();
      app.savior = null;
      createPlayer(player.body.x, player.body.y, 'rider', true);    
    },8000);
   // tweenTint(player, 0xCEECF5, 0xCEECF5, 8000);
    
}

function killBoth(bullet, enemy){
 bullet.kill();
 enemy.kill();
 var blast = game.add.sprite(enemy.body.position.x, enemy.body.position.y, 'playerbullets', 'blast1');
 blast.scale.setTo(.5 * app.objectScale.x, .5 * app.objectScale.y);
 setTimeout(function(){
     blast.destroy();
 }, 200);
}
function killEnemy(power, enemy){
 enemy.kill();
 var blast = game.add.sprite(enemy.body.position.x, enemy.body.position.y, 'playerbullets', 'blast2');
 setTimeout(function(){
     blast.destroy();
 }, 200);
}
function refuel(player, fuel){
  fuel.kill();
  gas += 50;
}
function tweenTint(obj, startColor, endColor, time) {    
    // create an object to tween with our step value at 0    
    var colorBlend = {step: 0};    // create the tween on this object and tween its step property to 100    
    var colorTween = game.add.tween(colorBlend).to({step: 100}, time);        // run the interpolateColor function every time the tween updates, feeding it the    
    // updated value of our tween each time, and set the result as our tint    
    colorTween.onUpdateCallback(function() {      
        obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);       
    });        
    // set the object to the start color straight away    
    obj.tint = startColor;            
    // start the tween    
    colorTween.start();
}
/*
groups.js serve contains functions to create group instance
Groups function accept parameter for new group creation
*/
var Groups = function(groupObj, groupName, spriteName, scaleX, scaleY, randomSpeed, velocity, headCount){
this.groupObj=groupObj;
this.groupName=groupName;
this.spriteName=spriteName;
this.scaleX=scaleX;
this.scaleY=scaleY;
this.randomSpeed=randomSpeed;
this.velocity=velocity;
this.headCount=headCount;
};
Groups.prototype.createGroups = function(){

    for(var i = 0 ; i < this.headCount; i++){
     var posX = 50 + (i * -200);
     var posY = Utility.randomGenerator(100, game.world.height-50);
     var group =   this.groupObj.create(game.world.width - posX, game.world.height - posY, this.groupName);
     group.anchor.setTo(0.5, 0.5);
     group.scale.setTo(this.scaleX, this.scaleY)
     //var flyHeli = heli.animations.add('walk');
     //flyHeli.play(10, true);
     game.physics.enable(group, Phaser.Physics.ARCADE);
     var speed = Math.floor((Math.random() * this.randomSpeed)) + this.velocity;
     if(this.randomSpeed > 0){
     if(speed < 250 ){
      speed = 250 + speed;
     } else if(speed > 1000) {
        speed = 700;
     }
     }
     group.body.velocity.x -= speed;

    }
    return this.groupObj;
}
Groups.prototype.createHurdles = function(){
    var posX = -50;
    var updesign = config.pipedesign[Utility.randomGenerator(0,4) - 1];
    var count = Utility.randomGenerator(0,6);
    var changeScale = 0;
    var scale = 1;
    var redPipe = Utility.randomGenerator(0,5);
    var pipeGroup = [];
    if(updesign == "increasing"){
         changeScale = Utility.randomGenerator(14,20)/100;
     } else if(updesign == "decreasing"){
     } else {
         scale =  Utility.randomGenerator(150,200)/100;
     }
     var sprites = this.spriteName.split("~");
     var pipeGap = 0;
     if(Utility.randomGenerator(0,13)/3 != 0){
        pipeGap = Utility.randomGenerator(10,30);
     }

     for(var i = 0; i < count; i++){
      posX -= 39 + pipeGap;
      scale += i * changeScale;
      pipeGroup[i] = this.groupObj.create(game.world.width - posX, 0, this.groupName, sprites[0]);
      pipeGroup[i].anchor.setTo(0.5, 0.5);
      pipeGroup[i].scale.setTo(1, scale * app.hurdleScale.y);
      game.physics.enable(pipeGroup[i], Phaser.Physics.ARCADE);
      pipeGroup[i].body.velocity.x -= 200;
      pipeGroup[i]["pipePosition"] = "up";

     }
     changeScale = 0;
     scale = 1;
     var downdesign = config.pipedesign[Utility.randomGenerator(0,4) - 1];
     count = Utility.randomGenerator(0,6);
     pipeGap = 0;
     if(Utility.randomGenerator(0,13)/2 == 0){
        pipeGap = Utility.randomGenerator(10,30);
     }
    if(updesign == "increasing"){
         changeScale = Utility.randomGenerator(14,20)/100;
     } else if(updesign == "decreasing"){
        scale = 1.75;
        changeScale = -Utility.randomGenerator(14,20)/100;
     } else {
         scale =  Utility.randomGenerator(150,200)/100;
     }
     posX = -50;
     for(var i = 0; i < count; i++){
      posX -= 38 + pipeGap;
      scale += i * changeScale;
      pipeGroup[i] =   this.groupObj.create(game.world.width - posX, game.world.height, this.groupName,sprites[1]);
      pipeGroup[i].anchor.setTo(0.5, 0.5);
      pipeGroup[i].scale.setTo(1, scale * app.hurdleScale.y);
      game.physics.enable(pipeGroup[i], Phaser.Physics.ARCADE);
      pipeGroup[i].body.velocity.x -= 200;
      pipeGroup[i]["pipePosition"] = "down";
     }
     if(pipeGroup[redPipe]){
         pipeGroup[redPipe].tint = 0xff0000;
         //alert( Math.abs((pipeGroup[redPipe].body.sourceHeight * app.hurdleScale.y * pipeGroup[redPipe].scale.y) - (pipeGroup[redPipe].body.sourceHeight * app.hurdleScale.y)));
         var y = (game.world.height - 18) - pipeGroup[redPipe].body.halfHeight;
         var x = pipeGroup[redPipe].body.position.x;
         var framesFire = [0,1,2,3];
         var frameToUse = "firedown00";
         if(pipeGroup[redPipe].pipePosition === "up"){
             y = pipeGroup[redPipe].body.halfHeight + 16;
             x += 5;
             frameToUse = "fireup00";
             framesFire = [4,5,6,7];
         }
        app.fire = new Sprite('fire', frameToUse , x, y, app.objectScale.x, app.objectScale.y, 200);
        app.fire = app.fire.createSprite();
        var fireFrames = app.fire.animations.add('burn',framesFire); // adding animation
        fireFrames.play(4, true);
        game.physics.arcade.enable(app.fire);
        game.world.bringToTop(app.pipes);

     }
}

var Sprite = function(spriteName, spriteImage, posX, posY, scaleX, scaleY, velocity){
    this.spriteName = spriteName;
    this.spriteImage = spriteImage;
    this.posX = posX;
    this.posY= posY;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    this.velocity= velocity;
}

Sprite.prototype.createSprite = function(){
   var sprite = game.add.sprite(this.posX,this.posY, this.spriteName, this.spriteImage);
   sprite.anchor.setTo(.5, .5);
   sprite.scale.setTo(this.scaleX, this.scaleY);
   game.physics.enable(sprite, Phaser.Physics.ARCADE);
   sprite.body.velocity.x = -200;
   return sprite;
}

var Gun = function(playerbullets, bulletType){
  this.playerbullets = playerbullets;
  this.bulletType = bulletType;
}
Gun.prototype.fire = function(){
  var firedBullet = app.bullets.create(player.body.position.x + 50, player.body.position.y + 20, this.playerbullets, this.bulletType);
  game.physics.enable(firedBullet, Phaser.Physics.ARCADE);
  firedBullet.body.velocity.x = 200;
  firedBullet.outOfBoundsKill = true;   
}
function showDown(){
game.state.add('cityShowDown',{
  preload: function(){
    game.load.image('bgtile', app.world.backgroundImage);
    game.load.image('platform', config.ground.img);
    game.load.atlasJSONHash('rider', app.rider.img, app.rider.jsonFrame);
    game.load.image('killerPlane', config.killerPlane.image);
    game.load.image('missile', config.missile.image);
    game.load.atlasJSONHash('machinegun1', config.machineGun1.img, config.machineGun1.jsonFrame, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
  },
  create: function(){
    createBasic(app);
     $("canvas + div").html("<img src='assets/sprite/killer-plane.png' class='killer-plane'>");
    this.killerPlane = game.add.sprite(app.screenWidth + 40, app.screenHeight - 320, 'killerPlane');
    this.killerPlane.scale.set(config.killerPlane.scaleX * app.objectScale.x, config.killerPlane.scaleY * app.objectScale.y);
    game.physics.arcade.enable(this.killerPlane, Phaser.Physics.ARCADE);
    this.killerPlane.body.velocity.x = -50;
    missile = [];
    missileNumber = 0;
    app.score = 0;
    var self = this;
    killerPlaneMoveInterval = setInterval(function(){
      self.killerPlane.body.velocity.y = -30;
      if(self.killerPlane.body.position.y < 100){
        self.killerPlane.body.velocity.y = 30;
      }
      self.moveTime = Utility.randomGenerator(3500, 5500);
      setTimeout(function(){
          self.killerPlane.body.velocity.y = 0;
        }, self.moveTime);
    }, 8000);
     missleInterval = setInterval(function(){
      var attack = Utility.randomGenerator(0,2);
      for(var i = 0; i <= attack; i++){
        missile[missileNumber] = new Sprite('missile', '', self.killerPlane.body.position.x, self.killerPlane.body.position.y + 30, config.missile.scaleX * app.objectScale.x, config.missile.scaleY * app.objectScale.y, 200);
        missile[missileNumber] = missile[missileNumber].createSprite();
        missile[missileNumber].angle += 180;
        if((Utility.randomGenerator(0, 10) % 2) == 0){
        if(self.killerPlane.body.position.y < 100){
           missile[missileNumber].body.gravity.y = Utility.randomGenerator(40, 80);
        } else if(app.screenHeight - self.killerPlane.body.position.y < 100){
           missile[missileNumber].body.gravity.y = -Utility.randomGenerator(40, 80);
        } else {
          missile[missileNumber].body.gravity.y = Utility.randomGenerator(40, 80);
          if((Utility.randomGenerator(0, 10) % 2) == 0){
            missile[missileNumber].body.gravity.y = -missile[missileNumber].body.gravity.y;
          }
        }
        self.currentNumber = missileNumber;
          setTimeout($.proxy(function(currentNumber){
            missile[self.currentNumber].body.gravity.y = 0;
          }, self), Utility.randomGenerator(100, 150));
        }
        missileNumber++;
      }
    }, 3000);
    machineGun1Interval = setInterval(function(){
      var posX = app.screenWidth - Utility.randomGenerator(80, 120);
      self.machineGun1 = new Sprite('machinegun1', config.machineGun1.spriteName, posX, app.screenHeight + 30, config.machineGun1.scaleX * app.objectScale.x, config.machineGun1.scaleY * app.objectScale.y, 300);        
      self.machineGun1 = self.machineGun1.createSprite();
      game.physics.arcade.enable(self.machineGun1, Phaser.Physics.ARCADE);
      self.machineGun1.body.gravity.y = -150;
      setTimeout(function(){
          self.machineGun1.body.gravity.y = 150;
      }, Utility.randomGenerator(1000, 1500));
    }, 10000);
  },
  update: function(){
    app.score += 1;
    game.physics.arcade.overlap(player, app.platforms, this.killPlayer);
    game.physics.arcade.overlap(player, missile, this.killBoth);
    if (game.input.activePointer.isDown){
      player.body.velocity.y = -90;
      }
    if(this.killerPlane.body.x < app.screenWidth - this.killerPlane.body.width){
      this.killerPlane.body.velocity.x = 0;
    }
  },
  killPlayer: function(player){
    clearInterval(killerPlaneMoveInterval);
    clearInterval(missleInterval);
    clearInterval(machineGun1Interval);
    killPlayer(player);
  },
  killBoth: function(player, enemy){
    clearInterval(killerPlaneMoveInterval);
    clearInterval(missleInterval);
    clearInterval(machineGun1Interval);
    enemy.kill();
    killPlayer(player);
  }
});
}
