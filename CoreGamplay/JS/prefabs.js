// // Where we will have our prefabs for the game

console.log("prefabs.js loaded");

// InputControls prefab
export class InputControls {
    constructor(scene, player) {
      this.scene = scene;
      this.player = player;
      this.cursors = scene.input.keyboard.createCursorKeys();
  
      const { width, height } = scene.scale;
  
      this.upTriangle = this.scene.add.triangle(100, height - 100, 0, 0, -20, 40, 20, 40, 0xff0000);
      this.upTriangle.setOrigin(0.5, 0.5);
      this.upTriangle.setInteractive();
  
      this.leftTriangle = this.scene.add.triangle(50, height - 30, -20, 0, 20, -20, 20, 18, 0x00ff00);
      this.leftTriangle.setOrigin(0.5, 0.5);
      this.leftTriangle.setInteractive();
  
      this.rightTriangle = this.scene.add.triangle(150, height - 30, -20, -20, -20, 20, 20, 0, 0x0000ff);
      this.rightTriangle.setOrigin(0.5, 0.5);
      this.rightTriangle.setInteractive();
    }
  
    update() {
        // detecting point or tap on the screen
        const pointer = this.scene.input.activePointer;

        // if the left and right keys are pressed or the left and right triangles are pressed
        if (
            (this.cursors.left.isDown || this.leftTriangle.getBounds().contains(pointer.x, pointer.y)) &&
            (this.cursors.right.isDown || this.rightTriangle.getBounds().contains(pointer.x, pointer.y))
        ) {
            this.player.stop();
        // if the left key is pressed or the left triangle is pressed
        } else if (this.cursors.left.isDown || this.leftTriangle.getBounds().contains(pointer.x, pointer.y)) {
            this.player.moveLeft();
        // if the right key is pressed or the right triangle is pressed
        } else if (this.cursors.right.isDown || this.rightTriangle.getBounds().contains(pointer.x, pointer.y)) {
            this.player.moveRight();
        // if the up key is pressed or the up triangle is pressed
        } else if (this.cursors.up.isDown || this.upTriangle.getBounds().contains(pointer.x, pointer.y)) {
            this.player.jump();
        } else {
            this.player.stop();
        }
    }
  }

// Player character sprite prefab 
export class PlayerChar extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene,x,y,texture,frame);
        // Add this game object to the owner scene
        this.scene = scene;
        //  Add this game object to the owner scene.
        this.scene.add.existing(this);
        // Enable physics for this game object
        this.enablePhysics();
        // create running animations
        this.anims.create({
            key: texture,
            frames: this.anims.generateFrameNumbers(texture, { start: 0, end: 7}),
            frameRate: 12,
            repeat: -1
        });
        // Set initial direction of player facing right
        this.direction = 'right';
        this.setFlipX(true);
        // change hitbox size
        this.body.setSize(220, 320);
    }
    moveLeft() {
        this.body.velocity.x = -200;
        this.setDirection('left');
        this.playAnimation();
        this.setFlipX(false); // Flip the sprite to face left
    }
    moveRight() {
        this.body.velocity.x = 200;
        this.setDirection('right');
        this.playAnimation();
        this.setFlipX(true); // Flip the sprite to face right
    }
    jump() {
        if (this.body.onFloor()) {
            this.body.velocity.y = this.jumpVelocity;
        }
    }
    stop() {
        // stop the player from moving and stop the animation
        this.body.velocity.x = 0;
        this.stopAnimation();
        // set frame to 0 so player is not stuck in a running animation
        this.setTexture('standingFrame');
         // Set the standing still frame
        if (this.direction === 'left') {
            this.setFlipX(true); // Flip the sprite to face left
        } else {
            this.setFlipX(false); // Flip the sprite to face right
        }
    }
    update(){
        //  check if is not moving we want to stop that animation
        if (this.body.velocity.x === 0) {
            this.stop();
        }
    }
    setDirection(direction) {
        if (this.direction !== direction) {
          this.direction = direction;
          if (direction === 'left') {
            this.setFlipX(false);
          } else {
            this.setFlipX(true);
          }
        }
    }
    playAnimation() {
        // check if is not playing we want to play that animation
        if (!this.isPlayingAnimation) {
          this.isPlayingAnimation = true;
          this.anims.play('player');
        }
    }
    stopAnimation() {
        // check if is playing we want to stop that animation
        if (this.isPlayingAnimation) {
            this.anims.stop();
            this.isPlayingAnimation = false;
        }
    }
    enablePhysics() {
        //  Enable physics for this game object.
        this.scene.physics.world.enable(this);
        // Set physics properties
        this.body.setCollideWorldBounds(true);
        this.body.gravity.y = 200;
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.jumpVelocity = -250;
    }
     
}

// Platform prefab
export class Platform extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, height, color) {
        super(scene, x, y, width, height);
        // Settting the color of the platform
        this.setFillStyle(color);
        // Add this game object to the owner scene.
        scene.add.existing(this);
        scene.physics.add.existing(this);
        // Set physics properties
        this.body.setImmovable(true);
        this.body.setAllowGravity(false);
        this.body.setCollideWorldBounds(true);
    }
  }
  
  