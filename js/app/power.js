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