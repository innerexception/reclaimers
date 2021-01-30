import { GameObjects, Tweens, Tilemaps, Time } from "phaser";
import { store } from "../App";
import { AbilityType, ExtractorToxinList, FONT_DEFAULT, RCObjectType, RCUnitType, TerrainLevels } from '../constants'
import MapScene from "./MapScene";
import { onSpawnBot } from "./uiManager/Thunks";
import { getUnitFromData } from "./util/Util";

export default class BuildingSprite extends GameObjects.Sprite {

    building: RCObjectType
    design: RCUnitData
    reticle: GameObjects.Image
    scene: MapScene
    timer: Time.TimerEvent
    
    constructor(scene:MapScene,x:number,y:number, building:RCObjectType){
        super(scene, x,y, 'sprites', building)
        
        this.building = building
        this.setDisplaySize(16,16)
        this.setInteractive()
        scene.add.existing(this)
    }
        
    resetProduction(design:RCUnitData){
        this.design = design
        this.timer && this.timer.remove()
        this.timer = this.scene.time.addEvent({
            delay:30000,
            callback: ()=>onSpawnBot(design, this)
        })
    }

    floatDamage(dmg:number, color:string){
        let txt = this.scene.add.text(this.x, this.y, dmg.toString(), {...FONT_DEFAULT, color}).setDepth(5)
        this.scene.tweens.add({
            targets: txt,
            y: this.y-20,
            alpha: 0,
            duration: 1000,
            onComplete: ()=>{
                txt.destroy()
            }
        })
    }

    setTargeted(state:boolean){
        if(state){
            this.reticle = this.scene.add.image(this.x, this.y, 'selected')
        }
        else this.reticle.destroy()
    }

    destroy(){
        super.destroy()
        this.reticle && this.reticle.destroy()
    }
}