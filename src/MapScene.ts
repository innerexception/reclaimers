import { Scene, GameObjects, Tilemaps, Game } from "phaser";
import { store } from "../App";
import { defaults } from '../assets/Assets'
import { v4 } from "uuid";
import { AbilityType, MAX_TURN_TIMER, Modal, RCUnitType, Objects, Scenario, StatusEffect, UIReducerActions, RCObjectType, RCUnitTypes, TerrainType } from "../constants";
import CharacterSprite from "./CharacterSprite";
import { canPassTerrainType, getCircle, getSightMap, getToxinsOfTerrain, setSelectIconPosition } from "./util/Util";
import { onClearActiveAbility, onEncounterUpdated, onUpdateSelectedUnit, onShowModal, onShowTileInfo, onSelectedUnit } from "./uiManager/Thunks";
import AStar from "./util/AStar";

enum MouseTarget {
    NONE,MOVE,PYLON
}

export default class MapScene extends Scene {

    unsubscribeRedux: Function
    effects: GameObjects.Group
    selectIcon: GameObjects.Image
    activeIcon: GameObjects.Image
    selectedTile: Tilemaps.Tile
    map: Tilemaps.Tilemap
    g: GameObjects.Graphics
    initCompleted: boolean
    unitText: GameObjects.Text
    sounds: Object
    origDragPoint: Phaser.Math.Vector2
    entities: Array<CharacterSprite>
    targetingAbility: AbilityTargetingData
    mouseTarget: MouseTarget
    pylonPreview: GameObjects.Sprite
    activeUnit: GameObjects.Sprite
    tiles: Array<Array<TileInfo>>
    selectedSpawn: BuildingSprite

    constructor(config){
        super(config)
        this.entities = []
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
                case UIReducerActions.SPAWN_BOT:
                    let bot = engineEvent.data as RCUnit
                    bot.tileX = this.selectedSpawn.x
                    bot.tileY = this.selectedSpawn.y+1
                    this.spawnUnit(bot)
                break
                case UIReducerActions.SET_PRODUCTION:
                    this.selectedSpawn.activeDesign = engineEvent.data as RCUnit
                    this.selectedSpawn.spawnTimer = 60
                break
                case UIReducerActions.ACTIVATE_ABILITY:
                    this.startTargetingAbility(engineEvent.data as Ability)
                break
                case UIReducerActions.SELECT_UNIT:
                    this.activeUnit = this.entities.find(e=>e.entity.id === engineEvent.data)
                break
                case UIReducerActions.SELECT_DESTINATION:
                    this.mouseTarget = MouseTarget.MOVE
                break
                case UIReducerActions.BUILD_PYLON:
                    this.mouseTarget = MouseTarget.PYLON
                    this.pylonPreview.setVisible(true)
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
        if(this.map) this.map.destroy()
        this.map = this.add.tilemap(encounter)
        let tiles = this.map.addTilesetImage('OverworldTileset_v03', 'tiles', 16,16) //1,2
        this.map.createDynamicLayer('ground', tiles)
        this.map.createStaticLayer('terrain', tiles)
        this.map.createDynamicLayer('objects', tiles)
        this.map.createDynamicLayer('fog', tiles)
        
        let encounterData = store.getState().activeEncounter
        if(encounterData){
            //Just restore the data
            // encounterData.entities.forEach(c=>{
            //     let t = this.map.getTileAt(c.tileX, c.tileY, false, 'ground')
            //     this.entities.push(new CharacterSprite(this, t.getCenterX(), t.getCenterY(), c.avatarIndex, c))
            // })
            this.map.setLayer('fog').forEachTile(t=>{
                t.index = RCObjectType.Fog+1
            })
            let base = this.map.setLayer('objects').findTile(t=>t.index-1 === RCObjectType.Base)
            this.carveFogOfWar(4, base.x, base.y)
            //init terrain data
            let tileData = new Array<Array<TileInfo>>()
            this.map.setLayer('ground').forEachTile(t=>{
                if(!tileData[t.x]) tileData[t.x] = []
                tileData[t.x][t.y] = { toxins: getToxinsOfTerrain(t.index-1), type: t.index }
            })
            this.tiles = tileData
            onEncounterUpdated(encounterData)
        }
        else {
            //We are loading the prelaunch hub
            //Run the intro landing tweens
        }
        
        this.cameras.main.setZoom(2)
        // this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        
        let base = this.map.setLayer('objects').findTile(t=>t.index-1 === RCObjectType.Base)
        this.cameras.main.centerOn(base.getCenterX(), base.getCenterY())
    }

    passableTile = (tileX:number, tileY:number, unit:RCUnit) => {
        const tile = this.map.getTileAt(tileX, tileY, false, 'ground')
        if(tile){
            if(this.entities.find(c=>{
                if(c.entity.tileX === unit.tileX && c.entity.tileY === unit.tileY) return false
                return c.entity.id !== unit.id && c.entity.tileX === tileX && c.entity.tileY === tileY
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
        this.pylonPreview = this.add.sprite(0,0,'sprites',RCObjectType.Base).setAlpha(0.5).setVisible(false).setDepth(3)
        this.initMap(Scenario.Hub)
        this.selectedTile = this.map.getTileAt(Math.round(this.map.width/2), Math.round(this.map.height/2), false, 'ground')
        this.selectIcon = this.add.image(this.selectedTile.x, this.selectedTile.y, 'selected').setDepth(3)
        this.activeIcon = this.add.image(this.selectedTile.x, this.selectedTile.y, 'selected').setDepth(3)
        
        // this.sounds = {
        //     border: this.sound.add('border'),
        //     tech: this.sound.add('tech'),
        // }
        
        //TODO: preload all ability animations
        RCUnitTypes.forEach(type=>{
            this.anims.create({
                key: type.toString(),
                frames: this.anims.generateFrameNumbers('bot-sprites', { start: type, end: type+6 }),
                frameRate: 4,
                repeat: -1
            });
        })
        
        this.add.tween({
            targets: [this.selectIcon, this.activeIcon],
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
            if(this.mouseTarget === MouseTarget.PYLON && tile){
                this.pylonPreview.setPosition(tile.getCenterX(), tile.getCenterY())
                const obstruction = this.map.getTileAt(tile.x, tile.y, false, 'terrain')
                if(obstruction){
                    this.pylonPreview.setTint(0xff0000)
                }
                else this.pylonPreview.setTint(0x00ff00)
            }
        })
        this.input.on('pointerdown', (event, GameObjects:Array<Phaser.GameObjects.GameObject>) => {
            const state = store.getState()
            if(!state.activeEncounter) return
            let object = this.map.getTileAtWorldXY(this.input.activePointer.worldX, this.input.activePointer.worldY, false, undefined, 'objects')
            //Try perform active action
            if(this.mouseTarget === MouseTarget.MOVE){
                this.tryPerformMove()
            }
            if(this.mouseTarget === MouseTarget.PYLON){
                this.tryPlacePylon(this.map.getTileAtWorldXY(this.input.activePointer.worldX, this.input.activePointer.worldY, false, undefined, 'ground'))
            }
            if(GameObjects[0]){
                onSelectedUnit((GameObjects[0] as CharacterSprite).entity)
            }
            else if(object){
                switch(object.index-1){
                    case RCObjectType.Base: 
                        this.selectedSpawn = object
                        onShowModal(Modal.BotSpawn)
                    break
                }
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

    tryPlacePylon = (targetTile:Tilemaps.Tile) => {
        this.map.putTileAt(RCObjectType.Base+1, targetTile.x, targetTile.y, false, 'objects')
        this.mouseTarget = MouseTarget.NONE
        this.pylonPreview.setVisible(false)
    }

    tryPerformMove = () => {
        const state = store.getState()
        this.mouseTarget = MouseTarget.NONE
        let targetTile = this.map.getTileAtWorldXY(this.input.activePointer.worldX, this.input.activePointer.worldY, false, undefined, 'ground')
        
        const img = this.add.image(targetTile.getCenterX(), targetTile.getCenterY(), 'selected').setTint(0x00ff00)
        const unit = this.entities.find(e=>e.entity.id === state.selectedUnit.id)
        const tile = this.map.getTileAtWorldXY(unit.x, unit.y, false, undefined, 'ground')
        const path = new AStar(targetTile.x, targetTile.y, (tileX,tileY)=>this.passableTile(tileX, tileY, unit.entity)).compute(tile.x, tile.y)
        if(path.length > unit.entity.moves) img.setTint(0xff0000)        
        this.tweens.add({
            targets: img,
            alpha: 0,
            duration: 500,
            onComplete: ()=>img.destroy()
        })
        this.entities.find(e=>e.entity.id === state.selectedUnit.id).executeCharacterMove(state.selectedUnit.id, targetTile)
    }

    executeCharacterAbility = (targetingData:AbilityTargetingData, casterId:string) => {
        // let encounter = store.getState().activeEncounter
        // const caster = encounter.entities.find(p=>p.id === casterId)
        // targetingData.selectedTargetIds.forEach(id=>{
        //     const char = this.entities.find(c=>c.characterId === id)
        //     this.effects.get(char.x, char.y, 'sprites').play(targetingData.type.toString())
        // })
        // this.time.addEvent({
        //     delay:1000,
        //     callback: () => {
        //         encounter = resolveAbility(encounter, AbilityData.find(a=>a.type === targetingData.type), targetingData.selectedTargetIds, this.entities, caster)
        //         this.nextCharacterTurn(encounter)
        //     }
        // })
    }

    onCompleteMove = (characterId:string)=> {
        let unit = this.entities.find(e=>e.entity.id === characterId)
        let base = this.getObjects(RCObjectType.Base)[0]
        if(base.x===unit.entity.tileX && base.y===unit.entity.tileY){
            unit.entity.moves = unit.entity.maxMoves
            //onAddEventLog(unit.entity.name+' is recharging...')
        }
        this.entities.find(e=>e.entity.id === characterId).runUnitTick()
    }

    calcVisibleObjects = (encounter:Encounter) => {
        // let me = encounter.entities.find(c=>store.getState().onlineAccount.characters.find(ch=>ch.id===c.id))
        // const visibilityMap = getSightMap(me, this.map)
        // this.entities.filter(c=>c.characterId !== me.id).forEach(c=>{
        //     const char = encounter.entities.find(ch=>c.characterId === ch.id)
        //     if(visibilityMap[char.currentStatus.tileX] && visibilityMap[char.currentStatus.tileX][char.currentStatus.tileY]){
        //         c.setVisible(true)
        //         if(Math.abs(char.currentStatus.tileX - char.currentStatus.tileX) === char.sight || Math.abs(char.currentStatus.tileY - char.currentStatus.tileY) === char.sight){
        //             c.setAlpha(0.5)
        //         }
        //         else c.setAlpha(1)
        //     }
        //     else c.setVisible(false)
        // })
    }

    updateFogOfWar = () => {
        this.entities.forEach(c=>this.carveFogOfWar(c.entity.sight, c.entity.tileX, c.entity.tileY))
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
                        if(t.alpha === 1)
                            tiles.push(t)
                    } 
                }
            }
        }
        return tiles.filter(t=>t ? true : false)
    }

    spawnUnit = (unit:RCUnit) => {
        let tile = this.map.getTileAt(unit.tileX, unit.tileY, false, 'ground')
        this.entities.push(new CharacterSprite(this, tile.getCenterX(), tile.getCenterY(), unit.avatarIndex, unit))
        this.selectedSpawn = null
    }

    destroyUnit = (unitId:string) => {
        const i = this.entities.findIndex(u=>u.entity.id === unitId)
        this.entities.splice(i,1)[0].destroy()
    }

    update(){
        if(this.activeUnit) this.activeIcon.setPosition(this.activeUnit.x, this.activeUnit.y)
    }
}