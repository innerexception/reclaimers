import { GameObjects, Tweens, Tilemaps, Geom } from "phaser";
import MapScene from "./MapScene";
import AStar from "../util/AStar";
import { RCAnimalType } from "../../constants";

export default class AnimalSprite extends GameObjects.Sprite {

    entity: RCAnimal
    scene: MapScene
    currentMove: Tweens.Timeline
    shouldDestroy: boolean

    constructor(scene:MapScene,x:number,y:number, character:RCAnimal){
        super(scene, x,y, character.animalType)
        this.entity = character
        this.setScale(0.2)
        scene.add.existing(this)
        scene.time.addEvent({
            delay:1000,
            callback: this.runUnitTick,
        })
    }
    
    gc = () => {
        this.scene.animals.splice(this.scene.animals.findIndex(e=>e.entity.id===this.entity.id), 1)
        this.destroy()
    }

    runUnitTick = () => {
        if(this.shouldDestroy){
            this.gc()
            return
        }
        let dat = this.entity
        switch(dat.animalType){
            case RCAnimalType.Human: 
                //TODO: Stay within 2 tiles of a hut

            break
            default: this.roam()
        }
    }

    roam = () => {
        const dat = this.entity
        //Roam
        let x = Phaser.Math.Between(0,1)
        let y = Phaser.Math.Between(0,1)
        let candidate = {x: x===1 ?dat.tileX-1 : dat.tileX+1, y: y===1 ? dat.tileY-1 : dat.tileY+1}
        let t = this.scene.map.getTileAt(candidate.x, candidate.y, false, 'ground')
        if(t && this.scene.passableTile(t.x, t.y, dat)) this.executeMove(t)
        else{
            this.scene.time.addEvent({
                delay: Phaser.Math.Between(1000,10000),
                callback: this.runUnitTick
            })
        } 
    }

    executeMove = (targetTile:Tilemaps.Tile) => {
        const dat = this.entity
        let path = new AStar(targetTile.x, targetTile.y, (tileX,tileY)=>this.scene.passableTile(tileX, tileY, dat)).compute(dat.tileX, dat.tileY)
        
        if(path.length === 0){
            //This unit is currently blocked and has no valid movement path, so we wait one and see if we are unblocked
            this.scene.time.addEvent({
                delay: 1000,
                callback: this.roam
            })
            return 
        } 

        if(this.visible){
            this.play(this.entity.animalType, true)
            if(this.currentMove) this.currentMove.stop()
            this.currentMove = this.scene.tweens.timeline({
                targets: this,    
                tweens: path.map((tuple,i)=>{
                    let tile = this.scene.map.getTileAt(tuple.x, tuple.y, false, 'ground')
                    return {
                        x: tile.getCenterX(),
                        y: tile.getCenterY(),
                        duration: 1000/dat.speed,
                        onComplete: ()=>{
                            let dat = this.entity
                            const pos = path[i]
                            dat.tileX = pos.x
                            dat.tileY = pos.y
                            this.play(this.entity.animalType, true)
                        }
                    }
                }),
                onComplete: ()=>{
                    const pos = path[path.length-1]
                    let dat = this.entity
                    dat.tileX = pos.x
                    dat.tileY = pos.y
                    this.runUnitTick()
                }
            });
        }
        else {
            const pos = path[path.length-1]
            dat.tileX = pos.x
            dat.tileY = pos.y
            this.runUnitTick()
        }
    }

    preUpdate(time, delta){
        this.anims.update(time, delta)
    }
}