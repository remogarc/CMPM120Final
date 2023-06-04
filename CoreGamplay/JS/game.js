// Our prefab.js file is a collection of classes that we can use to create game objects.
import { InputControls,Platform,PlayerChar,Trash/*,Captions*/ } from './prefabs.js';

// test comment
console.log('game.js loaded');

// -----------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------TO DO LIST--------------------------------------------------
// Mobile controls ?
// Add more levels / design levels
// resize method for each level for mobile
// ----------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------CODE BREAKDOWN------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------

// ConfigureScene - preload assets and create the trash objects which all level scenes will use
// Menu - create the menu scene
// Level1 - create the first level scene
// Level2 - create the second level scene
// Level3 - create the third level scene
// config - configure the game settings

// -----------------------------------------------------------------------------------------------------------------------
// Flow of the game
// MENU - > Cinematic -> Level1 -> Cinematic -> Level2 -> Cinematic -> Level3 -> Cinematic -> End/ Credits
// -----------------------------------------------------------------------------------------------------------------------

//  -----------------------------------------------------------------------------------------------------------------------
//  -------------------------------------------------- ConfigureScene -----------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
class ConfigureScene extends Phaser.Scene {
  constructor(scenekey){
    super(scenekey);
    // setting variables for our game to use and check
    this.trashGroup = null;
    this.touchedTrashCount = 0;
    this.trashCount = 0;
    this.nextLevel = 0;
  }
  preload(){
    // Load the font
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    // Player sprite
    this.load.spritesheet('player', 'Assets/player.png', { frameWidth: 250, frameHeight: 360, endFrame: 8 });
    this.load.image('standingFrame', 'Assets/idle1.png');
    // Trash sprite
    this.load.image('trash', 'Assets/trash.png');
    // Earth background
    this.load.image('earth', 'Assets/earth.png');
    // Mars background
    this.load.image('mars', 'Assets/mars.png');
    // Ice background
    this.load.image('ice', 'Assets/ice.png');
    // portal
    this.load.spritesheet('portal', 'Assets/portal.png', { frameWidth: 150, frameHeight: 175, endFrame: 30 });
  }
  create(){
    WebFont.load({
      google: {
        families: ['Rubik Puddles'],
      },
      active: () => {
        game.scene.start('Menu');
      },
    });

    // // Closed Captioning
    //   this.messageBox = this.add.text(this.game.config.width * 0.75 + (this.game.config.width * 0.01), this.game.config.height * 0.33)
    //   .setFontFamily('Impact')
    //   .setStyle({ fontSize: 200, color: '#fff' })
    //   .setWordWrapWidth(this.game.config.width * 0.25 - 2 * (this.game.config.width * 0.01));
  }
  // showMessage(message) {
  //           this.messageBox.setText(message);
  //           this.tweens.add({
  //               targets: this.messageBox,
  //               alpha: { from: 1, to: 0 },
  //               easing: 'Quintic.in',
  //               duration: 10
  //           });
  //       }
  // Create the trash objects
  createTrash(x,y,texture,group,width,height){
    const trash = new Trash(this, x, y,texture,width,height);
    trash.setDisplaySize(width,height);
    group.add(trash);
    // Enable physics for each trash object
    this.physics.world.enable(trash);
    trash.body.setAllowGravity(false); // Enable gravity for the trash object
    trash.body.setImmovable(true);
    trash.body.setCollideWorldBounds(true); // Prevent the trash object from moving outside the world bounds
  }
  trashTouched = (nova,trash) => {
    this.touchedTrashCount++;
    console.log('Trash picked up by Nova', this.touchedTrashCount);
    trash.destroy();
    // check if all trash is picked up
    if(this.touchedTrashCount === this.countTrash){
      this.allTrashTouched();
    }
  }
  allTrashTouched(){
    console.log('All trash touched');
  }
  goNext(nextlevel){
    // check if all trash has been picked up
    if(this.touchedTrashCount == this.trashCount){
      console.log('All trash picked up good work!');
      console.log('Going to next level', nextlevel);
      this.scene.start(nextlevel);
    } else {
      // if not all trash is picked up, tell the player to pick up all trash
      console.log('Not all trash picked up, please pick up all trash');
    }
  }
}

//  -------------------------------------------------------------------------------------------------------------
//  -------------------------------------------------- MENU -----------------------------------------------------
// --------------------------------------------------------------------------------------------------------------

class Menu extends Phaser.Scene {
    constructor() {
      super('Menu');
      // initialize Game Text
      this.gameText = null;
      // initialize Tap to start text
      this.startText = null;
      // initialize resize listener, isResizing and isPortrait
      this.resizeListener = null;
      this.isResizing = true;
      this.isPortrait = false;
    }
    create() {
      this.cameras.main.setBackgroundColor('#000f00');
      // Add resize event listener 
      window.addEventListener('resize',this.handleOrientationChange.bind(this));
      // center of the screen
      const centerX = this.cameras.main.width / 2;
      const centerY = this.cameras.main.height / 2;
      // font for menu text
      const fontProperties = {
        fontFamily: 'Rubik Puddles',
        align: 'center',
      };
      // game text
      this.gameText = this.add.text(centerX, centerY, 'Cosmic Cleanup', fontProperties);
      this.gameText.setOrigin(0.5,2);
      this.gameText.setColor('#ffffff');
      // start text
      this.startText = this.add.text(centerX, centerY, 'Tap to start', fontProperties);
      this.startText.setColor('#ffffff');
      this.startText.setOrigin(0.5);
      this.startText.setInteractive();
      // To start the game
      this.startText.on('pointerdown', () => {
        this.isResizing = false; // Stop resizing
        this.shutdown();
        this.scene.start('LevelOne');
      }, this);
      // Blinking start text
      this.tweens.add({
        targets: this.startText,
        alpha: 0,
        duration: 1000,
        ease: 'Power2',
        yoyo: true,
        repeat: -1,
      });
      // Orientation text to indicate player to rotate device on smaller screens when on portrait mode
      this.orientationText = this.add.text(centerX, centerY + 100, 'Please rotate your device', fontProperties);
      this.orientationText.setColor('#ffffff');
      this.orientationText.setOrigin(0.5,2);
      // Hide orientation text initially
      this.orientationText.visible = false;
      this.orientationText2 = this.add.text(centerX, centerY, 'Then refresh the page', fontProperties);
      this.orientationText2.setColor('#ffffff');
      this.orientationText2.setOrigin(0.5);
      // Hide orientation text initially
      this.orientationText2.visible = false;
      this.orientationText3 = this.add.text(centerX, centerY, 'Enjoy', fontProperties);
      this.orientationText3.setColor('#ffffff');
      this.orientationText3.setOrigin(0.5,-2);
      // Hide orientation text initially
      this.orientationText3.visible = false;
      // Check initial orientation
      this.checkOrientation();
      // check for resizng of the game and update text accordingly
      this.resizeListener = () => {
        this.updateTextOnResize();
      }; 
      this.scale.on('resize', this.resizeListener);
      // Initial resize call to set the correct font size, and check orientation
      this.updateTextOnResize();
    }
    handleOrientationChange(){
      setTimeout(() => {
        // check orientation
        this.checkOrientation();
      }, 100);
    }
    checkOrientation(){
      // check if device is in portrait mode/ orientation
      const isPortrait = window.innerHeight > window.innerWidth;
      if (isPortrait && !this.isPortrait) {
        // If in portrait mode, show orientation text and hide our game text
        this.orientationText.visible = true;
        this.orientationText2.visible = true;
        this.orientationText3.visible = true;
        this.gameText.visible = false;
        this.startText.visible = false;
        console.log('Please rotate your device');
      } else if (!isPortrait && this.isPortrait){
        // If in landscape mode, hide orientation text and show our game text
        this.orientationText.visible = false;
        this.orientationText2.visible = false;
        this.orientationText3.visible = false;
        this.gameText.visible = true;
        this.startText.visible = true;
        console.log('Landscape mode');
      }
      // update isPortrait flag
      this.isPortrait = isPortrait;
    }
    updateTextOnResize() {
      if (!this.isResizing) {
        return;
      }
      // Set font size based on the width of the game
      const fontSize = Math.round(this.scale.width * 0.07);
      this.gameText.setFontSize(fontSize);
      this.startText.setFontSize(fontSize);
      this.orientationText.setFontSize(fontSize);
      this.orientationText2.setFontSize(fontSize);
      this.orientationText3.setFontSize(fontSize);
      // Get rotated width and height of canvas
      const rotatedWidth = this.cameras.main.width;
      const rotatedHeight = this.cameras.main.height;
      const centerX = rotatedWidth / 2;
      const centerY = rotatedHeight / 2;
      // Rotate the canvas back to its original position
      this.cameras.main.setRotation(0);
      // Adjust orientation text position based on available height
      const orientationTextY = centerY;
      this.orientationText.setPosition(centerX, orientationTextY);
      // Rotate the canvas based on the device orientation
      const { screen } = window;
      const isLandscape = screen.orientation.angle === 90 || screen.orientation.angle === -90;
      const rotationAngle = isLandscape ? 90 : 0;
      this.cameras.main.setRotation(rotationAngle * Math.PI / 180);
      // Rotate the game and start text based on the device orientation
      this.gameText.setRotation(rotationAngle * Math.PI / -180);
      this.startText.setRotation(rotationAngle * Math.PI / -180);
    }
    shutdown() {
      this.scale.off('resize', this.resizeListener);
    }
  }

//  ------------------------------------------------------------------------------------------------------------
//  -------------------------------------------------- LevelOne -----------------------------------------------------
// ------------------------------------------------------------------------------------------------------------

class LevelOne extends ConfigureScene {
    constructor() {
        super('LevelOne');
    }
    create() {
        // The game width and height to set our assets to scale to the size of the game
        // IMPORTANT -----------------------------------------------------------------------------------------------
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
        // Create variables to track number of trash picked up
        console.log("Trash picked up by Nova ",this.touchedTrashCount);
        console.log("Trash needed to be picked up for this level",this.trashCount);
        // Create the background
        const background = this.add.sprite(0, 0, 'earth');
        background.setOrigin(0, 0);
        // Resize the background image to fit the width and height of the game
        const resizeBackground = () => {
          background.setScale(gameWidth/background.width, gameHeight/background.height);
        }
        window.addEventListener('resize', resizeBackground);
        resizeBackground();
        // Create the platform
        // (scene, x, y, width, height, color) - param to pass for platform
        // Three main platforms for the game 
        const platform = new Platform(this, gameWidth * 0.1,gameHeight * 0.9, gameWidth * 0.2, gameHeight * 0.2, 0x696969);
        const platform2 = new Platform(this,gameWidth * 0.5,gameHeight * 0.9, gameWidth * 0.2, gameHeight * 0.2, 0x696969);
        const platform3 = new Platform(this,gameWidth * 0.9,gameHeight * 0.9, gameWidth * 0.2, gameHeight * 0.5, 0x696969);
        // Stacked platform and one in air
        const platform4 = new Platform(this,gameWidth * 0.54,this.scale.height * 0.74, gameWidth * 0.12, this.scale.height * 0.16, 0x696969);
        const platform5 = new Platform(this,gameWidth * 0.3,this.scale.height * 0.5, gameWidth * 0.2, this.scale.height * 0.05, 0x696969);
        // Create variable track number of trash needed to be cleaned to go to next level
        this.trashCount = 3;
        // Create the trash group
        this.trashGroup = this.physics.add.group();
        const trash1 = this.createTrash(gameWidth * .46,gameHeight * .77,'trash',this.trashGroup,gameWidth *.04,gameHeight * .06);
        const trash2 = this.createTrash(gameWidth * .57,gameHeight * .62,'trash',this.trashGroup,gameWidth *.04,gameHeight * .1);
        const trash3 = this.createTrash(gameWidth * .22,gameHeight * .44,'trash',this.trashGroup,gameWidth *.05,gameHeight * .1);
        // Create the portal
        this.portal = this.add.sprite(gameWidth * .98, gameHeight * 0.6, 'portal');
        this.anims.create({
            key: 'portal',
            frames: this.anims.generateFrameNumbers('portal', { start: 0, end: 29 }),
            frameRate: 12,
            repeat: -1
        });
        // play the portal animation and set physics
        this.portal.anims.play('portal', true);
        this.physics.world.enable(this.portal);
        this.physics.add.existing(this.portal);
        this.portal.body.setSize(gameWidth * .05, gameHeight * 0.15);
        this.portal.setDisplaySize(gameWidth * .05, gameHeight * 0.2);
        this.portal.body.setAllowGravity(false);
        this.portal.body.setImmovable(true);
        // Create the player
        this.nova = new PlayerChar(this, gameWidth * 0.06, gameHeight * .63, 'player', 0)
        // Set up physics for the player
        this.physics.world.enable(this.nova); // Enable physics for the player sprite
        this.nova.body.setBounce(0); // Set bounce to 0 to prevent bouncing off the platform
        this.nova.body.setFriction(1); // Adjust friction as needed for smooth movement
        // collision detection for player
        this.physics.add.collider(this.nova,platform);
        this.physics.add.collider(this.nova,platform2);
        this.physics.add.collider(this.nova,platform3);
        this.physics.add.collider(this.nova,platform4);
        this.physics.add.collider(this.nova,platform5);
        // collision detection for portal
        this.physics.add.collider(this.nova, this.portal, this.goNext.bind(this, 'LevelTwo'), null, this);
        // collision detection for trash
        this.physics.add.collider(this.nova,this.trashGroup,this.trashTouched);
        // Create the input controls
        this.inputControls = new InputControls(this, this.nova);
        // this.showMessage('Jump');
    }
    update() {
      // update input controls and player movement if they are out of bounds
        this.inputControls.update();
        if (this.nova.x < 0 ||this.nova.y > this.scale.height || this.nova.x > this.scale.width) {
          // Reset touching trash
          this.touchedTrashCount = 0;
          console.log("Trash picked up by Nova ",this.touchedTrashCount);
          // Restart the scene.
          this.scene.restart();
        } 
    }
    
}
// ------------------------------------------------------------------------------------------------------------
// -------------------------------------------------- LevelTwo -----------------------------------------------------
// ------------------------------------------------------------------------------------------------------------

class LevelTwo extends ConfigureScene {
  constructor() {
    super('LevelTwo');
  }
  create(){
    // Background image
    this.add.image(0, 0, 'mars').setOrigin(0, 0);
    this.add.text(100, 100, 'Test Level 2');
    const next = this.add.text(100, 200, 'Next Level ->');
    next.setInteractive();
    next.on('pointerdown', () => {
      this.scene.start('LevelThree');
    });
  }
  update(){}
}

// ------------------------------------------------------------------------------------------------------------
// -------------------------------------------------- LevelThree -----------------------------------------------------
// ------------------------------------------------------------------------------------------------------------

class LevelThree extends Phaser.Scene {
  constructor() {
    super('LevelThree');
  }
  create(){
    // Background image
    this.add.image(0, 0, 'ice').setOrigin(0, 0);
    this.add.text(100, 100, 'Test Level 3');
  }
  update(){}
}

// ------------------------------------------------------------------------------------------------------------
// -------------------------------------------------- GameConfig -----------------------------------------------------
// ------------------------------------------------------------------------------------------------------------
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
  input: {
    keyboard: true,
    touch: true,
  },
  scene: [ConfigureScene,Menu,LevelOne,LevelTwo,LevelThree],
};

const game = new Phaser.Game(config);

// ------------------------------------------------------------------------------------------------------------
// handle orientation change
// ------------------------------------------------------------------------------------------------------------

window.addEventListener('orientationchange', function () {
  game.scale.refresh();
});