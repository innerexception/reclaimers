import { GameObjects, Tweens, Tilemaps, Geom } from "phaser";
import { store } from "../../App";
import { FONT_DEFAULT, Modal, RCObjectType, RCDroneType, TerrainLevels, TileEvents, RCAnimalTypes, TechnologyType, RCUnitTypes, ItemType, Objectives } from '../../constants'
import MapScene from "./MapScene";
import { onUpdateSelectedUnit, onUpdatePlayer, unSelectedUnit, onShowModal, onDiscoverPlayerTech } from "../uiManager/Thunks";
import AStar from "../util/AStar";
import { addObjective, getAnimalFromData, getNearestDropoffForResource, getNextTechnology, getSightMap, getUnitFromData, shuffle, getCircle } from "../util/Util";
import { CreatureData, NPCData } from "../data/NPCData";

export default class DroneSprite extends GameObjects.Sprite {

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
        this.g.lineStyle(1, 0xff00ff, 1)
        this.setDepth(2)
        this.entity = character
        this.setDisplaySize(16,16)
        this.play('bot-sprites'+character.unitType)
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
        this.scene?.drones.forEach(e=>{
            if(e.entity.swarmLeaderId === this.entity.id) e.entity.swarmLeaderId=''
        })
        this.scene?.drones.splice(this.scene.drones.findIndex(e=>e.entity.id===this.entity.id), 1)
        this.destroy()
    }

    runUnitTick = () => {
        if(this.shouldDestroy){
            this.gc()
            return
        }
        let dat = this.entity
        if(this.entity.isAI){
            const tile = this.scene.map.getTileAt(dat.tileX, dat.tileY, false, 'fog')
            if(tile && tile.alpha !== 0) this.setVisible(false)
            else this.setVisible(true)
        }
        onUpdateSelectedUnit(dat)
        switch(dat.unitType){
                case RCDroneType.Scout:
                    //Check if on an event tile we have not triggered
                    const tile = this.scene.map.getTileAt(dat.tileX, dat.tileY, false, 'objects')
                    if(tile){
                        const e = TileEvents[tile.index-1]
                        const player = store.getState().onlineAccount
                        if(e?.objective && !player.completedObjectives.includes(e.objective)){
                            onShowModal(Modal.Dialog, e)
                            addObjective(e.objective, player)
                            if(e.rewards){
                                this.scene.buildings.forEach(b=>{
                                    if(b.building.type === RCObjectType.Base){
                                        e.rewards.forEach(d=>{
                                            b.building.availableDroneDesigns.push(NPCData[d])
                                        })
                                    }
                                })
                            }
                            return this.waitOne()
                        }
                        if(e?.enemy){
                            this.scene.spawnUnit({...getUnitFromData(NPCData[e.enemy]), tileX: tile.x, tileY: tile.y})
                        }
                    }
                    // //Head towards the fog
                    // const fogTiles = this.scene.getVisibleTiles(dat, 'fog')
                    // const nextVisible = fogTiles.find(t=>t.alpha === 1 && this.scene.passableTile(t.x, t.y, this.entity))
                    // if(nextVisible){
                    //     this.executeMove(nextVisible)
                    // }
                    // else {
                    //     this.roam()
                    // }
                break
                case RCDroneType.Ordinater:
                    //1. Check if dormant factory in sight range
                    const visibleTiles = this.scene.getVisibleTiles(dat, 'ground')
                    const fac = visibleTiles.find(t=>this.scene.buildings
                        .find(b=>(b.building.type === RCObjectType.WarFactory || b.building.type === RCObjectType.InactiveFactory || b.building.type === RCObjectType.InactiveLab)
                            && b.building.tileX === t.x && b.building.tileY === t.y))
                    //2. If so, move towards. 
                    if(fac){
                        //If on top of, merge with it to activate (remove self)
                        if(fac.x === dat.tileX && fac.y === dat.tileY){
                            const base = this.scene.buildings.find(b=>b.building.tileX === fac.x && b.building.tileY === fac.y)
                            if(base.building.type === RCObjectType.InactiveLab){
                                base.setFrame(RCObjectType.Lab)
                                base.building.type = RCObjectType.Lab
                                onDiscoverPlayerTech(getNextTechnology(store.getState().onlineAccount))
                            } 
                            else {
                                let p = store.getState().onlineAccount
                                if(base.building.type === RCObjectType.InactiveFactory){
                                    addObjective(Objectives.BaseConverted, p)
                                }
                                if(base.building.type === RCObjectType.WarFactory){
                                    addObjective(Objectives.ForbiddenFactoryConverted, p)
                                }
                                base.setFrame(RCObjectType.Base)
                                base.building.type = RCObjectType.Base
                            }
                            base.pauseProduction()
                            this.gc()
                        }
                        else {
                            this.executeMove(fac)
                        }
                    }
                break
                case RCDroneType.Defender:
                    //Can be ordered to generate a swarm. Also targets enemies in sight range with ranged attacks.
                    const target = this.calcVisibleDrones().find(c=>c.entity.isAI)
                    if(target && target.entity.unitType !== RCDroneType.RedSentry) this.damageToTarget(target)
                    else if(target && this.entity.weaponLevel === 2) this.damageToTarget(target)
                    else {
                        const visibleTiles = this.scene.getVisibleTiles(dat, 'objects')
                        const rock = visibleTiles.find(t=>t.index-1 === ItemType.Rock)
                        if(rock){
                            rock.index = -1
                            //TODO, shoot laser
                        }
                    }
                    this.roam()
                break
                case RCDroneType.AncientSentry:
                case RCDroneType.RedSentry:
                    //Basically any mechanical runs this branch
                    //Same as defender ai with paramter mods
                    const target2 = this.calcVisibleDrones().find(c=>!c.entity.isAI)
                    if(target2) this.damageToTarget(target2)
                    this.roam()
                    //Sometimes drops lore when killed
                break
                case RCDroneType.MonumentBuilder:
                    //As long as a valid tile exists,
                    //Drops a monument tile at least 1 away from any other monument tile
                    let t = this.scene.map.getTileAt(dat.tileX, dat.tileY, false, 'ground')
                    if(t.index-1 !== RCObjectType.Monument) this.scene.spawnBuilding(t, RCObjectType.Monument)

                    let monumentTarget
                    getCircle(dat.tileX, dat.tileY, 2, 4).forEach(tuple=>{
                        let t = this.scene.map.getTileAt(tuple[0], tuple[1], false, 'ground')
                        if(t.index-1 !== RCObjectType.Monument) monumentTarget = t
                    })
                    if(monumentTarget) this.executeMove(monumentTarget)
                break
                case RCDroneType.ToxinExtractor:
                    if(dat.inventory.length === dat.maxInventory){
                        const player = store.getState().onlineAccount
                        let missedDropoff = null
                        let removeResources = []
                        dat.inventory.forEach(i=>{
                            let base = getNearestDropoffForResource(this.scene.drones.filter(e=>e.entity.processesItems),i,dat)
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
                            return this.executeMove(this.scene.map.getTileAt(missedDropoff.tileX, missedDropoff.tileY, false, 'ground'))
                        } 
                        return this.runUnitTick()
                    }
                    
                    //Head towards a revealed resource patch that you can extract:
                    const tileDat = this.scene.tiles[dat.tileX][dat.tileY]
                    const tilei = tileDat.toxins.findIndex(x=>this.scene.drones.find(e=>e.entity.processesItems?.includes(x)))
                    if(tilei!==-1){
                        let tox = tileDat.toxins.splice(tilei,1)
                        
                        const p = store.getState().onlineAccount
                        p.cleanedTileCount++
                        const mapState = p.savedState.find(s=>s.map === store.getState().activeEncounter.map)
                        mapState.cleanedTileCount++
                        if(p.cleanedTileCount >= 20) addObjective(Objectives.Purify20, p)
                        if(p.cleanedTileCount >= 1000) addObjective(Objectives.PurifyWorld, p)
                        onUpdatePlayer({...p})

                        dat.inventory.push(tox[0])
                        const tile = this.scene.map.getTileAt(dat.tileX, dat.tileY, false, 'ground') 
                        const toxLength = tileDat.toxins.length
                        if(toxLength < 3){
                            if(TerrainLevels[tileDat.type-1]){
                                tile.index = TerrainLevels[tileDat.type-1][toxLength]+1
                                if(Phaser.Math.Between(0, 25)===1){
                                    const type = RCAnimalTypes[Phaser.Math.Between(0,RCAnimalTypes.length-1)]
                                    this.scene.spawnAnimal(getAnimalFromData(tile.x, tile.y, CreatureData[type]))
                                }
                            }
                        }
                        this.floatResourceAndContinue(tox[0], this.runUnitTick)
                    }
                    else {
                        const visibleTiles = this.scene.getVisibleTiles(dat, 'ground')
                        const nextVisibleResource = shuffle(visibleTiles).find(t=>
                            this.scene.tiles[t.x][t.y].toxins.some(x=>
                                this.scene.drones.find(e=>e.entity.processesItems?.includes(x))
                                && this.scene.passableTile(t.x, t.y, dat)
                        ))
                        if(nextVisibleResource){
                            this.executeMove(nextVisibleResource)
                        }
                        else {
                            this.waitOne()
                        }
                    }
                break
            }
    }

    waitOne = () => {
        this.scene.time.addEvent({
            delay: 1000,
            callback: this.runUnitTick
        })
    }

    calcVisibleDrones = () => {
        const visibilityMap = getSightMap(this.entity.tileX, this.entity.tileY, this.entity.sight, this.scene.map)
        return this.scene.drones.filter(c=>c.entity.id !== this.entity.id).filter(c=>
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
        if(t && this.scene.passableTile(t.x, t.y, dat)) this.executeMove(t)
        else{
            this.waitOne()
        } 
    }

    executeMove = (targetTile:Tilemaps.Tile) => {
        const dat = this.entity
        let path = new AStar(targetTile.x, targetTile.y, (tileX,tileY)=>this.scene.passableTile(tileX, tileY, dat)).compute(dat.tileX, dat.tileY)
        
        if(dat.swarmLeaderId){
            //if more than 3 tiles from leader, move towards leader
            const leader = this.scene.drones.find(c=>c.entity.id === dat.swarmLeaderId)
            const dist = Phaser.Math.Distance.Between(leader.entity.tileX, leader.entity.tileY, dat.tileX, dat.tileY)
            if(dist > 3){
                path = new AStar(leader.entity.tileX, leader.entity.tileY, (tileX,tileY)=>this.scene.passableTile(tileX, tileY, dat)).compute(dat.tileX, dat.tileY)
            }
        }
              
        if(path.length === 0){
            //This unit is currently blocked and has no valid movement path, so we wait one and see if we are unblocked
            this.waitOne()
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
                        }
                    }
                }),
                onComplete: ()=>{
                    const pos = path[path.length-1]
                    let dat = this.entity
                    dat.tileX = pos.x
                    dat.tileY = pos.y
                    onUpdateSelectedUnit(dat)
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

    damageToTarget = (target:DroneSprite) => {
        if(this.entity.weaponLevel === 2) this.g.lineStyle(1, 0xff0000, 1)
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