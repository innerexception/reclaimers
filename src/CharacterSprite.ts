import { GameObjects, Tweens, Tilemaps } from "phaser";
import { store } from "../App";
import { AbilityType, defaultProcessing, ExtractorToxinList, FONT_DEFAULT, ItemType, RCObjectType, RCUnitType, TerrainLevels } from '../constants'
import BuildingSprite from "./BuildingSprite";
import MapScene from "./MapScene";
import { onUpdateSelectedUnit, onUpdatePlayer, onEncounterUpdated } from "./uiManager/Thunks";
import AStar from "./util/AStar";
import { getNearestDropoff, shuffle } from "./util/Util";

export default class CharacterSprite extends GameObjects.Sprite {

    entity: RCUnit
    reticle: GameObjects.Image
    status: Array<GameObjects.Image>
    scene: MapScene
    currentMove: Tweens.Timeline

    constructor(scene:MapScene,x:number,y:number, frame:number, character:RCUnit){
        super(scene, x,y, 'bot-sprites', frame)
        
        this.entity = character
        this.status = []
        this.setDisplaySize(16,16)
        this.play(character.droneType.toString())
        this.setInteractive()
        scene.add.existing(this)
        scene.time.addEvent({
            delay:1000,
            callback: this.runUnitTick,
        })
    }
    
    runUnitTick = () => {
        let dat = this.entity
        onUpdateSelectedUnit(dat)
        switch(dat.droneType){
                case RCUnitType.Scout:
                    //Head towards the fog
                    const fogTiles = this.scene.getVisibleTiles(dat, 'fog')
                    const nextVisible = fogTiles.find(t=>t.alpha === 1)
                    if(nextVisible){
                        this.executeCharacterMove(nextVisible)
                    }
                    else {
                        this.roam()
                    }
                break
                case RCUnitType.Ordinater:
                    //1. Check if dormant factory in sight range
                    const visibleTiles = this.scene.getVisibleTiles(dat, 'objects')
                    const fac = visibleTiles.find(t=>t.index-1 === RCObjectType.Base && !this.scene.buildings.find(b=>b.building.tileX === t.x && b.building.tileY === t.y))
                    //2. If so, move towards. 
                    if(fac){
                        //If on top of, merge with it to activate (remove self)
                        if(fac.x === dat.tileX && fac.y === dat.tileY){
                            this.scene.buildings.push(new BuildingSprite(this.scene, fac.getCenterX(), fac.getCenterY(), RCObjectType.Base, fac.x, fac.y))
                            this.destroy()
                        }
                        else {
                            this.executeCharacterMove(fac)
                        }
                    }
                    else this.roam()
                break
                case RCUnitType.Processor:
                    //Do nothing. Can be ordered to generate a swarm, or manually moved.
                break
                case RCUnitType.Defender:
                    //Can be ordered to generate a swarm. Also targets enemies in sight range with ranged attacks.
                break
                case RCUnitType.AncientSentry:
                    //Basically any mechanical runs this branch
                    //Same as defender ai with paramter mods
                    //Sometimes drops lore when killed
                break
                case RCUnitType.LightCompactor:
                    if(dat.inventory.length === dat.maxInventory){
                        let base = getNearestDropoff(this.scene.buildings.filter(b=>b.building.type === RCObjectType.Base), this.scene.entities.filter(e=>e.entity.droneType === RCUnitType.Processor), dat)
                        if(base.tileX === dat.tileX && base.tileY === dat.tileY){
                            const player = store.getState().activeEncounter.players[0]
                            dat.inventory.forEach(i=>{
                                if(player.resources[i] !== undefined) {
                                    player.resources[i]++
                                    this.floatResourceAndContinue(i)
                                }
                            })
                            dat.inventory = []
                            onUpdatePlayer(player)
                            return this.runUnitTick()
                        }
                        else return this.executeCharacterMove(this.scene.map.getTileAt(base.tileX, base.tileY, false, 'ground'))
                    }
                    //Head towards a revealed resource patch that you can extract: //TODO: and that there exists a valid dropoff point for
                    const tileDat = this.scene.tiles[dat.tileX][dat.tileY]
                    const tilei = tileDat.toxins.findIndex(x=>ExtractorToxinList[AbilityType.ExtractorMk1].includes(x))
                    if(tilei!==-1){
                        let tox = tileDat.toxins.splice(tilei,1)
                        dat.inventory.push(tox[0])
                        const tile = this.scene.map.getTileAt(dat.tileX, dat.tileY, false, 'ground') 
                        const toxLength = tileDat.toxins.length
                        if(toxLength < 3){
                            tile.index = TerrainLevels[tileDat.type-1].reverse()[toxLength]+1
                        }
                        this.floatResourceAndContinue(tox[0], this.runUnitTick)
                    }
                    else {
                        const visibleTiles = shuffle(this.scene.getVisibleTiles(dat, 'ground'))
                        const nextVisibleResource = visibleTiles.find(t=>
                            this.scene.tiles[t.x][t.y].toxins.some(x=>ExtractorToxinList[AbilityType.ExtractorMk1].includes(x)
                            && this.scene.passableTile(t.x, t.y, dat)
                        ))
                        if(nextVisibleResource){
                            this.executeCharacterMove(nextVisibleResource)
                        }
                        else {
                            this.roam()
                        }
                    }
                break
            }
    }

    roam = () => {
        const dat = this.entity
        //Roam
        let x = Phaser.Math.Between(0,1)
        let y = Phaser.Math.Between(0,1)
        let candidate = {x: x===1 ?dat.tileX-1 : dat.tileX+1, y: y===1 ? dat.tileY-1 : dat.tileY+1}
        let t = this.scene.map.getTileAt(candidate.x, candidate.y, false, 'ground')
        if(t && this.scene.passableTile(t.x, t.y, dat)) this.executeCharacterMove(t)
        else{
            this.scene.time.addEvent({
                delay: 1000,
                callback: this.runUnitTick
            })
        } 
    }

    executeCharacterMove = (targetTile:Tilemaps.Tile) => {
        const dat = this.entity
        let path = new AStar(targetTile.x, targetTile.y, (tileX,tileY)=>this.scene.passableTile(tileX, tileY, dat)).compute(dat.tileX, dat.tileY)
        
        if(dat.swarmLeaderId){
            //TODO: if more than 3 tiles from leader, move towards leader
            const leader = this.scene.entities.find(c=>c.entity.id === dat.swarmLeaderId)
            const dist = Phaser.Math.Distance.Between(leader.entity.tileX, leader.entity.tileY, dat.tileX, dat.tileY)
            if(dist > 3){
                path = new AStar(leader.entity.tileX, leader.entity.tileY, (tileX,tileY)=>this.scene.passableTile(tileX, tileY, dat)).compute(dat.tileX, dat.tileY)
            }
        }
              
        if(path.length === 0){
            //This unit is currently blocked and has no valid movement path, so we wait one and see if we are unblocked
            this.scene.time.addEvent({
                delay: 1000,
                callback: this.roam
            })
            return 
        } 

        if(this.visible){
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
                            //dat.moves--
                            const pos = path[i]
                            dat.tileX = pos.x
                            dat.tileY = pos.y
                            onUpdateSelectedUnit(dat)
                            this.scene.updateFogOfWar()
                        }
                    }
                }),
                onComplete: ()=>{
                    const pos = path[path.length-1]
                    let dat = this.entity
                    dat.tileX = pos.x
                    dat.tileY = pos.y
                    onUpdateSelectedUnit(dat)
                    this.scene.updateFogOfWar()
                    this.scene.onCompleteMove(dat)
                }
            });
        }
        else {
            const pos = path[path.length-1]
            dat.tileX = pos.x
            dat.tileY = pos.y
            this.scene.onCompleteMove(dat)
        }
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

    floatResourceAndContinue(index:number, onComplete?:Function){
        let txt = this.scene.add.image(this.x, this.y, 'resources', index).setDepth(5)
        this.scene.tweens.add({
            targets: txt,
            y: this.y-20,
            alpha: 0,
            duration: 2000,
            onComplete: ()=>{
                txt.destroy()
                if(onComplete) onComplete()
            }
        })
    }

    setTargeted(state:boolean){
        if(state){
            this.reticle = this.scene.add.image(this.x, this.y, 'selected')
        }
        else this.reticle.destroy()
    }

    setVisible(visible:boolean){
        super.setVisible(visible)
        this.status.forEach(s=>s.setVisible(visible))
        return this
    }

    preUpdate(time, delta){
        this.anims.update(time, delta)
        this.reticle && this.reticle.setPosition(this.x, this.y)
    }

    destroy(){
        super.destroy()
        this.reticle && this.reticle.destroy()
        this.status && this.status.forEach(s=>s.destroy())
    }
}