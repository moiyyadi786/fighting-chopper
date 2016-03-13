var Gun = function(playerbullets, bulletType, fireAtOnce, scaleX, scaleY, color){
  this.playerbullets = playerbullets;
  this.bulletType = bulletType;
  this.fireAtOnce = fireAtOnce;
  this.scaleX = scaleX;
  this.scaleY = scaleY;
  this.color = color;
}
Gun.prototype.fire = function(){
 var previousBullet;
 for(var i=0; i < this.fireAtOnce; i++){
     var posX;
     var posY;
     if(previousBullet){
          posX = previousBullet.body.position.x - 30;
      } else {
          posX = player.body.position.x + 50;
      }
      var firedBullet = app.bullets.create(posX, player.body.position.y, this.playerbullets, this.bulletType);
      game.physics.enable(firedBullet, Phaser.Physics.ARCADE);
      if(this.scaleX){
        firedBullet.scale.setTo(this.scaleX, this.scaleY);
      }
      firedBullet.body.velocity.x = 200;
      firedBullet.outOfBoundsKill = true;
      if(this.color){
        firedBullet.tint = this.color;
      }
      previousBullet = firedBullet;
  }
}