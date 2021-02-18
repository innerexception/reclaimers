import { GameObjects, Tweens, Tilemaps, Geom } from "phaser";
import { store } from "../App";
import { FONT_DEFAULT, Objectives, RCObjectType, RCUnitType, Scenarios, TerrainLevels } from '../constants'
import MapScene from "./MapScene";
import { onUpdateSelectedUnit, onUpdatePlayer, unSelectedUnit } from "./uiManager/Thunks";
import AStar from "./util/AStar";
import { getNearestDropoffForResource, getSightMap, shuffle } from "./util/Util";
import ObjectiveView from "./views/Objectives";

export default class CharacterSprite extends GameObjects.Sprite {

    entity: RCUnit
    reticle: GameObjects.Image
    swarmLeaderBadge: GameObjects.Image
    scene: MapScene
    currentMove: Tweens.Timeline
    g:GameObjects.Graphics
    shouldDestroy: boolean

    constructor(scene:MapScene,x:number,y:number, frame:number, character:RCUnit){
        super(scene, x,y, 'bot-sprites', frame)
        this.g = scene.add.graphics()
        this.g.lineStyle(1, 0xff0000, 1)
        this.entity = character
        this.setDisplaySize(16,16)
        this.play(character.droneType.toString())
        this.setInteractive()
        scene.add.existing(this)
        scene.time.addEvent({
            delay:1000,
            callback: this.runUnitTick,
        })
    }
    
    gc = () => {
        if(this.entity.id === store.getState().selectedUnit?.id){
            this.setTargeted(false)
            unSelectedUnit()
        }
        this.scene.entities.forEach(e=>{
            if(e.entity.swarmLeaderId === this.entity.id) e.entity.swarmLeaderId=''
        })
        this.scene.entities.splice(this.scene.entities.findIndex(e=>e.entity.id===this.entity.id), 1)
        this.destroy()
    }

    runUnitTick = () => {
        if(this.shouldDestroy){
            this.gc()
            return
        }
        let dat = this.entity
        onUpdateSelectedUnit(dat)
        switch(dat.droneType){
                case RCUnitType.Scout:
                    //Head towards the fog
                    const fogTiles = this.scene.getVisibleTiles(dat, 'fog')
                    const nextVisible = fogTiles.find(t=>t.alpha === 1)
                    if(nextVisible){
                        this.executeDroneMove(nextVisible)
                    }
                    else {
                        this.roam()
                    }
                break
                case RCUnitType.Ordinater:
                    //1. Check if dormant factory in sight range
                    const visibleTiles = this.scene.getVisibleTiles(dat, 'ground')
                    const fac = visibleTiles.find(t=>this.scene.buildings.find(b=>b.building.type === RCObjectType.WarFactory && b.building.tileX === t.x && b.building.tileY === t.y))
                    //2. If so, move towards. 
                    if(fac){
                        //If on top of, merge with it to activate (remove self)
                        if(fac.x === dat.tileX && fac.y === dat.tileY){
                            const base = this.scene.buildings.find(b=>b.building.tileX === fac.x && b.building.tileY === fac.y)
                            base.setFrame(RCObjectType.Base)
                            base.building.type = RCObjectType.Base
                            base.pauseProduction()
                            this.gc()
                        }
                        else {
                            this.executeDroneMove(fac)
                        }
                    }
                break
                case RCUnitType.Defender:
                    //Can be ordered to generate a swarm. Also targets enemies in sight range with ranged attacks.
                    const target = this.calcVisibleObjects().find(c=>c.entity.droneType === RCUnitType.AncientSentry)
                    if(target) this.damageToTarget(target)
                    this.roam()
                break
                case RCUnitType.AncientSentry:
                    //Basically any mechanical runs this branch
                    //Same as defender ai with paramter mods
                    const target2 = this.calcVisibleObjects().find(c=>c.entity.droneType !== RCUnitType.AncientSentry)
                    if(target2) this.damageToTarget(target2)
                    this.roam()
                    //Sometimes drops lore when killed
                break
                case RCUnitType.LightCompactor:
                    if(dat.inventory.length === dat.maxInventory){
                        const player = store.getState().activeEncounter.players[0]
                        let missedDropoff = null
                        let removeResources = []
                        dat.inventory.forEach(i=>{
                            let base = getNearestDropoffForResource(this.scene.entities.filter(e=>e.entity.processesItems),i,dat)
                            if(base.tileX === dat.tileX && base.tileY === dat.tileY){
                                if(player.resources[i] !== undefined) {
                                    player.resources[i]++
                                }
                                this.floatResourceAndContinue(i)
                                removeResources.push(i)
                            }
                            else missedDropoff = base
                        })
                        removeResources.forEach(i=>{
                            dat.inventory.splice(dat.inventory.findIndex(inv=>inv===i), 1)
                        })

                        onUpdatePlayer(player)
                        if(missedDropoff){
                            return this.executeDroneMove(this.scene.map.getTileAt(missedDropoff.tileX, missedDropoff.tileY, false, 'ground'))
                        } 
                        return this.runUnitTick()
                    }
                    
                    //Head towards a revealed resource patch that you can extract:
                    const tileDat = this.scene.tiles[dat.tileX][dat.tileY]
                    const tilei = tileDat.toxins.findIndex(x=>this.scene.entities.find(e=>e.entity.processesItems?.includes(x)))
                    if(tilei!==-1){
                        let tox = tileDat.toxins.splice(tilei,1)
                        this.scene.checkObjectives()
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
                            this.scene.tiles[t.x][t.y].toxins.some(x=>
                                this.scene.entities.find(e=>e.entity.processesItems?.includes(x))
                                && this.scene.passableTile(t.x, t.y, dat)
                        ))
                        if(nextVisibleResource){
                            this.executeDroneMove(nextVisibleResource)
                        }
                        else {
                            this.scene.time.addEvent({
                                delay: 1000,
                                callback: this.runUnitTick
                            })
                        }
                    }
                break
            }
    }

    calcVisibleObjects = () => {
        const visibilityMap = getSightMap(this.entity.tileX, this.entity.tileY, this.entity.sight, this.scene.map)
        return this.scene.entities.filter(c=>c.entity.id !== this.entity.id).filter(c=>
            visibilityMap[c.entity.tileX] && visibilityMap[c.entity.tileX][c.entity.tileY]
        )
    }

    roam = () => {
        const dat = this.entity
        //Roam
        let x = Phaser.Math.Between(0,1)
        let y = Phaser.Math.Between(0,1)
        let candidate = {x: x===1 ?dat.tileX-1 : dat.tileX+1, y: y===1 ? dat.tileY-1 : dat.tileY+1}
        let t = this.scene.map.getTileAt(candidate.x, candidate.y, false, 'ground')
        if(t && this.scene.passableTile(t.x, t.y, dat)) this.executeDroneMove(t)
        else{
            this.scene.time.addEvent({
                delay: 1000,
                callback: this.runUnitTick
            })
        } 
    }

    executeDroneMove = (targetTile:Tilemaps.Tile) => {
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

    damageToTarget = (target:CharacterSprite) => {
        this.g.strokeLineShape(new Geom.Line(this.x, this.y, target.getCenter().x, target.getCenter().y))
        this.scene.time.addEvent({
            delay: 75,
            callback: ()=>{
                this.g.clear()
            },
            repeat:1
        })
        target.floatDamage(1, '0xff0000')
        this.scene.tweens.addCounter({
            from: 255,
            to: 0,
            duration: 700,
            onUpdate: (tween) => {
                var value = Math.floor(tween.getValue());
                target.setTintFill(Phaser.Display.Color.GetColor(value, 0, 0));
            },
            onComplete: () => {
                target.clearTint()
                target.entity.hp--
                if(target.entity.hp <= 0){
                    target.setVisible(false)
                    target.shouldDestroy = true
                    //Special case for processors since they don't run ai
                    if(target.entity.processesItems) target.gc()
                } 
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
        else this.reticle?.destroy()
    }

    setSwarmLeader(state:boolean){
        if(state){
            if(!this.entity.isSwarmLeader) this.swarmLeaderBadge = this.scene.add.image(this.x, this.y, 'sprites', RCObjectType.LeaderBadge).setScale(0.5)
            this.entity.isSwarmLeader = true
            this.entity.swarmLeaderId = ''
        }
        else{
            this.swarmLeaderBadge?.destroy()
            this.entity.isSwarmLeader = false
        } 
        onUpdateSelectedUnit(this.entity)
    }

    preUpdate(time, delta){
        this.anims.update(time, delta)
        this.reticle?.setPosition(this.x, this.y)
        this.swarmLeaderBadge?.setPosition(this.x, this.y)
    }

    destroy(){
        super.destroy()
        this.reticle?.destroy()
        this.swarmLeaderBadge?.destroy()
    }
}