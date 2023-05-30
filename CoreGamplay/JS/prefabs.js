// Where we will have our prefabs for the game

// Player prefab (for now which is a rectangle)
export class Player extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, height, color) {
        // Call Phaser.GameObjects.Sprite constructor
        super(scene, x, y, width, height, color)
        // Add to scene
        scene.add.existing(this)
        // Add to physics
        scene.physics.add.existing(this)
        // Set physics properties
        this.body.setCollideWorldBounds(true)
    }

    update(delta) {
        // Handle keyboard input
        if (this.cursors.left.isDown) {
            this.velocity.x = -200;
        } else if (this.cursors.right.isDown) {
            this.velocity.x = 200;
        } else {
            this.velocity.x = 0;
        }
    
        // Move the player based on its velocity
        this.x += this.velocity.x * delta;
        this.y += this.velocity.y * delta;
    }

}



// Touch Controls prefab
export class TouchControls {
    constructor(scene) {
        // Add to scene
        this.scene = scene;

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


    }
}


