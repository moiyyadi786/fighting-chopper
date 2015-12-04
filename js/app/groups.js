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
     var posY = Utility.randomGenerator(100, app.game.world.height-50);
     var group =   this.groupObj.create(app.game.world.width - posX, app.game.world.height - posY, this.groupName);
     group.anchor.setTo(0.5, 0.5); 
     group.scale.setTo(this.scaleX, this.scaleY)
     //var flyHeli = heli.animations.add('walk');
     //flyHeli.play(10, true);
     app.game.physics.enable(group, Phaser.Physics.ARCADE);
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
    if(updesign == "increasing"){
         changeScale = Utility.randomGenerator(14,20)/100;
     } else if(updesign == "decreasing"){
        scale = 1.75;
        changeScale = -Utility.randomGenerator(14,20)/100;
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
      var group =   this.groupObj.create(app.game.world.width - posX, 0, this.groupName, sprites[0]);
      group.anchor.setTo(0.5, 0.5); 
      group.scale.setTo(1, scale);
      app.game.physics.enable(group, Phaser.Physics.ARCADE);
      group.body.velocity.x -= 200;
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
      var group =   this.groupObj.create(app.game.world.width - posX, app.game.world.height, this.groupName,sprites[1]);
      group.anchor.setTo(0.5, 0.5); 
      group.scale.setTo(1, scale);
      app.game.physics.enable(group, Phaser.Physics.ARCADE);
      group.body.velocity.x -= 200;
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
   var sprite = app.game.add.sprite(app.game.world.width-this.posX, app.game.world.height-this.posY, this.spriteName, this.spriteImage);
   sprite.anchor.setTo(.5, .5);
   sprite.scale.setTo(.25,.25);
   app.game.physics.enable(sprite, Phaser.Physics.ARCADE);
   sprite.body.velocity.x = -200;
   return sprite;
}
