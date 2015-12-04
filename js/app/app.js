var app = {};
WebFontConfig = {

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Exo+2:700:latin']
    }

};
function preload() {
    app.game.load.image('bgtile', app.world.backgroundImage);
    app.game.load.image('platform', config.ground.img);
    app.game.load.atlasJSONHash('pipes', config.pipes.img, config.pipes.jsonFrame, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    //app.game.load.image('button', config.buttonUp.img);
    app.game.load.atlasJSONHash('rider', app.rider.img, app.rider.jsonFrame);
    app.game.load.atlasJSONHash('gems', config.gems.img, config.gems.jsonFrame, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    app.game.load.atlasJSONHash('playerbullets', config.bullets.img, config.bullets.jsonFrame,Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    app.game.load.atlasJSONHash('honeybees', config.honeybee.img, config.honeybee.jsonFrame,Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    //app.game.load.spritesheet('pipe', 'assets/sprite/pair.png', 155, 133);
    app.game.load.spritesheet('enemy', app.world.enemy.img, app.world.enemy.x, app.world.enemy.y);
    app.game.load.image('gun', config.gun.img);
    app.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
}

var bgtile;
var player;
var platforms;
var cursors;
var spaceBar;
var fly;
var honeyFly;
var gems;
var honeybee;
app.score = 0;
var scoreText;
var ledge;
var pipes;
var enemies;
var gun;
var allGems;
var bullets;
var gemsScore = 0;
var dragons;
var button;
function create() {

    app.game.physics.startSystem(Phaser.Physics.ARCADE);
    app.game.stage.backgroundColor = "#81BEF7";
    app.game.world.height = 400;
    bgtile = app.game.add.tileSprite(0, 0, app.game.stage.bounds.width, 400, 'bgtile');
    platforms = app.game.add.group();
    platforms.enableBody = true;
    // Creating ground
    var ground = platforms.create(0, app.game.world.height -18, 'platform');
    ground.scale.setTo(2, .5);
    ground.body.immovable = true; // ground won't move
    
    //button = app.game.add.button(app.game.world.width/3 - 20, app.game.world.height - 54, 'button', actionOnClick, this, 2, 1, 0);
    
    // Creating player
    player = app.game.add.sprite(32, app.game.world.height - 350, 'rider');
    player.scale.set(.35, .35);
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
    gems = app.game.add.group();
    bullets = app.game.add.group();
    pipes = app.game.add.group();
    $(document.body).append("<div id='game-data' class='text-style'><span id='score-text'>SCORE:<span id='score'>0</span></span><span id='gems'>0</span></div>");
}


function update() {
    app.game.physics.arcade.overlap(player, platforms, killPlayer);
    app.game.physics.arcade.overlap(player, enemies, killPlayer);   
    app.game.physics.arcade.overlap(player, gems, collectGems);
    app.game.physics.arcade.overlap(enemies, bullets, killBoth);
    app.game.physics.arcade.overlap(player, honeybee, invokeHoneybee);
    app.game.physics.arcade.overlap(player, gun, collectGun);
    app.game.physics.arcade.overlap(player, pipes, killPlayer);
    if(typeof honeybee != "undefined"){
        if(honeybee.body.gravity.y == 300){
          app.game.physics.arcade.overlap(honeybee, enemies, killEnemy);
        }
    }
    bgtile.tilePosition.x -= 2;
    if (app.game.input.activePointer.isDown){
      player.body.velocity.y = -90;
      if(typeof honeybee != "undefined"){
          if(honeybee.body.gravity.y == 300){
            honeybee.body.velocity.y = -90;
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
        var createGems = new Groups(gems,'gems','gemgreen',1,1,0,200,2);
        var gemsGroup = createGems.createGroups();
     }
    
     if(app.score % config.occurance.honeybee == 0){
         honeybee = new Sprite('honeybees', 'honeyfly01', -150, 110, .25, .25, 200);
         honeybee = honeybee.createSprite();        
     }
    if(app.score % config.occurance.enemies == 0){
     var count = Utility.randomGenerator(1,5);
     var createEnemies = new Groups(enemies,'enemy', null, .8, .8, 500, 10,count);
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
    if(app.score == 250){
        var y = Utility.randomGenerator(50, 150);
        gun = app.game.add.sprite(app.game.world.width - 50, app.game.world.height - y, 'gun');
        gun.scale.set(.3,.3);
        app.game.physics.enable(gun, Phaser.Physics.ARCADE);
        gun.body.velocity.x = -200;      
    }
    
}
function actionOnClick(){
player.body.velocity.y = -105;
}
function killPlayer(player){
    player.kill();
    //scoreText.text = "GAME OVER";
    var explosion = app.game.add.sprite(player.body.x,player.body.y,"rider");
    explosion.scale.set(.35, .35);
    var explode= explosion.animations.add("destroy",[4,5,6], 10);
    explode.onComplete.add(function(){        
        app.game.paused = true;
        
    });
    explode.play(10, false);
}
function collectGun(player, gun){
    gun.kill();
    var newGun = new Gun('playerbullets','bulletred');
    cursors = app.game.input.keyboard.createCursorKeys();
    spaceBar = app.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceBar.onDown.add(newGun.fire, newGun);  
}   
function collectGems(player, gem) {
    gem.kill();
    gemsScore++;
    $("#gems").text(gemsScore);
}

function invokeHoneybee(player, honeybee){
    //honeybee.kill();
    honeybee.body.x = player.body.x + 80;
    honeybee.body.y = player.body.y - 10;
    honeyFly = honeybee.animations.add('fly',[0,1,2]); // adding animation
    honeyFly.play(10, true);  
    app.game.physics.arcade.enable(honeybee);
    honeybee.body.gravity.y = 300;
    honeybee.body.velocity.x = 0;
    setTimeout(function(){
        honeyFly = honeybee.animations.add('blink',[0,3,1,4,2]); 
        honeyFly.play(10, true);
    },6000);
    setTimeout(function(){honeybee.kill()},8000);
    
}
    
function killBoth(bullet, enemy){
 bullet.kill();
 enemy.kill();
 var blast = app.game.add.sprite(enemy.body.position.x, enemy.body.position.y, 'playerbullets', 'blast1');
 blast.scale.setTo(.5, .5);
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