// // Where we will have our prefabs for the game

export class Platform extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, height, color) {
        // Call Phaser.GameObjects.Sprite constructor
        super(scene, x, y, width, height, color)
        // set color using setfillstyle
        this.setFillStyle(color)
        // Add to scene
        scene.add.existing(this)
        // Add to physics
        scene.physics.add.existing(this)
        // Set physics properties
        this.body.setImmovable(true)
        this.body.setAllowGravity(false)
        // Set physics properties
        this.body.setCollideWorldBounds(true)
        // Listen for window resize events
        window.addEventListener('resize', () => {
            this.onResize(scene.scale.width);
        });
    
    }
    onResize(gameWidth) {
        const canvasWidth = this.scene.cameras.main.width;
        const canvasHeight = this.scene.cameras.main.height;
        const scaleRatio = canvasWidth / gameWidth;

        this.setSize(canvasWidth, this.height);
        this.setPosition(canvasWidth / 2, canvasHeight - this.height / 2);
        this.setScale(scaleRatio);
    }
    update(delta){
    }
}

// Player prefab (for now which is a rectangle)
export class Player extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, height, color) {
      super(scene, x, y, width, height, color);
      scene.add.existing(this);
      scene.physics.world.enable(this);
      this.body.setCollideWorldBounds(true);
      this.body.gravity.y = 200;
      this.body.velocity.x = 0;
      this.body.velocity.y = 0;
      this.jumpVelocity = -300;
    }
  
    moveLeft() {
      this.body.velocity.x = -100;
    }
  
    moveRight() {
      this.body.velocity.x = 100;
    }
  
    jump() {
      if (this.body.onFloor()) {
        this.body.velocity.y = this.jumpVelocity;
      }
    }
  
    stop() {
      this.body.velocity.x = 0;
    }
  }
  
  

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
      const pointer = this.scene.input.activePointer;
  
      if (
        (this.cursors.left.isDown || this.leftTriangle.getBounds().contains(pointer.x, pointer.y)) &&
        (this.cursors.right.isDown || this.rightTriangle.getBounds().contains(pointer.x, pointer.y))
      ) {
        this.player.stop();
      } else if (this.cursors.left.isDown || this.leftTriangle.getBounds().contains(pointer.x, pointer.y)) {
        this.player.moveLeft();
      } else if (this.cursors.right.isDown || this.rightTriangle.getBounds().contains(pointer.x, pointer.y)) {
        this.player.moveRight();
      } else if (this.cursors.up.isDown || this.upTriangle.getBounds().contains(pointer.x, pointer.y)) {
        this.player.jump();
      } else {
        this.player.stop();
      }
    }
  }
  