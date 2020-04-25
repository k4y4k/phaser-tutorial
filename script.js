var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("ground", "assets/platform.png");
  this.load.image("star", "assets/star.png");
  this.load.image("bomb", "assets/bomb.png");
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
}

var platforms;

function create() {
  this.add.image(400, 300, "sky");

  // There exist two types of physics bodies in 'arcade' physics: ones that can
  // move and ones that can't. Guess which of those members of a staticGroup
  // happen to be.
  platforms = this.physics.add.staticGroup();

  // use image called "ground", put its origin at 400×568, scale it ×2 and
  // finalise it
  platforms.create(400, 568, "ground").setScale(2).refreshBody();

  // create other platforms. They're not the ground, so they don't need to be
  // scaled :o)
  platforms.create(600, 400, "ground");
  platforms.create(50, 250, "ground");
  platforms.create(750, 220, "ground");
}

function update() {}
