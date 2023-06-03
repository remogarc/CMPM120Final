// Our prefab.js file is a collection of classes that we can use to create game objects.
import { InputControls,Platform,PlayerChar,Trash } from './prefabs.js';

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
  }
  // Create the trash objects
  createTrash(x,y,texture,group){
    const trash = new Trash(this, x, y,texture);
    trash.setScale(2);
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
      // Add orientationchange event listener 
      // lets try resize
      window.addEventListener('resize',this.handleOrientationChange.bind(this));
     
      const centerX = this.cameras.main.width / 2;
      const centerY = this.cameras.main.height / 2;
  
      const fontProperties = {
        fontFamily: 'Rubik Puddles',
        align: 'center',
      };
  
      this.gameText = this.add.text(centerX, centerY, 'Cosmic Cleanup', fontProperties);
      this.gameText.setOrigin(0.5,2);
      this.gameText.setColor('#ffffff');

      this.startText = this.add.text(centerX, centerY, 'Tap to start', fontProperties);
      this.startText.setColor('#ffffff');
      this.startText.setOrigin(0.5);
  
      this.startText.setInteractive();
  
      this.startText.on('pointerdown', () => {
        this.isResizing = false; // Stop resizing
        this.shutdown();
        this.scene.start('LevelOne');
      }, this);

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
      this.orientationText.setOrigin(0.5);

      // Hide orientation text initially
      this.orientationText.visible = false;
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
        this.gameText.visible = false;
        this.startText.visible = false;
        console.log('Please rotate your device');
      } else if (!isPortrait && this.isPortrait){
        // If in landscape mode, hide orientation text and show our game text
        this.orientationText.visible = false;
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
        // Create variables to track number of trash picked up
        console.log("Trash picked up by Nova ",this.touchedTrashCount);

        // Create variable track number of trash needed to be cleaned to go to next level
        this.trashCount = 3;
        console.log("Trash needed to be picked up for this level",this.trashCount);

        // setting our background image
        const earthBack = this.add.image(0, 0, 'earth').setOrigin(0, 0);

        // Create the platform
        const platform = new Platform(this, 600, this.scale.height - 100, 200, 20, 0xffffff);
        const platform2 = new Platform(this, 200, this.scale.height - 200, 200, 20, 0x00f000);
        const platform3 = new Platform(this, 600, this.scale.height - 350, 200, 20, 0xf00000);
        const platform4 = new Platform(this, 600, this.scale.height - 600, 200, 20, 0x00000f);
        const platform5 = new Platform(this, 200, this.scale.height - 450, 200, 20, 0x00f000);
       
        // Create the trash group
        this.trashGroup = this.physics.add.group();
        const trash1 = this.createTrash(600,600,'trash',this.trashGroup);
        const trash2 = this.createTrash(600,400,'trash',this.trashGroup);
        const trash3 = this.createTrash(600,200,'trash',this.trashGroup);
        

  
        // Create the portal
        this.portal = this.add.sprite(200, 200, 'portal');
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
        this.portal.body.setSize(70,120);
        this.portal.body.setAllowGravity(false);
        this.portal.body.setImmovable(true);

      


        // Create the player
        const nova = new PlayerChar(this, 10, this.scale.height -100, 'player', 0)
        nova.setScale(0.5);
        // Set up physics for the player
        this.physics.world.enable(nova); // Enable physics for the player sprite
        nova.body.setBounce(0); // Set bounce to 0 to prevent bouncing off the platform
        nova.body.setFriction(1); // Adjust friction as needed for smooth movement

        // collision detection for player
        this.physics.add.collider(nova,platform);
        this.physics.add.collider(nova,platform2);
        this.physics.add.collider(nova,platform3);
        this.physics.add.collider(nova,platform4);
        this.physics.add.collider(nova,platform5);

        // collision detection for portal
        this.physics.add.collider(nova, this.portal, this.goNext.bind(this, 'LevelTwo'), null, this);
        // collision detection for trash
        this.physics.add.collider(nova,this.trashGroup,this.trashTouched);


        // Create the input controls
        this.inputControls = new InputControls(this, nova);
    }
    update() {
        this.inputControls.update();
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