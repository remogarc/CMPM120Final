// Where we will have our prefabs for the game


// Base platform for now
export class Platform extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, height, color, platform) {
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
        // this.body.setCollideWorldBounds(true)

        this.platform = platform;

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
// export class Player extends Phaser.GameObjects.Rectangle {
//     constructor(scene, x, y, width, height, color) {
//         // Call Phaser.GameObjects.Sprite constructor
//         super(scene, x, y, width, height, color)

//         // Add to scene
//         scene.add.existing(this)
//         // Add to physics
//         scene.physics.add.existing(this)
//         // Enable physics for the player
//         scene.physics.world.enable(this);

//         // Set physics properties
//         this.body.setCollideWorldBounds(true)
//         this.body.gravity.y = 200;
//         this.body.velocity.x = 0; // initial X velocity

//     }
// }

// Player prefab (for now which is a rectangle)
export class Player extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, height, color) {
        // Call Phaser.Physics.Arcade.Sprite constructor
        super(scene, x, y, width, height, color);

        
        // Add to scene
        scene.add.existing(this);
        // Enable physics for the player
        scene.physics.world.enable(this);
        // Set physics properties
        this.body.setCollideWorldBounds(true);
        this.body.gravity.y = 200; // Adjust the gravity value as needed
        this.body.velocity.x = 0; // Initial x velocity
        this.jumpVelocity = -300; // Adjust the jump velocity as needed
    }

    moveLeft() {
        this.body.velocity.x = -100; // Adjust the horizontal movement speed as needed
    }

    moveRight() {
        this.body.velocity.x = 100; // Adjust the horizontal movement speed as needed
    }

    jump() {
        // Apply vertical velocity to the player only if they are touching the ground
        if (this.body.onFloor()) {
            this.body.velocity.y = this.jumpVelocity;
        }
    }

    stop() {
        this.body.velocity.x = 0;
    }
}





// Touch Controls prefab
export class TouchControls {
    constructor(scene, player,platform) {
        // Add to scene
        this.scene = scene;
        // Add player
        this.player = player;

        // Add platform
        this.platform = platform;

        // Initialize player's velocity
        this.player.body.setVelocity(0, 0);
        // Get the height of the game canvas
        const { width,height } = scene.scale;

        /// Create the up triangle
        this.upTriangle = this.scene.add.triangle(100, height - 100, 0, 0, -20, 40, 20, 40, 0xff0000);
        this.upTriangle.setOrigin(0.5, 0.5);
        this.upTriangle.setInteractive();
        // Create the left triangle
        this.leftTriangle = this.scene.add.triangle(50, height -30, -20, 0, 20, -20, 20, 18, 0x00ff00);
        this.leftTriangle.setOrigin(0.5, 0.5);
        this.leftTriangle.setInteractive();
        // Create the right triangle
        this.rightTriangle = this.scene.add.triangle(150, height -30, -20, -20, -20, 20, 20, 0, 0x0000ff);
        this.rightTriangle.setOrigin(0.5, 0.5);
        this.rightTriangle.setInteractive();
        // Set up touch event handlers
        // Up triangle
        this.upTriangle.on('pointerdown', this.handUpTriangleDown, this);
        this.upTriangle.on('pointerup', this.handUpTriangleUp, this);
        // Left triangle
        this.leftTriangle.on('pointerdown', this.handLeftTriangleDown, this);
        this.leftTriangle.on('pointerup', this.handLeftTriangleUp, this);
        // Right triangle
        this.rightTriangle.on('pointerdown', this.handRightTriangleDown, this);
        this.rightTriangle.on('pointerup', this.handRightTriangleUp, this);
        
    }
    handUpTriangleDown() {
        console.log("up triangle pressed");
        this.player.jump();
    }
    
    handUpTriangleUp() {
        console.log("up triangle released");
    }
    
    handLeftTriangleDown() {
        console.log("left triangle pressed");
        this.player.moveLeft();
    }
    
    handLeftTriangleUp() {
        console.log("left triangle released");
        this.player.stop();
    }
    
    handRightTriangleDown() {
        console.log("right triangle pressed");
        this.player.moveRight();
    }
    
    handRightTriangleUp() {
        console.log("right triangle released");
        this.player.stop();
    }
    update(delta) {
        // console.log("update touch controls");
        
    }
    
}


