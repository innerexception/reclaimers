import { Scene, GameObjects, Tilemaps, Game } from "phaser";
import { store } from "../../App";
import { defaults } from '../../assets/Assets'
import { Scenario, UIReducerActions, RCObjectType, RCUnitTypes, RCDroneType, Objectives, RCAnimalTypes, TechnologyType } from "../../constants";
import DroneSprite from "./DroneSprite";
import { canAttractDrone, canPassTerrainType, getNearestDrone, getNewEncounter, getSightMap, getToxinsOfTerrain, setSelectIconPosition, transitionIn, transitionOut } from "../util/Util";
import { onShowTileInfo, onSelectedUnit, onSelectedBuilding, onUpdatePlayer } from "../uiManager/Thunks";
import AStar from "../util/AStar";
import BuildingSprite from "./BuildingSprite";
import { defaultDesigns, NPCData } from "../data/NPCData";
import { ObjectiveList, Scenarios } from "../data/Scenarios";
import AnimalSprite from "./AnimalSprite";

enum MouseTarget {
    NONE,MOVE
}

export default class MapScene extends Scene {

    unsubscribeRedux: Function
    effects: GameObjects.Group
    originDragPoint: Phaser.Math.Vector2
    selectIcon: GameObjects.Image
    selectedTile: Tilemaps.Tile
    map: Tilemaps.Tilemap
    g: GameObjects.Graphics
    initCompleted: boolean
    sounds: Object
    drones: Array<DroneSprite>
    animals: Array<AnimalSprite>
    mouseTarget: MouseTarget
    tiles: Array<Array<TileInfo>>
    buildings: Array<BuildingSprite>

    constructor(config){
        super(config)
        this.drones = []
        this.animals = []
        this.buildings = []
        this.unsubscribeRedux = store.subscribe(this.onReduxUpdate)
    }

    preload = () =>
    {
        defaults.forEach(asset=>{
            (this.load[asset.type] as any)(asset.key.toString(), asset.resource, asset.data)
        })
        console.log('assets were loaded.')
    }
    
    onReduxUpdate = () => {
        const uiState = store.getState()
        let engineEvent = uiState.engineEvent
        if(engineEvent)
            switch(engineEvent.action){
                case UIReducerActions.JOIN_ENCOUNTER:
                    if(this.initCompleted) this.initMap(engineEvent.data)
                    else this.waitForRender()
                break
                case UIReducerActions.LOGOUT:
                    this.saveState()
                    transitionOut(this, 'map', ()=>transitionIn(this.scene.get('map')))
                break
                case UIReducerActions.SPAWN_BOT:
                    let bot = engineEvent.data.unit as RCUnit
                    bot.tileX = this.map.worldToTileX(engineEvent.data.building.x)
                    bot.tileY = this.map.worldToTileY(engineEvent.data.building.y)+1
                    uiState.onlineAccount.technologies.forEach(t=>{
                        switch(t.type){
                            case TechnologyType.DefenderArmor:
                                if(bot.unitType === RCDroneType.Defender){
                                    bot.maxHp*=2
                                    bot.hp = bot.maxHp
                                }
                            break
                            case TechnologyType.DefenderWeapons:
                                if(bot.unitType === RCDroneType.Defender) bot.weaponLevel = 2
                            break
                            case TechnologyType.Jets:
                                if(bot.unitType === RCDroneType.Defender || bot.unitType === RCDroneType.Scout) bot.hover = true
                            break
                            case TechnologyType.ProcessingGroup1:
                            case TechnologyType.ProcessingGroup2:
                            case TechnologyType.ProcessingGroup3:
                                if(bot.unitType === RCDroneType.Processor) bot.processesItems = bot.processesItems.concat(t.extractItems)
                            break
                            case TechnologyType.Regeneration:
                                if(bot.unitType === RCDroneType.Ordinater) bot.regenerater = true
                            break
                        }
                    })
                    this.spawnUnit(bot)
                break
                case UIReducerActions.SELECT_DESTINATION:
                    this.mouseTarget = MouseTarget.MOVE
                break
                case UIReducerActions.CHANGE_PRODUCTION:
                    this.buildings.find(b=>b.building.id === uiState.selectedBuilding.id).resetProduction(engineEvent.data)
                break
                case UIReducerActions.PAUSE_PRODUCTION:
                    this.buildings.find(b=>b.building.id === uiState.selectedBuilding.id).pauseProduction()
                break
                case UIReducerActions.GATHER:
                    //add next closest drone
                    const leader = this.drones.find(e=>e.entity.id === engineEvent.data)
                    leader.setSwarmLeader(true)
                    const eligibleDrones = this.drones.filter(e=>canAttractDrone(leader.entity, e.entity))
                    const nextDrone = getNearestDrone(eligibleDrones, leader.entity)
                    if(nextDrone) nextDrone.swarmLeaderId = leader.entity.id
                break
                case UIReducerActions.UNGATHER:
                    const oldLeader = this.drones.find(e=>e.entity.id === engineEvent.data)
                    oldLeader.setSwarmLeader(false)
                    this.drones.forEach(e=>{
                        if(e.entity.swarmLeaderId === engineEvent.data) e.entity.swarmLeaderId = null
                    })
                break
            }
    }

    saveState = () => {
        const state = store.getState()
        this.map.setLayer('ground').forEachTile(t=>{
            this.tiles[t.x][t.y].type = t.index
        })
        let newState = {
            map: state.activeEncounter.map,
            tileData: this.tiles,
            entities: this.drones.map(e=>e.entity)
        }
        let player = state.onlineAccount
        let existing = player.savedState.findIndex(s=>s.map === state.activeEncounter.map)
        if(existing === -1){
            player.savedState.push({...newState})
        }
        else player.savedState[existing] = {...player.savedState[existing], ...newState}
        localStorage.setItem('rc_save', JSON.stringify(player))
        onUpdatePlayer({...player})
        this.tweens.getAllTweens().forEach(t=>{
            t.stop()
            t.targets?.forEach(t=>(t as any).destroy())
        })
        this.time.removeAllEvents()
    }

    waitForRender = () => {
        if(!this.initCompleted)
            this.time.addEvent({
                delay: 500,
                callback: ()=>{
                    this.waitForRender()
                }
            })
        else this.initMap(store.getState().activeEncounter)
    }

    initMap = (encounter:MapData) => {
        this.drones.forEach(e=>e.destroy())
        this.drones = []
        this.buildings.forEach(b=>b.destroy())
        this.buildings = []
        if(this.map) this.map.destroy()
        this.map = this.add.tilemap(encounter.map)
        let tiles = this.map.addTilesetImage('OverworldTileset_v03', 'tiles', 16,16) //1,2
        this.map.createDynamicLayer('ground', tiles)
        this.map.createStaticLayer('terrain', tiles)
        this.map.createDynamicLayer('objects', tiles)
        this.map.createDynamicLayer('fog', tiles).setDepth(3)

        //init terrain data
        if(encounter.tileData.length === 0){
            let tileData = new Array<Array<TileInfo>>()
            this.map.setLayer('ground').forEachTile(t=>{
                if(!tileData[t.x]) tileData[t.x] = []
                tileData[t.x][t.y] = { toxins: getToxinsOfTerrain(t.index-1), type: t.index, alpha: 1 }
            })
            this.tiles = tileData
            console.log('new tile data init...')
        }
        else{
            this.tiles = encounter.tileData
            this.map.setLayer('ground').forEachTile(t=>{
                t.index = this.tiles[t.x][t.y].type
            })
        } 

        this.map.setLayer('fog').forEachTile(t=>{
            t.index = RCObjectType.Fog+1
            t.alpha = this.tiles[t.x] && this.tiles[t.x][t.y]?.alpha
        })
        let otherDesigns = [NPCData[RCDroneType.Defender], NPCData[RCDroneType.Processor]]
        let bases = this.getObjects(RCObjectType.Base)
        bases.forEach(b=>{
            this.buildings.push(new BuildingSprite(this, b.getCenterX(), b.getCenterY(), RCObjectType.Base, b.x, b.y, defaultDesigns))
            this.carveFogOfWar(4, b.x, b.y)
        })
        this.getObjects(RCObjectType.InactiveFactory).forEach(b=>this.buildings.push(new BuildingSprite(this, b.getCenterX(), b.getCenterY(), RCObjectType.InactiveFactory, b.x, b.y, [otherDesigns.pop()])))
        this.getObjects(RCObjectType.WarFactory).forEach(b=>this.buildings.push(new BuildingSprite(this, b.getCenterX(), b.getCenterY(), RCObjectType.WarFactory, b.x, b.y, [otherDesigns.pop()])))
        this.getObjects(RCObjectType.InactiveLab).forEach(b=>this.buildings.push(new BuildingSprite(this, b.getCenterX(), b.getCenterY(), RCObjectType.InactiveLab, b.x, b.y, [])))
        
        encounter.entities.forEach(e=>{
            this.spawnUnit(e)
        })

        this.cameras.main.setZoom(3)
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        this.cameras.main.centerOn(bases[0].getCenterX(), bases[0].getCenterY())

        this.selectedTile = this.map.getTileAt(Math.round(this.map.width/2), Math.round(this.map.height/2), false, 'ground')
        this.selectIcon = this.add.image(this.selectedTile.x, this.selectedTile.y, 'selected').setDepth(5)
        this.add.tween({
            targets: [this.selectIcon],
            scale: 0.5,
            duration: 1000,
            repeat: -1,
            ease: 'Stepped',
            easeParams: [3],
            yoyo: true
        })

        this.time.addEvent({
            delay: 500,
            loop: true,
            callback: this.updateFogOfWar
        })

        transitionIn(this)
    }

    passableTile = (tileX:number, tileY:number, unit:RCUnit|RCAnimal) => {
        const tile = this.map.getTileAt(tileX, tileY, false, 'ground')
        if(tile){
            if(this.drones.find(c=>{
                const dat = c.entity
                if(dat.tileX === unit.tileX && dat.tileY === unit.tileY) return false
                return c.entity.id !== unit.id && dat.tileX === tileX && dat.tileY === tileY
            }))
                return false
            const terrain = this.map.getTileAt(tileX, tileY, false, 'terrain')
            if(terrain) return canPassTerrainType(unit, terrain.index)
            else return true
        }
        return false
    }

    create = () =>
    {
        this.g = this.add.graphics().setDepth(3)
        this.effects = this.add.group()
        this.initMap(getNewEncounter(Scenario.zone1))
        
        // this.sounds = {
        //     border: this.sound.add('border'),
        //     tech: this.sound.add('tech'),
        // }
        
        RCUnitTypes.forEach(type=>{
            this.anims.create({
                key: 'bot-sprites'+type,
                frames: this.anims.generateFrameNumbers('bot-sprites', { start: type, end: type+6 }),
                frameRate: 4,
                repeat: -1
            });
        })
        RCAnimalTypes.forEach(type=>{
            this.anims.create({
                key: type,
                frames: this.anims.generateFrameNumbers(type, { start: 0, end: 6 }),
                frameRate: 4,
                repeat: 1
            });
        })
        
        this.input.mouse.disableContextMenu()
        // this.input.setDefaultCursor('url(assets/default.cur), pointer');

        this.input.on('pointermove', (event, gameObjects:Array<Phaser.GameObjects.GameObject>) => {
            const encounter = store.getState().activeEncounter
            if(!encounter) return
            let tile = this.map.getTileAtWorldXY(this.input.activePointer.worldX, this.input.activePointer.worldY, false, undefined, 'ground')
            if(tile || gameObjects.length > 0){
                if(gameObjects.length > 0) this.selectIcon.setPosition((gameObjects[0] as any).x, (gameObjects[0] as any).y)
                else setSelectIconPosition(this, tile)
                const fog = this.map.getTileAt(tile.x, tile.y, false, 'fog')
                onShowTileInfo(this.tiles[tile.x][tile.y], fog.alpha !== 1)
            }
            else this.selectIcon.setVisible(false)

            if (this.game.input.activePointer.isDown) {
                if (this.originDragPoint) {
                    // move the camera by the amount the mouse has moved since last update
                    this.cameras.main.scrollX +=
                        1*(this.originDragPoint.x - this.game.input.activePointer.position.x);
                    this.cameras.main.scrollY +=
                        1*(this.originDragPoint.y - this.game.input.activePointer.position.y);
                } // set new drag origin to current position
                this.originDragPoint = this.game.input.activePointer.position.clone();
            } 
            else {
                this.originDragPoint = null;
            }
        })
        this.input.on('pointerdown', (event, GameObjects:Array<Phaser.GameObjects.GameObject>) => {
            const state = store.getState()
            if(!state.activeEncounter) return
            let object = this.map.getTileAtWorldXY(this.input.activePointer.worldX, this.input.activePointer.worldY, false, undefined, 'objects')
            if(GameObjects[0]){
                if((GameObjects[0] as DroneSprite).entity){
                    const entity = (GameObjects[0] as DroneSprite).entity
                    if(entity.isAI) return 
                    if(state.selectedUnit) this.drones.find(e=>e.entity.id === state.selectedUnit.id).setTargeted(false)
                    if(state.selectedBuilding) this.buildings.find(e=>e.building.id === state.selectedBuilding.id).setTargeted(false)
                    this.drones.find(e=>e.entity.id === entity.id).setTargeted(true)
                    onSelectedUnit(entity)
                    this.mouseTarget = MouseTarget.MOVE
                    return
                } 
                else if((GameObjects[0] as BuildingSprite).building){
                    const building = (GameObjects[0] as BuildingSprite).building
                    if(state.selectedUnit) this.drones.find(e=>e.entity.id === state.selectedUnit.id).setTargeted(false)
                    if(state.selectedBuilding) this.buildings.find(e=>e.building.id === state.selectedBuilding.id).setTargeted(false)
                    this.buildings.find(e=>e.building.id === building.id).setTargeted(true)
                    onSelectedBuilding(building)
                    return
                } 
            }
            else if(object){
                switch(object.index-1){
                }
            }
            //Try perform active action
            if(this.mouseTarget === MouseTarget.MOVE){
                let terrain = this.map.getTileAtWorldXY(this.input.activePointer.worldX, this.input.activePointer.worldY, false, undefined, 'terrain')
                if(!terrain) this.tryPerformMove()
            }
        })
        this.initCompleted = true
    }
    
    getObjects = (obj:RCObjectType) => {
        let bases = []
        this.map.setLayer('objects').forEachTile(t=>{
            if(t.index-1 === obj)
                bases.push(t)
        })
        return bases as Array<Tilemaps.Tile>
    }

    tryPerformMove = () => {
        const state = store.getState()
        let targetTile = this.map.getTileAtWorldXY(this.input.activePointer.worldX, this.input.activePointer.worldY, false, undefined, 'ground')
        if(targetTile && state.selectedUnit){
            const img = this.add.image(targetTile.getCenterX(), targetTile.getCenterY(), 'selected').setTint(0x00ff00).setDepth(5)
            const unit = this.drones.find(e=>e.entity.id === state.selectedUnit.id)
            const dat = unit.entity
            const tile = this.map.getTileAtWorldXY(unit.x, unit.y, false, undefined, 'ground')
            const path = new AStar(targetTile.x, targetTile.y, (tileX,tileY)=>this.passableTile(tileX, tileY, dat)).compute(tile.x, tile.y)
            if(path.length === 0) img.setTint(0xff0000)        
            this.tweens.add({
                targets: img,
                alpha: 0,
                duration: 500,
                onComplete: ()=>img.destroy()
            })
            this.drones.find(e=>e.entity.id === state.selectedUnit.id).executeMove(targetTile)
        }
    }

    updateFogOfWar = () => {
        console.log('fog update')
        this.map.setLayer('fog').forEachTile(t=>{
            if(t.alpha === 0) t.alpha = 0.5
        })
        this.drones.filter(e=>!e.entity.isAI).forEach(c=>{const dat = c.entity; this.carveFogOfWar(dat.sight, dat.tileX, dat.tileY)})
        this.buildings.filter(b=>b.building.type === RCObjectType.Base).forEach(b=>{
            this.carveFogOfWar(4, b.building.tileX, b.building.tileY)
        })
    }

    carveFogOfWar = (radius:number, x:number, y:number) => {
        this.map.getTileAt(x, y).alpha = 0
        let arry = getSightMap(x, y, radius, this.map)
        for(let i=0; i<arry.length;i++){
            if(arry[i]){
                for(let j=0; j<arry[i].length;j++){
                    if(arry[i][j]){
                        const t = this.map.getTileAt(i,j)
                        if(t){
                            t.alpha = i === radius && t.alpha === 1 ? 0.5 : 0
                            this.tiles[i][j].alpha = t.alpha
                        }
                    } 
                }
            }
        }

    }

    getVisibleTiles = (unit:RCUnit, layer:string) => {
        let arry = getSightMap(unit.tileX, unit.tileY, unit.sight, this.map)
        let tiles = new Array<Tilemaps.Tile>()
        for(let i=0; i<arry.length;i++){
            if(arry[i]){
                for(let j=0; j<arry[i].length;j++){
                    if(arry[i][j]){
                        const t = this.map.getTileAt(i,j,false,layer)
                        if(t && t.alpha === 1)
                            tiles.push(t)
                    } 
                }
            }
        }
        return tiles.filter(t=>t ? true : false)
    }

    spawnUnit = (unit:RCUnit) => {
        let tile = this.map.getTileAt(unit.tileX, unit.tileY, false, 'ground')
        this.drones.push(new DroneSprite(this, tile.getCenterX(), tile.getCenterY(), unit.unitType, unit))
    }

    spawnAnimal = (unit:RCAnimal) => {
        let tile = this.map.getTileAt(unit.tileX, unit.tileY, false, 'ground')
        this.animals.push(new AnimalSprite(this, tile.getCenterX(), tile.getCenterY(), unit))
    }
}