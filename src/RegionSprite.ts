import { GameObjects, Physics, Scene, Geom } from "phaser"
import * as v4 from 'uuid'


export default class RegionSprite extends GameObjects.Sprite {
    
    mapName:string
    label: GameObjects.Text
   
    constructor(scene:Scene, x:number, y:number, texture:string, width:number, height:number, data:Phaser.Data.DataManager){
        super(scene, x, y, texture)
        scene.add.existing(this)
        this.setInteractive()
        this.setPosition(x, y+height)
        this.setTint(0x000)
        this.setAlpha(0.7)
        this.setDisplaySize(width, height)
        this.label = scene.add.text(this.getBottomLeft().x+2, this.getBottomLeft().y-10, this.mapName, {
            fontFamily: 'Body', 
            fontSize: '10px',
            color: 'white'
        });
        this.label.setDepth(4)
    }

    setInPlay = () => {
        this.scene.tweens.add({
            targets: this,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            alpha: 0.2
        })
    }

    setInactive = () => {
        this.scene.tweens.getTweensOf(this).forEach(t=>t.remove())
        this.setAlpha(0.7)
    }
}
