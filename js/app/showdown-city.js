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
