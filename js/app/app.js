var app = {};
var bgtile;
var player;
var platforms;
var cursors;
var spaceBar;
var fly;
var saviorFly;
var gems;
var savior;
app.score = 0;
var scoreText;
var ledge;
var pipes;
var enemies, enemies2;
var gun;
var allGems;
var bullets;
var gemsScore = 0;
var dragons;
var button;
var bulletsCount = 0;
var fired = 0;
var fire;
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
     app.screenHeight = $(window).height() -25;
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
function initiateGame(){;
      bgtile = null;
      player = null;
      platforms = null;
      cursors = null;
      spaceBar = null;
      fly = null;
      saviorFly = null;
      gems = null;
      ledge = null;
      pipes = null;
      enemies = null; 
      enemies2 = null;
      gun = null;
      allGems = null;
      bullets = null;
      gemsScore = 0;
      dragons = null;
      button = null;
      bulletsCount = 0;
      fired = 0;
      fire = null;
      this.webkitAudioContext = null;
      this.AudioContext = null;
    $("#game-data").remove();
    app.world = config[stage];
    $("#select-world").hide();
     app.rider = config["chopper"];
     setProportions();
     app.game = new Phaser.Game(app.screenWidth, app.screenHeight, Phaser.AUTO, '#fighting-chopper', { preload: preload, create: create, update: update });
}
function preload() {
    app.game.load.image('bgtile', app.world.backgroundImage);
    app.game.load.image('platform', config.ground.img);
    app.game.load.atlasJSONHash('pipes',app.world.pipes.img, app.world.pipes.jsonFrame, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    //app.game.load.image('button', config.buttonUp.img);
    app.game.load.atlasJSONHash('rider', app.rider.img, app.rider.jsonFrame);
    app.game.load.atlasJSONHash('gems', config.gems.img, config.gems.jsonFrame, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    app.game.load.atlasJSONHash('playerbullets', config.bullets.img, config.bullets.jsonFrame,Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    app.game.load.atlasJSONHash('saviors', app.world.savior.img, app.world.savior.jsonFrame,Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    //app.game.load.spritesheet('pipe', 'assets/sprite/pair.png', 155, 133);
    app.game.load.spritesheet('enemy', app.world.enemy.img, app.world.enemy.x, app.world.enemy.y);
    app.game.load.spritesheet('enemy2', app.world.enemy2.img, app.world.enemy2.x, app.world.enemy2.y);
    app.game.load.atlasJSONHash('fire', config.fire.img, config.fire.jsonFrame,Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    app.game.load.image('gun', config.gun.img);
    app.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
}
function create() {
    var newGun = new Gun('playerbullets','bulletred');
    app.game.physics.startSystem(Phaser.Physics.ARCADE);
    app.game.stage.backgroundColor = "#81BEF7";
    app.game.world.height = app.screenHeight;
    bgtile = app.game.add.tileSprite(0, 0, app.screenWidth, app.screenHeight, 'bgtile');
    bgtile.tileScale.y = app.screenHeight/382;
    platforms = app.game.add.group();
    platforms.enableBody = true;
    // Creating ground
    var ground = platforms.create(0, app.game.world.height -16, 'platform');
    ground.scale.setTo(2 * app.objectScale.x * 2, .5);
    ground.body.immovable = true; // ground won't move

    //button = app.game.add.button(app.game.world.width/3 - 20, app.game.world.height - 54, 'button', actionOnClick, this, 2, 1, 0);

    // Creating player
    player = app.game.add.sprite(32, app.screenHeight - 150, 'rider');
    player.scale.set(.35 * app.objectScale.x, .35 * app.objectScale.y);
    fly = player.animations.add('fly',[1,2,3]); // adding animation
    fly.play(10, true);

    app.game.physics.arcade.enable(player);

    player.body.gravity.y = 300;

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

    enemies = app.game.add.group();
    enemies2 = app.game.add.group();
    gems = app.game.add.group();
    bullets = app.game.add.group();
    pipes = app.game.add.group();
    $("canvas").after("<div id='game-data' class='text-style'><span id='score-text'>SCORE:<span id='score'>0</span></span><span id='gems'>0</span><span id='bullets'></span></div>");
    
    app.game.input.onDown.add(function(pointer) {
        swipeCoordX = pointer.clientX;
        swipeCoordY = pointer.clientY;    
    }, this);

    app.game.input.onUp.add(function(pointer) {
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
}


function update() {
    app.game.physics.arcade.overlap(player, platforms, killPlayer);
    app.game.physics.arcade.overlap(player, enemies, killPlayer);
    app.game.physics.arcade.overlap(player, enemies2, killPlayer);
    app.game.physics.arcade.overlap(player, gems, collectGems);
    app.game.physics.arcade.overlap(enemies, bullets, killBoth);
    app.game.physics.arcade.overlap(enemies2, bullets, killBoth);
    app.game.physics.arcade.overlap(player, savior, invokeSavior);
    app.game.physics.arcade.overlap(player, gun, collectGun);
    app.game.physics.arcade.overlap(player, pipes, killPlayer);
    app.game.physics.arcade.overlap(player, fire, killPlayer);
    if(typeof savior != "undefined"){
        if(savior.body.gravity.y == 300){
          app.game.physics.arcade.overlap(savior, enemies, killEnemy);
          app.game.physics.arcade.overlap(savior, enemies2, killEnemy);
        }
    }
    bgtile.tilePosition.x -= 2;
    if (app.game.input.activePointer.isDown){
      player.body.velocity.y = -90;
      if(typeof savior != "undefined"){
          if(savior.body.gravity.y == 300){
            savior.body.velocity.y = -90;
          }
      }
    }

    if(player.alive){
    app.score += 1;
    }
    if(app.score % 10 ==0){
    $("#score").text(app.score/10);
    }
     if(app.score % config.occurance.gems == 0){
        if(typeof gems.children != "undefined"){
         gems.children=[];
        }
        var createGems = new Groups(gems,'gems','gemgreen',1*app.objectScale.x,1*app.objectScale.y,0,200,2);
        var gemsGroup = createGems.createGroups();
     }

     if(app.score % config.occurance.savior == 0){
         savior = new Sprite('saviors', app.world.savior.spriteName, app.game.world.width+150, 110, app.world.savior.scaleX * app.objectScale.x, app.world.savior.scaleY * app.objectScale.y, 200);
         savior = savior.createSprite();
     }
    if(app.score % config.occurance.enemies == 0){
     var count = Utility.randomGenerator(1,5);
     var createEnemies = new Groups(enemies,'enemy', null, .8 * app.objectScale.x, .8 * app.objectScale.y, 500, 10,count);
     var enemyGroup = createEnemies.createGroups();
     enemyGroup.callAll('animations.add', 'animations', 'fly', app.world.enemy.frames, app.world.enemy.framesRate, true);
     enemyGroup.callAll('animations.play', 'animations', 'fly');
    }
    if(app.score % config.occurance.pipe == 0){
     app.hurdle = app.score/350;
     if(app.hurdle > 4){
         app.hurdle -= 1;
     }
     var createHurdles = new Groups(pipes,'pipes', 'pipeup~pipedown',1,1,0,200,app.hurdle);
     createHurdles = createHurdles.createHurdles();
     app.game.world.bringToTop(enemies);
    }
  if(app.score % config.occurance.gun == 0){
        var y = Utility.randomGenerator(50, 150);
        gun = app.game.add.sprite(app.game.world.width - 50, app.game.world.height - y, 'gun');
        gun.scale.set(.3,.3);
        app.game.physics.enable(gun, Phaser.Physics.ARCADE);
        gun.body.velocity.x = -200;
    }
  /*if(app.score % config.occurance.enemies2 == 0){
     var count2 = Utility.randomGenerator(1,5);
     var createEnemies2 = new Groups(enemies2,'enemy2', null, .8 * app.objectScale.x, .8 * app.objectScale.y, 500, 10,count2);
     var enemyGroup2 = createEnemies2.createGroups();
     enemyGroup2.callAll('animations.add', 'animations', 'fly', app.world.enemy2.frames, app.world.enemy2.framesRate, true);
     enemyGroup2.callAll('animations.play', 'animations', 'fly');
  }*/
  /*if(app.score % config.stage.score == 0){
      app.game.paused = true;
      completeStage();
  }*/
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
    var explosion = app.game.add.sprite(player.body.x,player.body.y,"rider");
    explosion.scale.set(.35 * app.objectScale.x, .35 * app.objectScale.y);
    var explode= explosion.animations.add("destroy",[4,5,6], 10);
    explode.onComplete.add(function(){
        app.game.paused = true;
        $(".replay").show();
    });    
    explode.play(10, false);
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

function invokeSavior(player, saviour){
    //saviour.kill();
    savior.body.x = player.body.x + 80 * app.objectScale.x;
    savior.body.y = player.body.y - 10 * app.objectScale.y;
    saviorFly = saviour.animations.add('fly',[0,1,2]); // adding animation
    saviorFly.play(10, true);
    app.game.physics.arcade.enable(saviour);
    savior.body.gravity.y = 300;
    savior.body.velocity.x = 0;
    setTimeout(function(){
        saviorFly = saviour.animations.add('blink',[0,3,1,4,2]);
        saviorFly.play(10, true);
    },6000);
    setTimeout(function(){savior.kill()},8000);

}

function killBoth(bullet, enemy){
 bullet.kill();
 enemy.kill();
 var blast = app.game.add.sprite(enemy.body.position.x, enemy.body.position.y, 'playerbullets', 'blast1');
 blast.scale.setTo(.5 * app.objectScale.x, .5 * app.objectScale.y);
 setTimeout(function(){
     blast.destroy();
 }, 200);
}
function killEnemy(power, enemy){
 enemy.kill();
 var blast = app.game.add.sprite(enemy.body.position.x, enemy.body.position.y, 'playerbullets', 'blast2');
 setTimeout(function(){
     blast.destroy();
 }, 200);
}
