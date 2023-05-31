import { Player,CursorControls,TouchControls,Platform } from './prefabs.js';

console.log('js loaded');


class Menu extends Phaser.Scene {
    constructor() {
      super('Menu');
      this.gameText = null;
      this.startText = null;
      this.resizeListener = null;
      this.isResizing = true;
    }
  
    updateTextOnResize() {
      if (!this.isResizing) {
        return;
      }
  
      const fontSize = Math.round(this.scale.width * 0.09);
  
      this.gameText.setFontSize(fontSize);
      this.startText.setFontSize(fontSize);
  
      const centerX = this.scale.width / 2;
      const centerY = this.scale.height / 2;
  
      this.gameText.setPosition(centerX, centerY - 100);
      this.startText.setPosition(centerX, centerY);
    }
  
    shutdown() {
      console.log('shutdown');
      this.scale.off('resize', this.resizeListener);
      console.log(this.resizeListener);
      console.log('shutdown has been called');
    }
  
    create() {
      this.cameras.main.setBackgroundColor('#000f00');
  
      const centerX = this.cameras.main.width / 2;
      const centerY = this.cameras.main.height / 2;
  
      const fontProperties = {
        fontFamily: 'Rubik Puddles',
        align: 'center',
      };
  
      this.gameText = this.add.text(centerX, centerY - 100, 'Cosmic Cleanup', fontProperties);
      this.gameText.setOrigin(0.5);
      this.gameText.setColor('#ffffff');
  
      this.startText = this.add.text(centerX, centerY, 'Tap to start', fontProperties);
      this.startText.setColor('#ffffff');
      this.startText.setOrigin(0.5);
  
      this.startText.setInteractive();
  
      this.startText.on('pointerdown', () => {
        this.isResizing = false; // Stop resizing
        this.shutdown();
        this.scene.start('TestLevel');
      }, this);
  
      this.tweens.add({
        targets: this.startText,
        alpha: 0,
        duration: 1000,
        ease: 'Power2',
        yoyo: true,
        repeat: -1,
      });
  
      this.resizeListener = () => {
        this.updateTextOnResize();
      };
  
      this.scale.on('resize', this.resizeListener);
  
      // Initial resize call to set the correct font size
      this.updateTextOnResize();
    }
  
    update() {}
  
  }
  
//  ------------------------------------------------------------------------------------------------------------
//  ------------------------------------------------------------------------------------------------------------

class TestLevel extends Phaser.Scene {
    constructor() {
        super('TestLevel');
        // this.touchControls = null;
    }
    preload(){

    }
    create() {
        this.cameras.main.setBackgroundColor('#808080');

        // Canvas width and height  
        const canvasWidth = this.cameras.main.width;
        const canvasHeight = this.cameras.main.height;

        // Create and add the platform to the scene
        const platformWidth = canvasWidth;
        const platformHeight = 30;
        const platformX = canvasWidth / 2;
        const platformY = canvasHeight - platformHeight / 2;
        const platformColor = 0xff0000;

        this.platform = new Platform(this, platformX, platformY, platformWidth, platformHeight, platformColor);

        // Create and add the player to the scene
        const playerX = platformX;
        const playerY = platformY - platformHeight / 2 - 25; // Adjust the height based on the player's size
        const playerWidth = 50;
        const playerHeight = 50;
        const playerColor = 0x00ff00;

        this.player = new Player(this, playerX, playerY, playerWidth, playerHeight, playerColor);

        // collision detection between player and platform
        this.physics.add.collider(this.player, this.platform);
        // Touch Controls
        this.touchControls = new TouchControls(this, this.player);

    }
    update(time, delta) {
      // // Update the cursor controls
      // this.cursorControls.update(delta);
      // Update the touch controls
      this.touchControls.update(delta);
    }
}




// Load the font in the main game scene's preload method
class MainGame extends Phaser.Scene {
  constructor() {
    super('MainGame');
  }
  preload() {
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
  }
  create() {
    WebFont.load({
      google: {
        families: ['Rubik Puddles'],
      },
      active: () => {
        game.scene.start('Menu');
      },
    });
  }
}

const config = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.RESIZE,
      width: '100%',
      height: '100%',
      parent: 'game-container',
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 10 },
        debug: true,
      },
    },
    scene: [Menu,TestLevel],
  };

const game = new Phaser.Game(config);
// Add main game to our scenes true is to acitvate the scene which sets our font and starts the game
game.scene.add('MainGame', MainGame, true);
