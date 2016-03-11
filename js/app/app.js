var app = {};
var player;
app.score = 0;
var scoreText;
var gemsScore = 0;
var bulletsCount = 0;
var fired = 0;
var fuel;
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
    
    setTimeout(function(){
    game.state.start('cityShowDown');
    }, 25000);
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
    if(typeof app.savior != "undefined"){
        if(app.savior.body.gravity.y == 300){
          game.physics.arcade.overlap(app.savior, app.enemies, killEnemy);
          game.physics.arcade.overlap(app.savior, app.enemies2, killEnemy);
        }
    }
    app.bgtile.tilePosition.x -= 2;
    if (game.input.activePointer.isDown && gas > 0){
      player.body.velocity.y = -90;
      if(typeof app.savior != "undefined"){
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
