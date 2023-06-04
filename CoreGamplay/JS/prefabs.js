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

        //  Get the width and height of the game object. to scale the sprite size and hitbox as well as physics
        this.scene.width = this.scene.scale.width;
        this.scene.height = this.scene.scale.height;

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

        // Define the ratio or fixed values for hitbox and sprite sizes
        const hitboxWidthRatio = 0.12;
        const hitboxHeightRatio = 0.35;
        const spriteWidthRatio = 0.05;
        const spriteHeightRatio = 0.1;


        // // change hitbox size
        // this.body.setSize(this.scene.width * .12, this.scene.height *.3);
        // // change display size sprite
        // this.setDisplaySize(this.scene.width *.05, this.scene.height *.1);


        this.body.setSize(this.scene.width * hitboxWidthRatio, this.scene.height * hitboxHeightRatio);
        this.setDisplaySize(this.scene.width * spriteWidthRatio, this.scene.height * spriteHeightRatio);

    }
    moveLeft() {
        const velocityX = -200 * (this.scene.width *.001);
        this.body.velocity.x = velocityX;
        this.setDirection('left');
        this.playAnimation();
        this.setFlipX(false); // Flip the sprite to face left
    }
    moveRight() {
        this.body.velocity.x = 200 *  (this.scene.width *.001);
        this.setDirection('right');
        this.playAnimation();
        this.setFlipX(true); // Flip the sprite to face right
    }
    jump() {
        // const initialJumpVelocity = -80;
        // const heightRatio = 0.1; // Adjust this value to match your character's height ratio
        // const characterHeight = this.displayHeight;
        // const scaleFactor = characterHeight / (this.scene.height * heightRatio);

        // // Adjust the jump velocity for smaller screen sizes
        // if (this.scene.height < 900) {
        //     const smallerDeviceJumpAdjustment = 0.7; // Adjust this value to control the jump height on smaller devices
        //     this.jumpVelocity = initialJumpVelocity * scaleFactor * smallerDeviceJumpAdjustment;
        // } else {
        //     this.jumpVelocity = initialJumpVelocity * scaleFactor;
        // }

        // if (this.jumpVelocity < -200) {
        //     this.jumpVelocity = -200; // Limit the maximum jump velocity if desired
        // }
        // const jumpVelocity = initialJumpVelocity * scaleFactor;
        // this.body.velocity.y = this.jumpVelocity;


        // if (this.body.onFloor()) {
        //     const initialJumpVelocity = -200; // Adjust the initial velocity as needed
        //     const heightRatio = 0.1; // Adjust this value to match your character's height ratio
        //     const characterHeight = this.displayHeight;
        //     const scaleFactor = characterHeight / (this.scene.height * heightRatio);
        
        //     const jumpVelocity = initialJumpVelocity * scaleFactor;
        //     this.body.velocity.y = jumpVelocity;
        //   }

        if (this.body.onFloor()) {
            if (this.scene.height < 900){
                this.body.velocity.y = -80 * (this.scene.height * .006);
            } else {
                this.body.velocity.y = -80 * (this.scene.height * .004);
            }
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
        this.body.setCollideWorldBounds(false);
        //properites for gravity and velocity
        this.body.gravity.y = 200;
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
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
        // Enable physics for the platform
        scene.physics.world.enable(this);
        // Set physics properties
        this.body.setImmovable(true);
        this.body.setAllowGravity(false);
        this.body.setCollideWorldBounds(false);
    }
  }

// Trash prefab
// PhaserGameObjects.Sprite is the base class for all game objects
export class Trash extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture,width,height) {
        super(scene, x, y, texture,width,height);
        // assigning texture
        this.setTexture(texture);
        // Add this game object to the owner scene.
        scene.add.existing(this);
    }
}

// export class Captions extends Phaser.scene {
//     constructor(scene) {
//         super(scene);
//     }
//     create() {
//         // Closed Captioning
//         this.messageBox = this.add.text(this.game.config.width * 0.75 + (this.game.config.width * 0.01), this.game.config.height * 0.33)
//         .setFontFamily('Impact')
//         .setStyle({ fontSize: 200, color: '#fff' })
//         .setWordWrapWidth(this.game.config.width * 0.25 - 2 * (this.game.config.width * 0.01));
//     }
//     showMessage(message) {
//         this.messageBox.setText(message);
//         this.tweens.add({
//             targets: this.messageBox,
//             alpha: { from: 1, to: 0 },
//             easing: 'Quintic.in',
//             duration: 10
//         });
//     }
// }



  
  