import { GameObjects, Time } from "phaser";
import { v4 } from "uuid";
import { store } from "../../App";
import { FONT_DEFAULT, Objectives, RCObjectType, RCUnitType } from '../../constants'
import { NPCData } from "../data/NPCData";
import MapScene from "./MapScene";
import { onSpawnBot, onUpdatePlayer, onUpdateSelectedBuilding } from "../uiManager/Thunks";

export default class BuildingSprite extends GameObjects.Sprite {

    building: RCBuildingState
    reticle: GameObjects.Image
    scene: MapScene
    timer: Time.TimerEvent
    updateTimer: Time.TimerEvent
    
    constructor(scene:MapScene,x:number,y:number, building:RCObjectType,tileX:number,tileY:number, designs:Array<RCUnitData>){
        super(scene, x,y, 'sprites', building)
        
        this.building = {
            id:v4(),
            type: building,
            tileX,
            tileY,
            timer: 0,
            activeDroneDesign: null,
            availableDroneDesigns: designs
        }
        this.setDisplaySize(16,16)
        this.setInteractive()
        scene.add.existing(this)

        if(building === RCObjectType.WarFactory){
            this.resetProduction(NPCData[RCUnitType.AncientSentry])
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
                const p = store.getState().activeEncounter.player
                if(design.droneType === RCUnitType.ToxinExtractor && !p.completedObjectives.includes(Objectives.BuildExtractor)){
                    p.completedObjectives.push(Objectives.BuildExtractor)
                    onUpdatePlayer({...p})
                }
                if(design.droneType === RCUnitType.CHProcessor && !p.completedObjectives.includes(Objectives.BuildProcessor)){
                    p.completedObjectives.push(Objectives.BuildProcessor)
                    onUpdatePlayer({...p})
                }
            },
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