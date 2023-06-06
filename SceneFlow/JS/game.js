
// -----------------------------------------------------------------------------------------------------------------------
// Flow of the game
// MENU - > Cinematic -> Level1 -> Cinematic -> Level2 -> Cinematic -> Level3 -> Cinematic -> End/ Credits
// -----------------------------------------------------------------------------------------------------------------------


class Menu extends Phaser.Scene {
    constructor(scenekey){
        super(scenekey)
        // this.music = null;
    }
    preload(){
        this.load.video('stars', '../Cinematics/Assets/spacewallp.mp4')
        this.load.audio('level1Music','../CoreGamplay/Assets/music1.mp3');
        this.load.image('song','../CoreGamplay/Assets/sound.png');
        this.load.image('check','../CoreGamplay/Assets/mute.png');

    }
    create(){

        this.music = this.sound.add('level1Music');
        this.music.play();


        const vid = this.add.video(100, 100, 'stars');
        vid.play(true);
        this.add.text(20,20,'Title Screen');

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // game text with json data file
        this.gameText = this.add.text(centerX, centerY, 'Cosmic Cleanup');
        this.gameText.setOrigin(0.5,4);
        this.gameText.setColor('#ffffff');

        //   start text
        this.startText = this.add.text(centerX, centerY, 'Tap to start');
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
            this.time.delayedCall(1000, () => {
                this.cameras.main.fade(1000, 0,0,0);
                this.scene.start('Cinematic');
        }, [], this);
        }, this);
        
        this.toggleMute();
        }

        toggleMute(){
            
            // Create variables to track number of trash picked up
            const gameWidth = this.scale.width;
            const gameHeight = this.scale.height;
            this.song = this.add.image(gameWidth * .9,gameHeight * .9, 'song');
            //fix postion and scale 
            this.song.setScale(4);
            this.check = this.add.image(gameWidth * .9,gameHeight * .9,'check');
            //fix position and scale
            this.check.setScale(4);
            this.check.visible = false;
            this.song.setInteractive();
            this.song.on("pointerup", () => {
            this.sound.mute = !this.sound.mute;
            this.check.visible = !this.check.visible;
            });
            //if statement here
        }
}


class Cinematic extends Menu {
    constructor() {
        super('Cinematic')
    }
    preload(){
        this.load.video('l1cine', '../Cinematics/Assets/earth.mp4')
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
                this.scene.start('Level1')
            });     
          }, [], this);
       
          this.add.text(20,20,'Cinematic Scene 1');
          this.toggleMute();
    }
}


class Level1 extends Menu {
    constructor(){
        super('Level1')
    }
    preload(){
        this.load.image('earth', '../CoreGamplay/Assets/earth.png')
    }
    create(){
        this.add.image(100,100,'earth');
        this.add.text(100,100,'Level 1 platformer');  
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
        this.time.delayedCall(2000, () => {
            this.textObject = this.add.text(gameWidth *.8, gameHeight*.8,"tap");
            this.input.on('pointerdown', () => {
                this.cameras.main.fade(1000, 0,0,0);
                this.scene.start('Credits');
            });     
          }, [], this);
        this.toggleMute();
    } 
}

class Credits extends Menu {
    constructor(){
        super('Credits')
    }
    preload(){
        this.load.video('stars', '../Cinematics/Assets/spacewallp.mp4')
    }
    create(){
        const vid = this.add.video(100, 100, 'stars');
        vid.play(true);
        this.add.text(20,20,'Credits');
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
        this.time.delayedCall(2000, () => {
            this.textObject = this.add.text(gameWidth *.8, gameHeight*.8,"tap");
            this.input.on('pointerdown', () => {
                this.cameras.main.fade(1000, 0,0,0);
                this.scene.start('Menu');
            });     
          }, [], this);
        this.toggleMute();
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
    scene: [Menu,Cinematic,Level1,Credits],
    // ConfigureScene,Menu,LevelOne,LevelTwo,LevelThree
  };
  
  const game = new Phaser.Game(config);
  
 