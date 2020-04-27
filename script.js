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

  // Let's make a player!!!
  // First, let's show the sprite. self explanatory, filename "dude", 100×450px
  // from the bottom of the game.
  player = this.physics.add.sprite(100, 450, "dude");

  // bounce of 0.2 = landing after a jump will cause a slight bounce
  player.setBounce(0.2);

  // can't run off screen :)
  player.setCollideWorldBounds(true);

  // create running left animation called "left" (frames from filename "dude",
  // runs @ 10fps, repeats forever)
  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  // use frame 4 (0-indexed) to "turn", facing the camera as we do so
  this.anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20,
  });

  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  // add collision between the player and the platforms: without it, the player
  // just falls through the 'ground', to the bottom of the screen
  this.physics.add.collider(player, platforms);

  // use arrow keys for movement:
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  // check to see if any of the arrow keys are held down, and then DO THINGS if
  // they are
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play("right", true);
  } else {
    player.setVelocityX(0);
    player.anims.play("turn");
  }

  // jumping: test if up arrow is held AND if the player is touching the floor
  // (no mid-air) double jumping 😉
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}
