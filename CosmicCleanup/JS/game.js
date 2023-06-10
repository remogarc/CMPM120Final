// Our prefab.js file is a collection of classes that we can use to create game objects.
import { InputControls,Platform,PlayerChar,Trash} from 'https://remogarc.github.io/CMPM120Final/CoreGamplay/JS/prefabs.js';
// test comment
console.log('game.js loaded');

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
   
  }
  preload(){
    // Load the font
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    // Player sprite
    this.load.spritesheet('player', '../CoreGamplay/Assets/player.png', { frameWidth: 250, frameHeight: 360, endFrame: 8 });
    this.load.image('standingFrame', '../CoreGamplay/Assets/idle1.png');
    // Trash sprite
    this.load.image('trash', '../CoreGamplay/Assets/trash.png');
    // Earth background
    this.load.image('earth', '../CoreGamplay/Assets/earth.png');
    // Mars background
    this.load.image('mars', '../CoreGamplay/Assets/mars.png');
    // Ice background
    this.load.image('ice', '../CoreGamplay/Assets/ice.png');
    // portal
    this.load.spritesheet('portal', '../CoreGamplay/Assets/portal.png', { frameWidth: 150, frameHeight: 175, endFrame: 30 });
    // Sound when the player picks up trash
    this.load.audio('trashPickup','../CoreGamplay/Assets/trash_picked.mp3');
    //Sound pngs
    this.load.image('song', '../CoreGamplay/Assets/sound.png');
    this.load.image('check', '../CoreGamplay/Assets/mute.png');
    // Background music for each of the levels
    this.load.audio('level1Music','../CoreGamplay/Assets/music1.mp3');
    this.load.audio('level2Music','../CoreGamplay/Assets/music2.mp3');
    this.load.audio('level3Music','../CoreGamplay/Assets/music3.mp3');
    // JSON file for game data 
    this.load.json('gameData','../CoreGamplay/JS/GameData.json');
    // star background
    this.load.video('star', '../Cinematics/Assets/spacewallp.mp4');
    // Intro cinematic video
    this.load.video('intro', '../Cinematics/Assets/intro.mp4');
    // Intro cinematic video audio
    this.load.video('introSound', '../Cinematics/Assets/introNew.mp4');
    // Add our button
    this.load.image('button','../CoreGamplay/Assets/button.png');
    // transition for planets
    this.load.video('earthPlanet', '../Cinematics/Assets/earth.mp4');
    this.load.video('marsPlanet', '../Cinematics/Assets/mars.mp4');
    this.load.video('icePlanet', '../Cinematics/Assets/ice.mp4');
    // end cinematic
    this.load.video('end','../Cinematics/Assets/ending.mp4');
  }
  create(){
    WebFont.load({
      google: {
        families: ['Rubik Puddles'],
      },
      active: () => {
        game.scene.start('Menu',{mutevalue: false});
      },
    });
  }
 
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
    // play trash pickup sound also making it little louder
    console.log('Trash touched by Nova');
    const trashPickupSound = this.sound.add('trashPickup');
    trashPickupSound.volume = 2;
    console.log(this.mutevalue);
    if(this.mutevalue == false){
      trashPickupSound.play();
    }
    // particles 
    const emitter = this.add.particles(0,0,'trash',{
      speed: 24,
      lifespan: 1500,
      quantity: 10,
      scale: { start: 0.3, end: 0 },
      emitting: false,
      emitZone: { type: 'edge', source: trash.getBounds(), quantity: 42 },
      duration: 500
    })

    emitter.start(2000);
    // increment the trash count
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
  goNext(nextlevel,mutevalue){
    // check if all trash has been picked up
    // console.log(mutevalue)
    if(this.touchedTrashCount === this.trashCount){
      console.log('All trash picked up good work!');
      console.log('Going to next level', nextlevel);
      // check if musicis playing
      // if(this.music != null && this.music.isPlaying && this.music){
      //   // stop the music for level
      //   this.music.stop();
      // }

      // if (this.music !=null){
      //   this.music.stop();
      // }
      if (this.music && this.music.isPlaying){
        this.music.stop();
      }
      this.portal.destroy();
      //  stop background music of current level
      // this.sound.stopAll();
      // go to the next level
      // { mutevalue: this.mutevalue }
      this.scene.start(nextlevel,{mutevalue: this.mutevalue});
    } else {
      // if not all trash is picked up, tell the player to pick up all trash
      console.log('Not all trash picked up, please pick up all trash');
    }
  }
}

//  -------------------------------------------------------------------------------------------------------------
//  -------------------------------------------------- MENU -----------------------------------------------------
// --------------------------------------------------------------------------------------------------------------

class Menu extends ConfigureScene {
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
    init(data){
      this.mutevalue = data.mutevalue;
      this.previousScene = data.previousScene;
    }
   
    create() {
    

      console.log(this.mutevalue);
        // gameSize
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
        // this.mutevalue = false;
        // background music
        const backgroundMusic = this.sound.add('level1Music');
        backgroundMusic.setLoop(true);
        // backgroundMusic.play();
        if(this.mutevalue == false){
            backgroundMusic.play();
        }
        // add sound when button is clicked
        const sound = this.sound.add('trashPickup')

        // this.music = this.sound.add('level2Music');
        // this.music.setLoop(true);
        // this.music.play();


        // set the background
        const video = this.add.video(0, 0, 'star');
        video.setOrigin(0.5);
        video.setLoop(true);
        video.play(true);
        const scaleX = gameWidth / video.width;
        const scaleY = gameHeight / video.height;
        const scale = Math.min(scaleX, scaleY);
        video.setPosition(gameWidth / 2, gameHeight / 2);
        // access the game data json file
        this.gameData = this.cache.json.get('gameData');
        console.log('Game Data', this.gameData);
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
        // game text with json data file
        this.gameText = this.add.text(centerX, centerY, this.gameData.GameTitle, fontProperties);
        this.gameText.setOrigin(0.5,2);
        this.gameText.setColor('#ffffff');
        // start text
        this.startText = this.add.text(centerX, centerY, 'Tap to start', fontProperties);
        this.startText.setColor('#ffffff');
        this.startText.setOrigin(0.5);
        this.startText.setInteractive();
          // To start the game
        this.startText.on('pointerdown', () => {
            // const synth = new Tone.Synth().toDestination();
            // synth.triggerAttackRelease("G5", "8n");
            // if (Tone.context.state !== "running") {
            //     Tone.start();
            // }
            backgroundMusic.stop();
            if(this.mutevalue == false){
                sound.play();
            }
            this.isResizing = false; // Stop resizing
            this.shutdown();
            this.scene.start('IntroCinematic', { mutevalue: this.mutevalue });
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
       
        // settings text
        this.settingsText = this.add.text(centerX,centerY, '⚙️', fontProperties)
        this.settingsText.setColor('#ffffff');
        this.settingsText.setOrigin(5, 2.25);
        this.settingsText.setInteractive();
        this.settingsText.on('pointerdown', () => {
            backgroundMusic.stop();
            if(this.mutevalue == false){
                sound.play();
            }
            this.scene.start('Settings', { mutevalue: this.mutevalue, previousScene: this.scene.key });

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
        this.settingsText.visible = false;
        console.log('Please rotate your device');
      } else if (!isPortrait && this.isPortrait){
        // If in landscape mode, hide orientation text and show our game text
        this.orientationText.visible = false;
        this.orientationText2.visible = false;
        this.orientationText3.visible = false;
        this.gameText.visible = true;
        this.startText.visible = true;
        this.settingsText.visible = true;
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
      this.settingsText.setFontSize(fontSize);
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
    this.settingsText.setRotation(rotationAngle * Math.PI / -180);
    }
    shutdown() {
      this.scale.off('resize', this.resizeListener);
    }
  }


class IntroCinematic extends ConfigureScene {
    constructor() {
        super('IntroCinematic');
    }
    init(data){
      this.mutevalue = data.mutevalue;
      this.previousScene = data.previousScene;
    }
  
    create(){

          const sound = this.sound.add('trashPickup')
          // font for menu text
          const fontProperties = {
            fontFamily: 'Rubik Puddles',
            align: 'center',
        };
         // gameSize
         const gameWidth = this.scale.width;
         const gameHeight = this.scale.height;
         //video that acts like music for background
         const videoSound = this.add.video(0, 0, 'introSound')
         videoSound.setVisible(false);
         if(this.mutevalue == false){
          videoSound.play(true);
        }

        //  set the background
         const video = this.add.video(0, 0, 'intro');
         video.setOrigin(0.5);
         video.setLoop(true);
         video.play(true);
         const scaleX = gameWidth / video.width;
         const scaleY = gameHeight / video.height;
         const scale = Math.min(scaleX, scaleY);
         video.setPosition(gameWidth / 2, gameHeight / 2);
         video.setLoop(false);


          // Add skip button
        const skipButton = this.add.text(gameWidth * 0.9, gameHeight * 0.9, 'Skip', fontProperties).setInteractive();
        skipButton.setFontSize(gameWidth * 0.05);
        skipButton.setOrigin(1);
        skipButton.on('pointerdown', () => {
          if(this.mutevalue == false){
            sound.play();
          }
            this.skipIntro();
        });

        // Function to skip the intro and start the first level
        this.skipIntro = () => {
          videoSound.stop();
          video.destroy(); // Destroy the video
          //this.time.delayedCall(1000, () => {
            //this.cameras.main.fade(1000, 0,0,0);
            this.scene.start('LevelOne', {mutevalue: this.mutevalue});
          //}, [], this);
        };
        
       

        // add an event listener to the video when it is done playing and add go to the next scene button 
        video.on('complete', () => {
            videoSound.stop();

            // set the background
            const video = this.add.video(0, 0, 'earthPlanet');
            video.setOrigin(0.5);
            video.setLoop(true);
            video.play(true);
            

            const scaleX = gameWidth / video.width;
            const scaleY = gameHeight / video.height;
            const scale = Math.min(scaleX, scaleY);
            video.setPosition(gameWidth / 2, gameHeight / 2);

            const button = this.add.sprite(gameWidth * .9, gameHeight *.8, 'button')
            .setInteractive()
            .setScale(.25)
            .setAlpha(0);
            // Create a fade-in tween for the button
            this.tweens.add({
                targets: button,
                alpha: 1,
                scaleX: .5,
                scaleY: .5,
                duration:1000,
                ease: 'Power1',
                yoyo: true,
                repeat: -1
            });

            button.on('pointerdown', () => {
              this.time.delayedCall(1000, () => {
                this.cameras.main.fade(1000, 0,0,0);
                this.scene.start('LevelOne', {mutevalue: this.mutevalue});
              }, [], this);
            });
        });
    }
}

//  ------------------------------------------------------------------------------------------------------------
//  -------------------------------------------------- CinematicTwo -----------------------------------------------------
// ------------------------------------------------------------------------------------------------------------

class CinematicTwo extends ConfigureScene {
  constructor() {
      super('CinematicTwo');
  }
  init(data){
    this.mutevalue = data.mutevalue;
    this.previousScene = data.previousScene;
  }

  create(){
        const sound = this.sound.add('trashPickup')
        // font for menu text
        const fontProperties = {
          fontFamily: 'Rubik Puddles',
          align: 'center',
      };
       // gameSize
       const gameWidth = this.scale.width;
       const gameHeight = this.scale.height;
       //video that acts like music for background
      //  const videoSound = this.add.video(0, 0, 'introSound')
      //  videoSound.setVisible(false);
      //  if(this.mutevalue == false){
      //   videoSound.play(true);
      // }

      //  set the background
       const video = this.add.video(0, 0, 'marsPlanet');
       video.setOrigin(0.5);
       video.setLoop(true);
       video.play(true);
       const scaleX = gameWidth / video.width;
       const scaleY = gameHeight / video.height;
       const scale = Math.min(scaleX, scaleY);
       video.setPosition(gameWidth / 2, gameHeight / 2);
       video.setLoop(false);

       this.time.delayedCall(5000, () => {
          const button = this.add.sprite(gameWidth * .9, gameHeight *.8, 'button')
          .setInteractive()
          .setScale(.25)
          .setAlpha(0);
          // Create a fade-in tween for the button
          this.tweens.add({
              targets: button,
              alpha: 1,
              scaleX: .5,
              scaleY: .5,
              duration:1000,
              ease: 'Power1',
              yoyo: true,
              repeat: -1
          });
      
        button.on('pointerdown', () => {
          this.time.delayedCall(1000, () => {
            this.cameras.main.fade(1000, 0,0,0);
            this.scene.start('LevelTwo', {mutevalue: this.mutevalue});
          }, [], this);
        });
      });
  }
}

//  ------------------------------------------------------------------------------------------------------------
//  -------------------------------------------------- CinematicThree -----------------------------------------------------
// ------------------------------------------------------------------------------------------------------------

class CinematicThree extends ConfigureScene {
  constructor() {
      super('CinematicThree');
  }
  init(data){
    this.mutevalue = data.mutevalue;
    this.previousScene = data.previousScene;
  }

  create(){
        const sound = this.sound.add('trashPickup')
        // font for menu text
        const fontProperties = {
          fontFamily: 'Rubik Puddles',
          align: 'center',
      };
       // gameSize
       const gameWidth = this.scale.width;
       const gameHeight = this.scale.height;

      //  set the background
       const video = this.add.video(0, 0, 'icePlanet');
       video.setOrigin(0.5);
       video.setLoop(true);
       video.play(true);
       const scaleX = gameWidth / video.width;
       const scaleY = gameHeight / video.height;
       const scale = Math.min(scaleX, scaleY);
       video.setPosition(gameWidth / 2, gameHeight / 2);
       video.setLoop(false);

       this.time.delayedCall(5000, () => {
          const button = this.add.sprite(gameWidth * .9, gameHeight *.8, 'button')
          .setInteractive()
          .setScale(.25)
          .setAlpha(0);
          // Create a fade-in tween for the button
          this.tweens.add({
              targets: button,
              alpha: 1,
              scaleX: .5,
              scaleY: .5,
              duration:1000,
              ease: 'Power1',
              yoyo: true,
              repeat: -1
          });
    
        button.on('pointerdown', () => {
          this.time.delayedCall(1000, () => {
            this.cameras.main.fade(1000, 0,0,0);
            this.scene.start('LevelThree', {mutevalue: this.mutevalue});
          }, [], this);
        });
      });
  }
}

//  ------------------------------------------------------------------------------------------------------------
//  -------------------------------------------------- LevelOne -----------------------------------------------------
// ------------------------------------------------------------------------------------------------------------

class LevelOne extends ConfigureScene {
    constructor() {
        super('LevelOne');
    }
    init(data){
      this.mutevalue = data.mutevalue;
      this.previousScene = data.previousScene;
    }
    
    create() {
      this.cameras.main.fadeIn(1000, 0, 0, 0);
      // feedback sound
      const sound = this.sound.add('trashPickup');
      const fontProperties = {
        fontFamily: 'Rubik Puddles',
        align: 'center',
    };
      console.log(this.mutevalue);
        this.music = this.sound.add('level1Music');
        this.music.setLoop(true);
        if(this.mutevalue == false){
            this.music.play();
        }
        // The game width and height to set our assets to scale to the size of the game
        // IMPORTANT -----------------------------------------------------------------------------------------------
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;

       
        
        // Create the background
        const background = this.add.sprite(0, 0, 'earth');
        background.setOrigin(0, 0);
        // Resize the background image to fit the width and height of the game
        const resizeBackground = () => {
          background.setScale(gameWidth/background.width, gameHeight/background.height);
        }
        window.addEventListener('resize', resizeBackground);
        resizeBackground();

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        
        //  settings
        const settingsText = this.add.text(centerX,centerY, '⚙️');
        settingsText.setOrigin(7,4.5);
        settingsText.setFontSize(gameWidth * .05);
        settingsText.setInteractive();
        settingsText.on('pointerdown', () => {
          // stop music
          if(this.mutevalue == false){
            sound.play();
          }
          this.music.stop();
            this.scene.start('Settings', { mutevalue: this.mutevalue, previousScene: this.scene.key });
        });

        // this.add.text(50, 50, 'Cosmic Cleanup', { fontSize: 70 } )
        // Create the platform
        // (scene, x, y, width, height, color) - param to pass for platform
        // Three main platforms for the game 
        const platform = new Platform(this, gameWidth * 0.1,gameHeight * 0.9, gameWidth * 0.2, gameHeight * 0.2, 0x696969);
        const platform2 = new Platform(this,gameWidth * 0.5,gameHeight * 0.9, gameWidth * 0.2, gameHeight * 0.2, 0x696969);
        const platform3 = new Platform(this,gameWidth * 0.9,gameHeight * 0.9, gameWidth * 0.2, gameHeight * 0.5, 0x696969);
        // Stacked platform and one in air
        const platform4 = new Platform(this,gameWidth * 0.54,this.scale.height * 0.74, gameWidth * 0.12, this.scale.height * 0.16, 0x696969);
        const platform5 = new Platform(this,gameWidth * 0.3,this.scale.height * 0.55, gameWidth * 0.2, this.scale.height * 0.05, 0x696969);
        // Create variable track number of trash needed to be cleaned to go to next level
        this.trashCount = 3;
        // Create variables to track number of trash picked up
        console.log("Trash picked up by Nova ",this.touchedTrashCount);
        console.log("Trash needed to be picked up for this level",this.trashCount);
        // Create the trash group
        this.trashGroup = this.physics.add.group();
        const trash1 = this.createTrash(gameWidth * .46,gameHeight * .77,'trash',this.trashGroup,gameWidth *.04,gameHeight * .06);
        const trash2 = this.createTrash(gameWidth * .57,gameHeight * .62,'trash',this.trashGroup,gameWidth *.04,gameHeight * .1);
        const trash3 = this.createTrash(gameWidth * .25,gameHeight * .48,'trash',this.trashGroup,gameWidth *.05,gameHeight * .1);
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
        this.nova = new PlayerChar(this, gameWidth * 0.1, gameHeight * .75, 'player', 0)
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
        // this,
        //add transition to Cinematic Two
        //this.physics.add.collider(this.nova, this.portal,this.goNext.bind(this,'CinematicTwo'), null, this);
        
        this.physics.add.collider(this.nova, this.portal, () => {
          // Play the tone
          const synth = new Tone.Synth().toDestination();
          synth.triggerAttackRelease("G5", "8n");
          if (Tone.context.state !== "running") {
            Tone.start();
          }
        
          // Call the goNext function to switch to the next scene
          this.goNext('CinematicTwo');
        }, null, this);
        
        
        // collision detection for trash
        this.physics.add.collider(this.nova,this.trashGroup,this.trashTouched);
        // Create the input controls
        this.inputControls = new InputControls(this, this.nova);
        // this.showMessage('Jump');
    }
    update() {
      // update input controls and player movement if they are out of bounds
        this.inputControls.update();
        if (this.nova.x < 0 ||this.nova.y > this.scale.height || this.nova.x > this.scale.width || this.nova.y < 0) {
          this.music.stop();
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
  init(data){
    this.mutevalue = data.mutevalue;
    this.previousScene = data.previousScene;
  }

  create(){
    this.cameras.main.fadeIn(1000, 0, 0, 0);
      this.music = this.sound.add('level2Music');
      this.music.setLoop(true);
      // backgroundMusic.play();
      console.log(this.mutevalue);

      if(this.mutevalue == false){
          this.music.play();
      }
        
      // this.music.play();
      // The game width and height to set our assets to scale to the size of the game
      // IMPORTANT -----------------------------------------------------------------------------------------------
      const gameWidth = this.scale.width;
      const gameHeight = this.scale.height;

     

      // Create the background
      const background = this.add.sprite(0, 0, 'mars');
      background.setOrigin(0, 0);
      // Resize the background image to fit the width and height of the game
      const resizeBackground = () => {
        background.setScale(gameWidth/background.width, gameHeight/background.height);
      }
      window.addEventListener('resize', resizeBackground);
      resizeBackground();

      // center of the screen
      const centerX = this.cameras.main.width / 2;
      const centerY = this.cameras.main.height / 2;

      // feedback sound
      const sound = this.sound.add('trashPickup');
      const fontProperties = {
        fontFamily: 'Rubik Puddles',
        align: 'center',
    };

     //  settings
     const settingsText = this.add.text(centerX, centerY, '⚙️');
     settingsText.setOrigin(7,4.5);

     settingsText.setFontSize(gameWidth * .05);
     settingsText.setInteractive();
     settingsText.on('pointerdown', () => {
       // stop music
       if(this.mutevalue == false){
         sound.play();
       }
       this.music.stop();
         this.scene.start('Settings', { mutevalue: this.mutevalue, previousScene: this.scene.key });
     });




      // add platforms
      const platform = new Platform(this,gameWidth * .05,gameHeight * .75, gameWidth * 0.1, gameHeight * 0.53, 0xD2B48C);
      const platform2 = new Platform(this,gameWidth * .2,gameHeight * .85, gameWidth * 0.2, gameHeight * 0.33, 0xD2B48C);
      const platform3 = new Platform(this,gameWidth * .4,gameHeight * .4, gameWidth * 0.2, gameHeight * 0.05, 0xD2B48C);
      const platform4 = new Platform(this,gameWidth * .6,gameHeight * .9, gameWidth * 0.2, gameHeight * 0.3, 0xD2B48C);
      const platform5 = new Platform(this,gameWidth * .9,gameHeight * .2, gameWidth * 0.2, gameHeight * 0.05, 0xD2B48C);
      const platform6 = new Platform(this,gameWidth * .7,gameHeight * .5, gameWidth * 0.15, gameHeight * 0.05, 0xD2B48C);
      platform6.body.setImmovable(true);

      // Set platform's initial position and movement range
      const startY = platform6.y;
      const endY = platform6.y - 50; // Adjust this value to control the movement range

      // Move platform
      this.tweens.add({
        targets: platform6,
        y: { from: startY, to: endY, duration: 1000, ease: 'Linear' },
        repeat: -1,
        yoyo: true
      });

      const platform7 = new Platform(this,gameWidth * .9,gameHeight * .9, gameWidth * 0.1, gameHeight * 0.05, 0xD2B48C);


      // add player
      this.nova = new PlayerChar(this, gameWidth * 0.05, gameHeight * .43, 'player', 0)

      // add trash
      // Create variable track number of trash needed to be cleaned to go to next level
      this.trashCount = 3;
       // Create variables to track number of trash picked up
       console.log("Trash picked up by Nova ",this.touchedTrashCount);
       console.log("Trash needed to be picked up for this level",this.trashCount);
      // Create the trash group
      this.trashGroup = this.physics.add.group();
      const trash1 = this.createTrash(gameWidth * .9,gameHeight * .85,'trash',this.trashGroup,gameWidth *.04,gameHeight * .06);
      const trash2 = this.createTrash(gameWidth * .15,gameHeight * .64,'trash',this.trashGroup,gameWidth *.04,gameHeight * .1);
      const trash3 = this.createTrash(gameWidth * .45,gameHeight * .34,'trash',this.trashGroup,gameWidth *.05,gameHeight * .1);
      // Create the portal
      this.portal = this.add.sprite(gameWidth * .98, gameHeight * 0.12, 'portal');
      this.anims.create({
          key: 'portal',
          frames: this.anims.generateFrameNumbers('portal', { start: 0, end: 29 }),
          frameRate: 12,
          repeat: -1
      });


         // Check if the 'portal' animation already exists
    if (!this.anims.exists('portal')) {
      // Create the 'portal' animation
      this.anims.create({
        key: 'portal',
        frames: this.anims.generateFrameNumbers('portal', { start: 0, end: 29 }),
        frameRate: 12,
        repeat: -1
      });
    }

      // play the portal animation and set physics
      this.portal.anims.play('portal', true);
      this.physics.world.enable(this.portal);
      this.physics.add.existing(this.portal);
      this.portal.body.setSize(gameWidth * .05, gameHeight * 0.15);
      this.portal.setDisplaySize(gameWidth * .05, gameHeight * 0.2);
      this.portal.body.setAllowGravity(false);
      this.portal.body.setImmovable(true);
      // Create the player
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
      //this.physics.add.collider(this.nova, this.portal, this.goNext.bind(this, 'CinematicThree'), null, this);
      
      this.physics.add.collider(this.nova, this.portal, () => {
        // Play the tone
        const synth = new Tone.Synth().toDestination();
        synth.triggerAttackRelease("G5", "8n");
        if (Tone.context.state !== "running") {
          Tone.start();
        }
      
        // Call the goNext function to switch to the next scene
        this.goNext('CinematicThree');
      }, null, this);
      
      
      
      
      // collision detection for trash
      this.physics.add.collider(this.nova,this.trashGroup,this.trashTouched);

      // physics
      this.physics.add.collider(this.nova,platform);
      this.physics.add.collider(this.nova,platform2);
      this.physics.add.collider(this.nova,platform3);
      this.physics.add.collider(this.nova,platform4);
      this.physics.add.collider(this.nova,platform5);
      this.physics.add.collider(this.nova,platform6);
      this.physics.add.collider(this.nova,platform7);

    

      this.inputControls = new InputControls(this, this.nova);

  }
  update(){
    this.inputControls.update();
    // restart the scene if the player is out of bounds
    if (this.nova.x < 0 ||this.nova.y > this.scale.height || this.nova.x > this.scale.width) {
      this.music.stop();
      // Reset touching trash
      this.touchedTrashCount = 0;
      console.log("Trash picked up by Nova ",this.touchedTrashCount);
      // Restart the scene.
      this.scene.restart();
    }


  }
}

// ------------------------------------------------------------------------------------------------------------
// -------------------------------------------------- LevelThree -----------------------------------------------------
// ------------------------------------------------------------------------------------------------------------

class LevelThree extends ConfigureScene {
  constructor() {
    super('LevelThree');
  }
  init(data){
    this.mutevalue = data.mutevalue;
  }
 
  
  create(){
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    // Music
    this.music = this.sound.add('level3Music');
    this.music.setLoop(true);
    // this.music.play();
    if (this.mutevalue == false){
      this.music.play();
    }

    // The game width and height to set our assets to scale to the size of the game
    // IMPORTANT -----------------------------------------------------------------------------------------------
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;

    // Create the background
    const background = this.add.sprite(0, 0, 'ice');
    background.setOrigin(0, 0);
    // Resize the background image to fit the width and height of the game
    const resizeBackground = () => {
      background.setScale(gameWidth/background.width, gameHeight/background.height);
    }
    window.addEventListener('resize', resizeBackground);
    resizeBackground();

    
      // center of the screen
      const centerX = this.cameras.main.width / 2;
      const centerY = this.cameras.main.height / 2;

      // feedback sound
      const sound = this.sound.add('trashPickup');
      const fontProperties = {
        fontFamily: 'Rubik Puddles',
        align: 'center',
    };

     //  settings
     const settingsText = this.add.text(centerX,centerY, '⚙️', fontProperties);
     settingsText.setOrigin(7,4.5);
     settingsText.setFontSize(gameWidth * .05);
     settingsText.setInteractive();
     settingsText.on('pointerdown', () => {
       // stop music
       if(this.mutevalue == false){
         sound.play();
       }
       this.music.stop();
         this.scene.start('Settings', { mutevalue: this.mutevalue, previousScene: this.scene.key });
     });


    
    // Create the platforms
    const platform = new Platform(this,gameWidth * .1,gameHeight * .96, gameWidth * 0.2, gameHeight * 0.13, 0x8AC1FA);
    const platform2 = new Platform(this,gameWidth * .52,gameHeight * .95, gameWidth * 0.25, gameHeight * 0.12, 0x8AC1FA);
    const platform3 = new Platform(this,gameWidth * .5,gameHeight * .69, gameWidth * 0.025, gameHeight * 0.4, 0x8AC1FA);
    const platform4 = new Platform(this,gameWidth * .415,gameHeight * .5, gameWidth * 0.19, gameHeight * 0.025, 0x8AC1FA);
    const platform5 = new Platform(this,gameWidth * .05,gameHeight * .5, gameWidth * 0.1, gameHeight * 0.025, 0x8AC1FA);
    const platform6 = new Platform(this,gameWidth * .22,gameHeight * .7, gameWidth * 0.2, gameHeight *.025, 0x8AC1FA);
    const platform7 = new Platform(this,gameWidth * .57,gameHeight * .62, gameWidth * 0.15, gameHeight *.025, 0x8AC1FA);
    const platform8 = new Platform(this,gameWidth * .9,gameHeight * .9, gameWidth * 0.2, gameHeight *.2, 0x8AC1FA);
    const platform9 = new Platform(this,gameWidth * .9,gameHeight * .2, gameWidth * 0.2, gameHeight *.025, 0x8AC1FA);
    const platform10 = new Platform(this,gameWidth * .7,gameHeight * .3, gameWidth * 0.2, gameHeight * 0.025, 0x8AC1FA);
    platform10.body.setSize(gameWidth * 0.2, gameHeight * 0.025, true);
    // Set platform's initial position and movement range
    const startY = platform10.y;
    const endY = platform10.y + 100; // Adjust this value to control the movement range

    // Move platform
    this.tweens.add({
      targets: platform10,
      y: { from: startY -100 , to: endY, duration: 1200, ease: 'Linear' },
      repeat: -1,
      yoyo: true
    });


   
    // Create the player
    this.nova = new PlayerChar(this, gameWidth * 0.1, gameHeight * .84, 'player', 0)
    // Set up physics for the player
    this.physics.world.enable(this.nova); // Enable physics for the player sprite
    this.nova.body.setBounce(0); // Set bounce to 0 to prevent bouncing off the platform
    this.nova.body.setFriction(1); // Adjust friction as needed for smooth movement
    // Create the trash
    // Create variable track number of trash needed to be cleaned to go to next level
    this.trashCount = 3;
     // Create variables to track number of trash picked up
     console.log("Trash picked up by Nova ",this.touchedTrashCount);
     console.log("Trash needed to be picked up for this level",this.trashCount);
    // Create the trash group
    this.trashGroup = this.physics.add.group();
    const trash1 = this.createTrash(gameWidth * .54,gameHeight * .86,'trash',this.trashGroup,gameWidth *.04,gameHeight * .06);
    const trash2 = this.createTrash(gameWidth * .45,gameHeight * .84,'trash',this.trashGroup,gameWidth *.04,gameHeight * .1);
    const trash3 = this.createTrash(gameWidth * .95,gameHeight * .14,'trash',this.trashGroup,gameWidth *.05,gameHeight * .1);


     

    // Create the portal
    this.portal = this.add.sprite(gameWidth * .95, gameHeight * 0.73, 'portal');
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
 
    // physics stuff
    this.physics.add.collider(this.nova,platform);
    this.physics.add.collider(this.nova,platform2);
    this.physics.add.collider(this.nova,platform3);
    this.physics.add.collider(this.nova,platform4);
    this.physics.add.collider(this.nova,platform5);
    this.physics.add.collider(this.nova,platform6);
    this.physics.add.collider(this.nova,platform7);
    this.physics.add.collider(this.nova,platform8);
    this.physics.add.collider(this.nova,platform9);
    this.physics.add.collider(this.nova,platform10);

    // collision detection for portal
    //this.physics.add.collider(this.nova, this.portal, this.goNext.bind(this, 'Outro'), null, this);


    this.physics.add.collider(this.nova, this.portal, () => {
      // Play the tone
      const synth = new Tone.Synth().toDestination();
      synth.triggerAttackRelease("G5", "8n");
      if (Tone.context.state !== "running") {
        Tone.start();
      }
    
      // Call the goNext function to switch to the next scene
      this.goNext('Outro');
    }, null, this);
    




    // collision detection for trash
    this.physics.add.collider(this.nova,this.trashGroup,this.trashTouched);


    // add input controls
    this.inputControls = new InputControls(this, this.nova);
  }
  update(){
    // update input controls
    this.inputControls.update();
     // restart the scene if the player is out of bounds
     if (this.nova.x < 0 ||this.nova.y > this.scale.height || this.nova.x > this.scale.width) {
      this.music.stop();
      // Reset touching trash
      this.touchedTrashCount = 0;
      console.log("Trash picked up by Nova ",this.touchedTrashCount);
      // Restart the scene.
      this.scene.restart();
    }
  }
}
// ------------------------------------------------------------------------------------------------------------
// -------------------------------------------------- Outro -----------------------------------------------------
// ------------------------------------------------------------------------------------------------------------

class Outro extends ConfigureScene {
  constructor() {
      super('Outro');
  }
  init(data){
    this.mutevalue = data.mutevalue;
    this.previousScene = data.previousScene;
  }

  create(){
    const sound = this.sound.add('trashPickup')
    // font for menu text
    const fontProperties = {
      fontFamily: 'Rubik Puddles',
      align: 'center',
  };
   // gameSize
   const gameWidth = this.scale.width;
   const gameHeight = this.scale.height;

   //video that acts like music for background
   const videoSound = this.add.video(0, 0, 'end')
   videoSound.setVisible(false);

   if(this.mutevalue == false){
    videoSound.play(true);
  }

  //  set the background
   const video = this.add.video(0, 0, 'end');
   video.setOrigin(0.5);
   video.setLoop(true);
   video.play(true);
   const scaleX = gameWidth / video.width;
   const scaleY = gameHeight / video.height;
   const scale = Math.min(scaleX, scaleY);
   video.setPosition(gameWidth / 2, gameHeight / 2);
   video.setLoop(false);


    
 

  // add an event listener to the video when it is done playing and add go to the next scene button 
  video.on('complete', () => {
      videoSound.stop();
      

      // set the background
      const video = this.add.video(0, 0, 'star');
      video.setOrigin(0.5);
      video.setLoop(true);
      video.play(true);
      

      const scaleX = gameWidth / video.width;
      const scaleY = gameHeight / video.height;
      const scale = Math.min(scaleX, scaleY);
      video.setPosition(gameWidth / 2, gameHeight / 2);
      // add text to the scene
      const text = this.add.text(gameWidth * .5, gameHeight * .1, 'As the ship fades away and as zoom towards the Cosmos deep down the mission is not over ', fontProperties)
      .setOrigin(0.5)
      .setFontSize(gameWidth * .025)
      .setWordWrapWidth(gameWidth * .7);

      const button = this.add.sprite(gameWidth * .9, gameHeight *.8, 'button')
      .setInteractive()
      .setScale(.25)
      .setAlpha(0);
      // Create a fade-in tween for the button
      this.tweens.add({
          targets: button,
          alpha: 1,
          scaleX: .5,
          scaleY: .5,
          duration:1000,
          ease: 'Power1',
          yoyo: true,
          repeat: -1
      });

      button.on('pointerdown', () => {
        this.time.delayedCall(1000, () => {
          this.cameras.main.fade(1000, 0,0,0);
          this.scene.start('Menu', {mutevalue: this.mutevalue});
        }, [], this);
        });
      });
     
  }
}


class Settings extends ConfigureScene {
    constructor() {
        super('Settings');
    }
    init(data) {
        this.mutevalue = data.mutevalue;
        this.previousScene = data.previousScene;
    } 
    create() {
          // font for menu text
          const fontProperties = {
            fontFamily: 'Rubik Puddles',
            align: 'center',
        };
        // sound for feedback
        const sound = this.sound.add('trashPickup');
        // center of the screen
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        // gameSize
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
        
        // set the background
        const video = this.add.video(0, 0, 'star');
        video.setOrigin(0.5);
        video.setLoop(true);
        video.play(true);

        


        // scale the video
        const scaleX = gameWidth / video.width;
        const scaleY = gameHeight / video.height;
        const scale = Math.min(scaleX, scaleY);
        video.setPosition(gameWidth / 2, gameHeight / 2);

        const settingsText = this.add.text(centerX,centerY, 'Settings',fontProperties);
        settingsText.setOrigin(0.5,3);
        settingsText.setFontSize(gameWidth * .05);

        this.back = this.add.text(centerX, centerY, 'back', fontProperties).setInteractive()
        this.back.setOrigin(0.5, -1);
        this.back.setFontSize(gameWidth * .05);
        this.back.on('pointerdown', () => {
            if(this.mutevalue == false){
              sound.play();
            }
            this.scene.start(this.previousScene, { mutevalue: this.mutevalue })    
        });

        if(this.mutevalue == false){
          this.createMute();
        } else {
          this.createUnmute();
        }
    }
    createUnmute(){
      const sound = this.sound.add('trashPickup');
       // font for menu text
       const fontProperties = {
        fontFamily: 'Rubik Puddles',
        align: 'center',
      };
      const centerX = this.cameras.main.width / 2;
      const centerY = this.cameras.main.height / 2;
      const gameWidth = this.scale.width;
      this.unmute = this.add.text(centerX, centerY, 'unmute', fontProperties).setInteractive()
      this.unmute.setOrigin(0.5,1);
      this.unmute.setFontSize(gameWidth * .05);
      this.unmute.on('pointerdown', () => {
        if(this.mutevalue == false){
          sound.play();
        }
          this.mutevalue = false;
          this.unmute.destroy();
          this.createMute();     
      })
    }
    
    createMute(){
      const sound = this.sound.add('trashPickup');
       // font for menu text
       const fontProperties = {
        fontFamily: 'Rubik Puddles',
        align: 'center',
      };
      const centerX = this.cameras.main.width / 2;
      const centerY = this.cameras.main.height / 2;
        this.mute = this.add.text(centerX, centerY, 'mute', fontProperties).setInteractive()
        this.mute.setOrigin(0.5,1);
        const gameWidth = this.scale.width;
        this.mute.setFontSize(gameWidth * .05);
        this.mute.on('pointerdown', () => {
            if(this.mutevalue == false){
              sound.play();
            }
            this.mutevalue = true;
            this.mute.destroy();
            this.createUnmute();     
        }
      )
    }

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
      debug: false,
    },
  },
  input: {
    keyboard: true,
    touch: true,
  },
  scene: [ConfigureScene,Menu,Settings,IntroCinematic,LevelOne,LevelTwo,LevelThree,CinematicTwo,CinematicThree,Outro],
  // ConfigureScene,Menu,Settings,IntroCinematic,LevelOne,LevelTwo,LevelThree,CinematicTwo,CinematicThree,Outro
};

const game = new Phaser.Game(config);

// ------------------------------------------------------------------------------------------------------------
// handle orientation change
// ------------------------------------------------------------------------------------------------------------

window.addEventListener('orientationchange', function () {
  game.scale.refresh();
});
