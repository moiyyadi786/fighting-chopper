/*
groups.js serve contains functions to create group instance
Groups function accept parameter for new group creation
*/
var Groups = function(groupObj, groupName, spriteName, scaleX, scaleY, randomSpeed, velocity, headCount){
this.groupObj=groupObj;
this.groupName=groupName;
this.spriteName=spriteName;
this.scaleX=scaleX;
this.scaleY=scaleY;
this.randomSpeed=randomSpeed;
this.velocity=velocity;
this.headCount=headCount;
};
Groups.prototype.createGroups = function(){

    for(var i = 0 ; i < this.headCount; i++){
     var posX = 50 + (i * -200);
     var posY = Utility.randomGenerator(100, game.world.height-50);
     var group =   this.groupObj.create(game.world.width - posX, game.world.height - posY, this.groupName);
     group.anchor.setTo(0.5, 0.5);
     group.scale.setTo(this.scaleX, this.scaleY)
     //var flyHeli = heli.animations.add('walk');
     //flyHeli.play(10, true);
     game.physics.enable(group, Phaser.Physics.ARCADE);
     var speed = Math.floor((Math.random() * this.randomSpeed)) + this.velocity;
     if(this.randomSpeed > 0){
     if(speed < 250 ){
      speed = 250 + speed;
     } else if(speed > 1000) {
        speed = 700;
     }
     }
     group.body.velocity.x -= speed;

    }
    return this.groupObj;
}
Groups.prototype.createHurdles = function(){
    var posX = -50;
    var updesign = config.pipedesign[Utility.randomGenerator(0,4) - 1];
    var count = Utility.randomGenerator(0,6);
    var changeScale = 0;
    var scale = 1;
    var redPipe = Utility.randomGenerator(0,5);
    var pipeGroup = [];
    if(updesign == "increasing"){
         changeScale = Utility.randomGenerator(14,20)/100;
     } else if(updesign == "decreasing"){
     } else {
         scale =  Utility.randomGenerator(150,200)/100;
     }
     var sprites = this.spriteName.split("~");
     var pipeGap = 0;
     if(Utility.randomGenerator(0,13)/3 != 0){
        pipeGap = Utility.randomGenerator(10,30);
     }

     for(var i = 0; i < count; i++){
      posX -= 39 + pipeGap;
      scale += i * changeScale;
      pipeGroup[i] = this.groupObj.create(game.world.width - posX, 0, this.groupName, sprites[0]);
      pipeGroup[i].anchor.setTo(0.5, 0.5);
      pipeGroup[i].scale.setTo(1, scale * app.hurdleScale.y);
      game.physics.enable(pipeGroup[i], Phaser.Physics.ARCADE);
      pipeGroup[i].body.velocity.x -= 200;
      pipeGroup[i]["pipePosition"] = "up";

     }
     changeScale = 0;
     scale = 1;
     var downdesign = config.pipedesign[Utility.randomGenerator(0,4) - 1];
     count = Utility.randomGenerator(0,6);
     pipeGap = 0;
     if(Utility.randomGenerator(0,13)/2 == 0){
        pipeGap = Utility.randomGenerator(10,30);
     }
    if(updesign == "increasing"){
         changeScale = Utility.randomGenerator(14,20)/100;
     } else if(updesign == "decreasing"){
        scale = 1.75;
        changeScale = -Utility.randomGenerator(14,20)/100;
     } else {
         scale =  Utility.randomGenerator(150,200)/100;
     }
     posX = -50;
     for(var i = 0; i < count; i++){
      posX -= 38 + pipeGap;
      scale += i * changeScale;
      pipeGroup[i] =   this.groupObj.create(game.world.width - posX, game.world.height, this.groupName,sprites[1]);
      pipeGroup[i].anchor.setTo(0.5, 0.5);
      pipeGroup[i].scale.setTo(1, scale * app.hurdleScale.y);
      game.physics.enable(pipeGroup[i], Phaser.Physics.ARCADE);
      pipeGroup[i].body.velocity.x -= 200;
      pipeGroup[i]["pipePosition"] = "down";
     }
     if(pipeGroup[redPipe]){
         pipeGroup[redPipe].tint = 0xff0000;
         //alert( Math.abs((pipeGroup[redPipe].body.sourceHeight * app.hurdleScale.y * pipeGroup[redPipe].scale.y) - (pipeGroup[redPipe].body.sourceHeight * app.hurdleScale.y)));
         var y = (game.world.height - 18) - pipeGroup[redPipe].body.halfHeight;
         var x = pipeGroup[redPipe].body.position.x;
         var framesFire = [0,1,2,3];
         var frameToUse = "firedown00";
         if(pipeGroup[redPipe].pipePosition === "up"){
             y = pipeGroup[redPipe].body.halfHeight + 16;
             x += 5;
             frameToUse = "fireup00";
             framesFire = [4,5,6,7];
         }
        app.fire = new Sprite('fire', frameToUse , x, y, app.objectScale.x, app.objectScale.y, 200);
        app.fire = app.fire.createSprite();
        var fireFrames = app.fire.animations.add('burn',framesFire); // adding animation
        fireFrames.play(4, true);
        game.physics.arcade.enable(app.fire);
        game.world.bringToTop(app.pipes);

     }
}

var Sprite = function(spriteName, spriteImage, posX, posY, scaleX, scaleY, velocity){
    this.spriteName = spriteName;
    this.spriteImage = spriteImage;
    this.posX = posX;
    this.posY= posY;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    this.velocity= velocity;
}

Sprite.prototype.createSprite = function(){
   var sprite = game.add.sprite(this.posX,this.posY, this.spriteName, this.spriteImage);
   sprite.anchor.setTo(.5, .5);
   sprite.scale.setTo(this.scaleX, this.scaleY);
   game.physics.enable(sprite, Phaser.Physics.ARCADE);
   sprite.body.velocity.x = -200;
   return sprite;
}
