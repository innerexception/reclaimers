import { GameObjects, Time } from "phaser";
import { v4 } from "uuid";
import { FONT_DEFAULT, ItemType, RCObjectType } from '../constants'
import MapScene from "./MapScene";
import { onEncounterUpdated, onSpawnBot, onUpdateSelectedBuilding } from "./uiManager/Thunks";

export default class BuildingSprite extends GameObjects.Sprite {

    building: RCBuildingState
    reticle: GameObjects.Image
    scene: MapScene
    timer: Time.TimerEvent
    updateTimer: Time.TimerEvent
    
    constructor(scene:MapScene,x:number,y:number, building:RCObjectType){
        super(scene, x,y, 'sprites', building)
        
        this.building = {
            id:v4(),
            type: building,
            tileX:0,
            tileY:0,
            timer: 0,
            design: null
        }
        this.setDisplaySize(16,16)
        this.setInteractive()
        scene.add.existing(this)
    }
        
    pauseProduction(){
        this.timer && this.timer.remove()
        this.building.design = null
    }

    resetProduction(design:RCUnitData){
        this.timer && this.timer.remove()
        this.building.design = design
        this.timer = this.scene.time.addEvent({
            delay: 30000,
            callback: ()=>onSpawnBot(design, this),
            loop: true
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
            this.scene.cameras.main.startFollow(this)
            this.updateTimer && this.updateTimer.remove()
            this.updateTimer = this.scene.time.addEvent({
                delay:1000,
                callback: ()=>onUpdateSelectedBuilding({...this.building, timer: this.timer? this.timer.getProgress() : 0}),
                loop: true
            })
        }
        else{
            this.reticle.destroy()
            this.updateTimer.remove()
        } 
    }

    destroy(){
        super.destroy()
        this.reticle && this.reticle.destroy()
        this.timer && this.timer.remove()
        this.updateTimer && this.updateTimer.remove()
    }
}