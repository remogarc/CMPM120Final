
import { InputControls,Platform,PlayerChar } from './prefabs.js';

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
        this.platform = null;
        this.player = null;
    }
    preload(){

    }
    create() {
        // Reset input state
        // this.input.keyboard.resetKeys();
        // this.input.mouse.releasePointerLock();


        this.cameras.main.setBackgroundColor('#808080');

        // Create the platform
        const platform = new Platform(this, 600, this.scale.height - 100, 200, 20, '#000000');
        
        const platform2 = new Platform(this, 200, this.scale.height - 200, 200, 20, '#000000');

        const platform3 = new Platform(this, 600, this.scale.height - 350, 200, 20, '#000000');

        const platform4 = new Platform(this, 600, this.scale.height - 600, 200, 20, '#000000');
     
        const platform5 = new Platform(this, 200, this.scale.height - 450, 200, 20, '#000000');

        const portal = this.add.rectangle(600, 250, 100, 200,);
        portal.setStrokeStyle(4, 0x000f00);
        portal.setFillStyle(0x000f00); //

        // physics
        this.physics.world.enable(portal);
        this.physics.add.existing(portal);
        portal.body.setAllowGravity(false);
        portal.body.setImmovable(true);
        
        
        this.character = this.add.sprite(100, 100, 'player');
        this.character.setScale(0.5);
        this.anims.create({
            key: 'player',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 7 }),
            frameRate: 12,
            repeat: -1
        })
        this.character.anims.play('player', true);

        const nova = new PlayerChar(this, 10, this.scale.height -100, 'player', 0)
        nova.setScale(0.5);
        // nova.setOrigin(0.5, 1);

        const standStill = this.add.image(100, 100, 'standingFrame', 0);

        // Set up physics for the player
        this.physics.world.enable(nova); // Enable physics for the player sprite
        nova.body.setBounce(0); // Set bounce to 0 to prevent bouncing off the platform
        nova.body.setFriction(1); // Adjust friction as needed for smooth movement


        // collision detection
        this.physics.add.collider(nova,platform);
        this.physics.add.collider(nova,platform2);
        this.physics.add.collider(nova,platform3);
        this.physics.add.collider(nova,platform4);
        this.physics.add.collider(nova,platform5);
     
        this.physics.add.collider(nova,portal,this.goNext,null,this);
        this.inputControls = new InputControls(this, nova);


    }
    update() {
        this.inputControls.update();
    }
    goNext(){
        this.scene.start('Testlevel2');
    }
}

//  ------------------------------------------------------------------------------------------------------------
//  ------------------------------------------------------------------------------------------------------------
class Testlevel2 extends Phaser.Scene {
  constructor() {
    super('Testlevel2');
  }
  create(){
    this.add.text(100, 100, 'Test Level 2');
  }
  update(){}
}




// Load the font in the main game scene's preload method
class MainGame extends Phaser.Scene {
  constructor() {
    super('MainGame');
  }
  preload() {
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    this.load.spritesheet('player', 'Assets/player.png', { frameWidth: 250, frameHeight: 360, endFrame: 8 });
    this.load.image('standingFrame', 'Assets/idle1.png');

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
        debug: true, // false
      },
    },
    input: {
      keyboard: true,
      touch: true,
    },
    scene: [Menu,TestLevel,Testlevel2],
  };

const game = new Phaser.Game(config);
// Add main game to our scenes true is to acitvate the scene which sets our font and starts the game
game.scene.add('MainGame', MainGame, true);
