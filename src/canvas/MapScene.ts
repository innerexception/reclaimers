import { Scene, GameObjects, Tilemaps, Game } from "phaser";
import { store } from "../../App";
import { defaults } from '../../assets/Assets'
import { Scenario, UIReducerActions, RCObjectType, RCUnitTypes, RCUnitType, Objectives } from "../../constants";
import CharacterSprite from "./CharacterSprite";
import { canAttractDrone, canPassTerrainType, getCircle, getNearestDrone, getSightMap, getToxinsOfTerrain, setSelectIconPosition, transitionIn, transitionOut } from "../util/Util";
import { onEncounterUpdated, onUpdateSelectedUnit, onShowModal, onShowTileInfo, onSelectedUnit, onSelectedBuilding, onUpdatePlayer } from "../uiManager/Thunks";
import AStar from "../util/AStar";
import BuildingSprite from "./BuildingSprite";
import { defaultDesigns, NPCData } from "../data/NPCData";
import { Scenarios } from "../data/Scenarios";

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
    entities: Array<CharacterSprite>
    targetingAbility: AbilityTargetingData
    mouseTarget: MouseTarget
    tiles: Array<Array<TileInfo>>
    buildings: Array<BuildingSprite>

    constructor(config){
        super(config)
        this.entities = []
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
                    if(this.initCompleted) this.initMap(engineEvent.data.map)
                    else this.waitForRender()
                break
                case UIReducerActions.LOGOUT:
                    transitionOut(this, 'map', ()=>transitionIn(this.scene.get('map')))
                break
                case UIReducerActions.SPAWN_BOT:
                    let bot = engineEvent.data.unit as RCUnit
                    bot.tileX = this.map.worldToTileX(engineEvent.data.building.x)
                    bot.tileY = this.map.worldToTileY(engineEvent.data.building.y)+1
                    this.spawnUnit(bot)
                break
                case UIReducerActions.ACTIVATE_ABILITY:
                    this.startTargetingAbility(engineEvent.data as Ability)
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
                    const leader = this.entities.find(e=>e.entity.id === engineEvent.data)
                    leader.setSwarmLeader(true)
                    const eligibleDrones = this.entities.filter(e=>canAttractDrone(leader.entity, e.entity))
                    const nextDrone = getNearestDrone(eligibleDrones, leader.entity)
                    if(nextDrone) nextDrone.swarmLeaderId = leader.entity.id
                break
                case UIReducerActions.UNGATHER:
                    const oldLeader = this.entities.find(e=>e.entity.id === engineEvent.data)
                    oldLeader.setSwarmLeader(false)
                    this.entities.forEach(e=>{
                        if(e.entity.swarmLeaderId === engineEvent.data) e.entity.swarmLeaderId = null
                    })
                break
            }
    }

    startTargetingAbility = (ability:Ability) => {
        if(this.targetingAbility){
            this.targetingAbility.selectedTargetIds.forEach(id=>this.entities.find(c=>c.entity.id===id).setTargeted(false))
            this.targetingAbility = null
        }
        this.targetingAbility = { type:ability.type, selectedTargetIds: [], validTargetIds: [] }
    }

    waitForRender = () => {
        if(!this.initCompleted)
            this.time.addEvent({
                delay: 500,
                callback: ()=>{
                    this.waitForRender()
                }
            })
        else this.initMap(store.getState().activeEncounter.map)
    }

    initMap = (encounter:Scenario) => {
        this.entities.forEach(e=>e.destroy())
        this.entities = []
        this.buildings.forEach(b=>b.destroy())
        this.buildings = []
        if(this.map) this.map.destroy()
        this.map = this.add.tilemap(encounter)
        let tiles = this.map.addTilesetImage('OverworldTileset_v03', 'tiles', 16,16) //1,2
        this.map.createDynamicLayer('ground', tiles)
        this.map.createStaticLayer('terrain', tiles)
        this.map.createDynamicLayer('objects', tiles)
        this.map.createDynamicLayer('fog', tiles).setDepth(3)
        
        let encounterData = store.getState().activeEncounter
        if(encounterData){
            this.map.setLayer('fog').forEachTile(t=>{
                t.index = RCObjectType.Fog+1
            })
            let otherDesigns = [NPCData[RCUnitType.Defender], NPCData[RCUnitType.HMProcessor], NPCData[RCUnitType.RIProcessor]]
            let base = this.getObjects(RCObjectType.Base)[0]
            this.carveFogOfWar(4, base.x, base.y)
            this.buildings.push(new BuildingSprite(this, base.getCenterX(), base.getCenterY(), RCObjectType.Base, base.x, base.y, defaultDesigns))
            this.getObjects(RCObjectType.InactiveFactory).forEach(b=>this.buildings.push(new BuildingSprite(this, b.getCenterX(), b.getCenterY(), RCObjectType.InactiveFactory, b.x, b.y, [otherDesigns.pop()])))
            this.getObjects(RCObjectType.WarFactory).forEach(b=>this.buildings.push(new BuildingSprite(this, b.getCenterX(), b.getCenterY(), RCObjectType.WarFactory, b.x, b.y, [otherDesigns.pop()])))
            
            //init terrain data
            let tileData = new Array<Array<TileInfo>>()
            this.map.setLayer('ground').forEachTile(t=>{
                if(!tileData[t.x]) tileData[t.x] = []
                tileData[t.x][t.y] = { toxins: getToxinsOfTerrain(t.index-1), type: t.index }
            })
            this.tiles = tileData
        }
        else {
            //We are loading the prelaunch hub
            //Run the intro landing tweens
        }
        
        this.cameras.main.setZoom(2)
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        
        let base = this.getObjects(RCObjectType.Base)[0]
        this.cameras.main.centerOn(base.getCenterX(), base.getCenterY())
        transitionIn(this)
    }

    passableTile = (tileX:number, tileY:number, unit:RCUnit) => {
        const tile = this.map.getTileAt(tileX, tileY, false, 'ground')
        if(tile){
            if(this.entities.find(c=>{
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

        //World map
        // let regionMap = this.make.tilemap({ key: 'map'})
        // let town1Tileset = regionMap.addTilesetImage('galletcity_tiles', 'city_packed')
        // regionMap.createStaticLayer('ocean', town1Tileset)
        // regionMap.createStaticLayer('ground', town1Tileset)
        // regionMap.createStaticLayer('region_sprites', town1Tileset)
        // let regionSprites = regionMap.createFromObjects('regions', 'region', { key: 'overlay_white', visible:true })
        // this.regionSprites = regionSprites.filter(rs=>findValue(rs.data, 'mapName')).map(r=>new RegionSprite(this, r.x,r.y,'overlay_white',r.displayWidth, r.displayHeight, r.data))

        this.g = this.add.graphics().setDepth(3)
        this.effects = this.add.group()
        this.initMap(Scenario.LightOfTheWorld)
        this.selectedTile = this.map.getTileAt(Math.round(this.map.width/2), Math.round(this.map.height/2), false, 'ground')
        this.selectIcon = this.add.image(this.selectedTile.x, this.selectedTile.y, 'selected').setDepth(5)
        
        // this.sounds = {
        //     border: this.sound.add('border'),
        //     tech: this.sound.add('tech'),
        // }
        
        RCUnitTypes.forEach(type=>{
            this.anims.create({
                key: type.toString(),
                frames: this.anims.generateFrameNumbers('bot-sprites', { start: type, end: type+6 }),
                frameRate: 4,
                repeat: -1
            });
        })
        
        this.add.tween({
            targets: [this.selectIcon],
            scale: 0.5,
            duration: 1000,
            repeat: -1,
            ease: 'Stepped',
            easeParams: [3],
            yoyo: true
        })
        
        this.input.mouse.disableContextMenu()
        // this.input.setDefaultCursor('url(assets/default.cur), pointer');

        this.input.on('pointermove', (event, gameObjects:Array<Phaser.GameObjects.GameObject>) => {
            const encounter = store.getState().activeEncounter
            if(!encounter) return
            let tile = this.map.getTileAtWorldXY(this.input.activePointer.worldX, this.input.activePointer.worldY, false, undefined, 'ground')
            if(tile || gameObjects.length > 0){
                if(gameObjects.length > 0) tile = this.map.getTileAtWorldXY((gameObjects[0] as any).x, (gameObjects[0] as any).y, false, undefined, 'ground')
                setSelectIconPosition(this, tile)
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
                if((GameObjects[0] as CharacterSprite).entity){
                    const entity = (GameObjects[0] as CharacterSprite).entity
                    if(entity.isAI) return 
                    if(state.selectedUnit) this.entities.find(e=>e.entity.id === state.selectedUnit.id).setTargeted(false)
                    if(state.selectedBuilding) this.buildings.find(e=>e.building.id === state.selectedBuilding.id).setTargeted(false)
                    this.entities.find(e=>e.entity.id === entity.id).setTargeted(true)
                    onSelectedUnit(entity)
                    this.mouseTarget = MouseTarget.MOVE
                    return
                } 
                else if((GameObjects[0] as BuildingSprite).building){
                    const building = (GameObjects[0] as BuildingSprite).building
                    if(state.selectedUnit) this.entities.find(e=>e.entity.id === state.selectedUnit.id).setTargeted(false)
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
            const unit = this.entities.find(e=>e.entity.id === state.selectedUnit.id)
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
            this.entities.find(e=>e.entity.id === state.selectedUnit.id).executeDroneMove(targetTile)
        }
    }

    onCompleteMove = (unit:RCUnit)=> {
        this.entities.find(e=>e.entity.id === unit.id)?.runUnitTick()
    }

    updateFogOfWar = () => {
        this.entities.filter(e=>!e.entity.isAI).forEach(c=>{const dat = c.entity; this.carveFogOfWar(dat.sight, dat.tileX, dat.tileY)})
    }

    carveFogOfWar = (radius:number, x:number, y:number) => {
        this.map.setLayer('fog')
        this.map.getTileAt(x, y).alpha = 0
        for(var i=radius; i>0; i--){
            getCircle(x, y, i).forEach(tuple=>{
                let tile = this.map.getTileAt(tuple[0], tuple[1])
                if(tile) tile.alpha = i === radius && tile.alpha === 1 ? 0.5 : 0
            })
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

    checkObjectives = () => {
        let scen = Scenarios.find(s=>s.scenario === store.getState().activeEncounter.map)
        scen.objectives.forEach((o:Objective)=>{
            switch(o.id){
                case Objectives.Purify20:
                    const p = store.getState().activeEncounter.player
                    let cleaned = []
                    this.tiles.forEach(trow=>trow.forEach(tcol=>{
                        if(tcol.type !== -1 && tcol.toxins.length <= 2)  cleaned.push(tcol)
                    }))
                    if(!p.completedObjectives.includes(Objectives.Purify20) && cleaned.length >= 20) {
                        p.completedObjectives.push(Objectives.Purify20)
                        onUpdatePlayer({...p})
                    }
                    break
            }
        })
    }

    spawnUnit = (unit:RCUnit) => {
        let tile = this.map.getTileAt(unit.tileX, unit.tileY, false, 'ground')
        this.entities.push(new CharacterSprite(this, tile.getCenterX(), tile.getCenterY(), unit.droneType, unit))
    }

    destroyUnit = (unitId:string) => {
        const i = this.entities.findIndex(u=>u.entity.id === unitId)
        this.entities.splice(i,1)[0].destroy()
    }
}