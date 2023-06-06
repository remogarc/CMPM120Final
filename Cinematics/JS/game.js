console.log("game.js for cinematics loaded")


class MenuScene extends Phaser.Scene {
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
      preload(){
        this.load.video('stars', 'Assets/spacewallp.mp4')
      }
      create() {
        // access the game data json file
        // const vid = this.add.video(100, 100, 'stars');
        // vid.play(true);
        // vid.displayWidth = this.sys.canvas.width;
        // vid.displayHeight = this.sys.canvas.height;

          // The game width and height to set our assets to scale to the size of the game
        // IMPORTANT -----------------------------------------------------------------------------------------------
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
        //  // Create the background
        const video = this.add.video(100,100, 'stars');
        // video.setOrigin(0, 0);
        video.play(true);
    
    
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
        this.gameText = this.add.text(centerX, centerY, 'Cosmic Cleanup', fontProperties);
        this.gameText.setOrigin(0.5,2);
        this.gameText.setColor('#ffffff');
        // start text
        this.startText = this.add.text(centerX, centerY, 'Tap to start', fontProperties);
        this.startText.setColor('#ffffff');
        this.startText.setOrigin(0.5);
        this.startText.setInteractive();
        // To start the game
        this.startText.on('pointerover',() => {
            this.startText.setColor('#FFFF00');
        })
        this.startText.on('pointerout',() => {
            this.startText.setColor('#FFFFFF');
        })
        this.startText.on('pointerdown', () => {
        this.startText.setColor('#FFFF00');
          this.isResizing = false; // Stop resizing
          this.shutdown();
          this.time.delayedCall(1000, () => {
            this.cameras.main.fade(1000, 0,0,0);
            this.scene.start('levelOneCinematic');
          }, [], this);
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

class levelOneCinematic extends Phaser.Scene {
    constructor() {
        super('levelOneCinematic')
    }
    preload(){
        this.load.video('l1cine', 'Assets/earth.mp4')
    }
    create(){
        this.cameras.main.fadeIn(1000, 0, 0, 0);
         // Create variables to track number of trash picked up
         const gameWidth = this.scale.width;
         const gameHeight = this.scale.height;
         
        const vid = this.add.video(400, 150, 'l1cine');
        vid.setScale(0.5);
        vid.play(true);

        this.time.delayedCall(5000, () => {
            this.textObject = this.add.text(gameWidth *.8, gameHeight*.8,"tap");
            this.input.on('pointerdown', () => {
                this.cameras.main.fade(1000, 0,0,0);
                this.scene.start('levelTwoCinematic')
            });     
          }, [], this);
       
    }
}

class levelTwoCinematic extends Phaser.Scene {
    constructor(){
        super('levelTwoCinematic')
    }
    preload(){
        this.load.video('l2cine', 'Assets/mars.mp4')
    }
    create(){
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        // Create variables to track number of trash picked up
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
        
        const vid = this.add.video(400, 150, 'l2cine');
        vid.setScale(0.5);
        vid.play(true);
        this.time.delayedCall(5000, () => {
            this.textObject = this.add.text(gameWidth *.8, gameHeight*.8,"tap");
            this.input.on('pointerdown', () => {
                this.cameras.main.fade(1000, 0,0,0);
                this.scene.start('levelThreeCinematic')
        });     
          }, [], this);
        
    }
}

class levelThreeCinematic extends Phaser.Scene {
    constructor(){
        super('levelThreeCinematic')
    }
    preload(){
        this.load.video('l3cine', 'Assets/ice.mp4')
    }
    create(){
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        // Create variables to track number of trash picked up
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
                 
        const vid = this.add.video(400, 150, 'l3cine');
        vid.setScale(0.5);
        vid.play(true);
        this.time.delayedCall(5000, () => {
            this.textObject = this.add.text(gameWidth *.8, gameHeight*.8,"tap");
            this.input.on('pointerdown', () => {
                this.cameras.main.fade(1000, 0,0,0);
                this.scene.start('Menu')}
            );     
          }, [], this);
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
        debug: false,
      },
    },
    input: {
      keyboard: true,
      touch: true,
    },
    scene: [MenuScene,levelOneCinematic,levelTwoCinematic,levelThreeCinematic],
    // ConfigureScene,Menu,LevelOne,LevelTwo,LevelThree
  };
  
  const game = new Phaser.Game(config);
  
  // ------------------------------------------------------------------------------------------------------------
  // handle orientation change
  // ------------------------------------------------------------------------------------------------------------
  
  window.addEventListener('orientationchange', function () {
    game.scale.refresh();
  });