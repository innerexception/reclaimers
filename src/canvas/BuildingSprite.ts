import { GameObjects, Time } from "phaser";
import { v4 } from "uuid";
import { store } from "../../App";
import { FONT_DEFAULT, Objectives, RCObjectType, RCDroneType } from '../../constants'
import { NPCData } from "../data/NPCData";
import MapScene from "./MapScene";
import { onSpawnBot, onUpdatePlayer, onUpdateSelectedBuilding } from "../uiManager/Thunks";
import { addObjective } from "../util/Util";

export default class BuildingSprite extends GameObjects.Sprite {

    building: RCBuildingState
    reticle: GameObjects.Image
    scene: MapScene
    timer: Time.TimerEvent
    updateTimer: Time.TimerEvent
    
    constructor(scene:MapScene,x:number,y:number, tileX:number,tileY:number, config:RCBuildingConfig){
        super(scene, x,y, 'sprites', config.type)
        
        this.building = {
            id:v4(),
            type: config.type,
            tileX,
            tileY,
            timer: 0,
            activeDroneDesign: null,
            availableDroneDesigns: config.availableDroneDesigns,
            maxProduction: config.maxProduction
        }
        
        this.setDisplaySize(16,16)
        this.setInteractive()
        scene.add.existing(this)

        if(config.type === RCObjectType.WarFactory){
            this.resetProduction(config.activeDroneDesign)
        }
    }
        
    pauseProduction(){
        this.timer && this.timer.remove()
        this.building.activeDroneDesign = null
    }

    resetProduction(design:RCUnitData){
        this.timer && this.timer.remove()
        this.building.activeDroneDesign = design
        this.timer = this.scene.time.addEvent({
            delay: design.buildTime,
            callback: ()=>{
                onSpawnBot(design, this)
                const p = store.getState().onlineAccount
                if(design.unitType === RCDroneType.ToxinExtractor){
                    addObjective(Objectives.BuildExtractor, p)
                }
                if(design.unitType === RCDroneType.Processor){
                    addObjective(Objectives.BuildProcessor, p)
                }
                if(design.unitType === RCDroneType.Ordinater){
                    addObjective(Objectives.BuiltOrdinater, p)
                }
                if(!this.building.maxProduction) this.pauseProduction()
            },
            repeat: this.building.maxProduction ? this.building.maxProduction : 0
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