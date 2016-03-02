function showDown(){
game.state.add('cityShowDown',{
  preload: function(){
    game.load.image('bgtile', app.world.backgroundImage);
    game.load.image('platform', config.ground.img);
    game.load.atlasJSONHash('rider', app.rider.img, app.rider.jsonFrame);
    game.load.image('killerPlane', config.killerPlane.image);
    game.load.image('missile', config.missile.image);
  },
  create: function(){
    createBasic(app);
    this.killerPlane = game.add.sprite(app.screenWidth + 40, app.screenHeight - 300, 'killerPlane');
    this.killerPlane.scale.set(config.killerPlane.scaleX * app.objectScale.x, config.killerPlane.scaleY * app.objectScale.y);
    game.physics.arcade.enable(this.killerPlane, Phaser.Physics.ARCADE);
    this.killerPlane.body.velocity.x = -50;
    missile = [];
    missileNumber = 0;
    app.score = 0;
  },
  update: function(){
    app.score += 1;
    game.physics.arcade.overlap(player, app.platforms, killPlayer);
    if (game.input.activePointer.isDown){
      player.body.velocity.y = -90;
      }
    if(this.killerPlane.body.x < app.screenWidth - this.killerPlane.body.width + 20){
      this.killerPlane.body.velocity.x = 0;
    }
    if(app.score % 30 == 0 && this.killerPlane.body.velocity.x == 0){
      missile[missileNumber] = new Sprite('missile', '', this.killerPlane.body.position.x, this.killerPlane.body.position.y + 30, config.missile.scaleX * app.objectScale.x, config.missile.scaleY * app.objectScale.y, 200);
      missile[missileNumber] = missile[missileNumber].createSprite();
      missile[missileNumber].angle += 180;
      missile[missileNumber].body.gravity.y = Utility.randomGenerator(100, 150);
      this.currentNumber = missileNumber;
      setTimeout($.proxy(function(currentNumber){
        missile[this.currentNumber].body.gravity.y = 0;
      }, this), 250);
      missileNumber++;
    }
  }
});
}
