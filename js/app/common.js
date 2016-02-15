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
