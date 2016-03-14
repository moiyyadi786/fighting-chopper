function showDown(){
game.state.add('cityShowDown',{
  preload: function(){
    game.load.image('bgtile', app.world.backgroundImage);
    game.load.image('platform', config.ground.img);
    game.load.atlasJSONHash('rider', app.rider.img, app.rider.jsonFrame);
    game.load.image('killerPlane', config.killerPlane.image);
    game.load.image('missile', config.missile.image);
    game.load.atlasJSONHash('machinegun1', config.machineGun1.img, config.machineGun1.jsonFrame, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.atlasJSONHash('bullets', config.bullets.img, config.bullets.jsonFrame,Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.image('star', config.star.img)
  },
  create: function(){
    app.world = config["cityShowdown"];
    createBasic(app);
    app.newGun = new Gun("bullets", "bulletsmall", 3, .6, .6, null);
    app.bullets = game.add.group();
    bulletsCount = 0;
    $("canvas + div").html("<span id='machine-gun1' class='machine-gun'></span><img src='assets/sprite/killer-plane.png' class='killer-plane'>");
    app.currentGunElement = $("#machine-gun1");
    this.killerPlane = game.add.sprite(app.screenWidth + 40, app.screenHeight - 320, 'killerPlane');
    this.killerPlane.scale.set(config.killerPlane.scaleX * app.objectScale.x, config.killerPlane.scaleY * app.objectScale.y);
    game.physics.arcade.enable(this.killerPlane, Phaser.Physics.ARCADE);
    this.killerPlane.body.velocity.x = -50;
    missile = [];
    missileNumber = 0;
    app.score = 0;
    var self = this;
    swipeEvent = game.input.onUp.add(function(pointer) {
        swipeCoordX2 = pointer.clientX;
        swipeCoordY2 = pointer.clientY;
        if(swipeCoordX2 > swipeCoordX + swipeMinDistance && bulletsCount > 0){
            app.newGun.fire();
            bulletsCount -= app.newGun.fireAtOnce;
            app.currentGunElement.text(bulletsCount);
            if(bulletsCount == 0){
               app.currentGunElement.hide();
            }
        }
    }, this);
    captureCordinates = game.input.onDown.add(function(pointer) {
        swipeCoordX = pointer.clientX;
        swipeCoordY = pointer.clientY;
    }, this);    
    killerPlaneMoveInterval = setInterval(function(){
      self.killerPlane.body.velocity.y = -30;
      if(self.killerPlane.body.position.y < 100){
        self.killerPlane.body.velocity.y = 30;
      }
      self.moveTime = Utility.randomGenerator(3500, 5500);
      planeMoveTimeout = setTimeout(function(){
          self.killerPlane.body.velocity.y = 0;
          console.log("plane move");
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
    machineGun1Interval = setInterval($.proxy(function(){
      self.fightObject("machineGun1","machinegun1", config.machineGun1, "machineGun1Timeout");
    },self), 8000);
    starInterval = setInterval($.proxy(function(){
      self.fightObject("star", "star", config.star, "starTimeout");   
    }, self), 10000);
  },
  update: function(){
    app.score += 1;
    game.physics.arcade.overlap(player, app.platforms, this.killPlayer);
    game.physics.arcade.overlap(player, missile, this.killBoth);
    game.physics.arcade.overlap(player, this.machineGun1, this.collectMachineGun);  
    if(game.input.activePointer.isDown){
      player.body.velocity.y = -90;
    }
    if(this.killerPlane.body.x < app.screenWidth - this.killerPlane.body.width){
      this.killerPlane.body.velocity.x = 0;
    }
  },
  killPlayer: function(player){
    killPlayer(player);
  },
  killBoth: function(player, enemy){
    enemy.kill();
    killPlayer(player);
  },
  collectMachineGun: function(player, machineGun){
    machineGun.kill();
    window.bulletsCount += 12;
    app.currentGunElement.show().text(bulletsCount);
  },
  fightObject: function(obj, name, sprite, timeoutObj){
      var posX = app.screenWidth - Utility.randomGenerator(80, 120);
      this[obj] = new Sprite(name, sprite.spriteName, posX, app.screenHeight + 30, sprite.scaleX * app.objectScale.x,sprite.scaleY * app.objectScale.y, 300);        
      this[obj] = this[obj].createSprite();
      game.physics.arcade.enable(obj, Phaser.Physics.ARCADE);
      this[obj].body.gravity.y = -150;
      window[timeoutObj] = setTimeout($.proxy(function(){
         this[obj].body.gravity.y = 150;
      }, this), Utility.randomGenerator(1000, 1500));
  }
});
}
