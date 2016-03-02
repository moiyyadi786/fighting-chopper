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
  player = game.add.sprite(32, app.screenHeight - 200, 'rider');
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
    savior.body.y = player.body.y - 10 * app.objectScale.y;
    saviorFly = savior.animations.add('fly',[0,1,2]); // adding animation
    saviorFly.play(10, true);
    game.physics.arcade.enable(savior);
    savior.body.gravity.y = 300;
    savior.body.velocity.x = 0;
    setTimeout(function(){
        saviorFly = savior.animations.add('blink',[0,3,1,4,2]);
        saviorFly.play(10, true);
    },6000);
    setTimeout(function(){savior.kill()},8000);

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
