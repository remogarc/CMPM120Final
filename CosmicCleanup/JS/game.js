console.log("game.js loaded")

class Menu extends Phaser.Scene {
    preload() {

    }
    create() {
        this.add.text(20, 20, "Loading game...")
        this.add.text(20, 40, "Press space to start")
    }
    update() {

    }
}

const config = {
    type: Phaser.AUTO,
    scale : {
        mode: Phaser.Scale.RESIZE,
        width: '100%',
        height: '100%',
        parent: 'game-container',
    },   
    scene: [Menu],
}

const game = new Phaser.Game(config)