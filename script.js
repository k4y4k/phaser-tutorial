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

var score = 0;
var scoreText;

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

  // now let's add something to do: collect stars. Instead of adding them
  // one-by-one, we can instead have Phaser create a group and iterate over it.

  // notice how it's group() here instead of staticGroup() - we can't have the
  // stars stuck in place.
  stars = this.physics.add.group({
    // set the texture to 'star' (defined above)
    key: "star",
    // repeat the star × 11 = 12 stars total
    repeat: 11,
    // first star at (12,0), next star at (82, 0), next at (152, 0) and so on
    setXY: { x: 12, y: 0, stepX: 70 },
  });

  // now let's go and muck with the individual stars themselves:
  stars.children.iterate(function (star) {
    // set the bounce of the individual star somewhere between 0.4 - 0.8
    // (1 being ⚠️ FULL BOUNCE ⚠️)
    star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  // but we can't have the stars ignore the ground. Let's add collision:
  this.physics.add.collider(stars, platforms);

  // and allow collection of stars:
  this.physics.add.overlap(
    // if objects from the `player` and `stars` collision group collide,
    player,
    stars,
    // invoke collectStar()
    collectStar,
    // uh???
    null,
    // I assume this has something to do with context 🤷
    this
  );

  // display score!
  scoreText = this.add.text(
    // add the text at (16,16)
    16,
    16,
    // with the default text being 'score: 0'
    "score: 0",
    {
      // Phaser uses Courier by default for text, and, like, whatever, I don't
      // feel like getting a Roboto link off Google Fonts lmao
      fontSize: "32px",
      fill: "#000",
    }
  );
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

function collectStar(player, star) {
  // make star invisible and have no physics
  star.disableBody(true, true);

  // add 10 points for each star collected
  score += 10;
  scoreText.setText(`Score: ${score}`);
}
