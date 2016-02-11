var config = {
  cityWorld: {
    backgroundImage: "assets/sprite/nyc.png", 
    enemy: {
      name: "heli",
      img: "assets/sprite/heli.gif",
      x: 75,
      y: 30,
      frames: [0,1,2],
      framesRate: 10
    },
    enemy2: {
      name: "dragon",
      img: "assets/sprite/dragon.png",
      x: 116,
      y: 98,
      frames:[0,1,2,3],
      framesRate: 7
    },
    pipes: {
      name: "pipes",
      img: "assets/sprite/pipe.png",
      jsonFrame: "assets/sprite/pipe_frames.json",
    },
    savior: {
      name: "honeybee",
      img: "assets/sprite/honey-bee.png",
      jsonFrame: "assets/sprite/honey-bee-frames.json", 
      spriteName: "honeyFly01",
      scaleX: .25,
      scaleY: .25
    }
  },
  desertWorld: {
    backgroundImage: "assets/sprite/desert.jpg",
    enemy: {
      name: "dragon",
      img: "assets/sprite/dragon.png",
      x: 116,
      y: 98,
      frames:[0,1,2,3],
      framesRate: 7
    }
  },
  gems: {
    name: "gems",
    img: "assets/sprite/gems.png",
    jsonFrame: "assets/sprite/gems_frames.json",
  },
  
    bullets: {
    name: "bullets",
    img: "assets/sprite/bullets.png",
    jsonFrame: "assets/sprite/bullets_frames.json",
  },
  ground: {
    name: "groud",
    img: "assets/sprite/platform.png"
  },
  buttonUp: {
    name: "button",
    img: "assets/sprite/button-up.png"
  },
  chopper: {
    name: "chopper",
    img: "assets/sprite/helicopter.png",
    jsonFrame: "assets/sprite/chopper_frames.json"
  },
  dragonRider: {
    name: "chopper",
    img: "assets/sprite/dragonrider.png",
    jsonFrame: "assets/sprite/dragon_rider.json"   
  },
  gun: {
      name: "gun",
      img: "assets/sprite/gun.gif"
  },
  fire: {
      name: "fire",
      img: "assets/sprite/fire.png",
      jsonFrame: "assets/sprite/fire-frames.json"
  },
  pipedesign: ["uniform", "increasing", "decreasing"],
  occurance: {
    pipe: Utility.randomGenerator(200, 300),
    enemies: Utility.randomGenerator(200, 300),
    enemies2: Utility.randomGenerator(600, 800),
    savior: Utility.randomGenerator(500, 800),
    gems: Utility.randomGenerator(400, 500),
    gun: Utility.randomGenerator(500, 800)
  }
  }