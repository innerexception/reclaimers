import { GameObjects, Physics, Scene, Geom } from "phaser"
import * as v4 from 'uuid'


export default class RegionSprite extends GameObjects.TileSprite {
    
    mapName:string
    label: GameObjects.Text
   
    constructor(scene:Scene, x:number, y:number, texture:string, width:number, height:number, data:Phaser.Data.DataManager){
        super(scene, x, y, width, height, texture)
        scene.add.existing(this)
        this.setTileScale(0.5)
        this.setPosition(x, y+height)
        this.mapName = data && data.list[0].value
        if(this.mapName){
            this.setAlpha(0.1)
            this.setInteractive()
        }
        else this.setAlpha(1)
        // this.label = scene.add.text(this.getBottomLeft().x+2, this.getBottomLeft().y-10, this.mapName, {
        //     fontFamily: 'Body', 
        //     fontSize: '10px',
        //     color: 'white'
        // });
        // this.label.setDepth(4)
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
