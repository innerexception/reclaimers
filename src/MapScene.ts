import { Scene, GameObjects, Tilemaps } from "phaser";
import { store } from "../App";
import { defaults } from '../assets/Assets'
import { v4 } from "uuid";
import { AbilityType, MAX_TURN_TIMER, Modal, RCUnitType, Objects, Scenario, StatusEffect, UIReducerActions, RCObjectType } from "../constants";
import CharacterSprite from "./CharacterSprite";
import { canPassTerrainType, getCircle, getSightMap, setSelectIconPosition } from "./util/Util";
import { onClearActiveAbility, onEncounterUpdated, onShowModal } from "./uiManager/Thunks";
import { AbilityData } from "./data/Abilities";
import AStar from "./util/AStar";
import Network from "../firebase/Network";
import { resolveAbility, networkExecuteCharacterAbility, networkExecuteCharacterMove, resolveStatusEffects } from "./util/Abilities";
import ObjectSprite from "./ObjectSprite";
export default class MapScene extends Scene {

    unsubscribeRedux: Function
    effects: GameObjects.Group
    selectIcon: GameObjects.Image
    selectedTile: Tilemaps.Tile
    map: Tilemaps.Tilemap
    g: GameObjects.Graphics
    initCompleted: boolean
    unitText: GameObjects.Text
    sounds: Object
    origDragPoint: Phaser.Math.Vector2
    entities: Array<CharacterSprite|ObjectSprite>
    targetingAbility: AbilityTargetingData

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
                case UIReducerActions.ENCOUNTER_UPDATED:
                    this.redrawMap(engineEvent.data)
                break
                case UIReducerActions.SPAWN_BOT:
                    let bot = engineEvent.data as RCUnit
                    this.map.setLayer('objects').forEachTile(t=>{
                        if(t.index-1 === RCObjectType.Base){
                            bot.tileX = t.x
                            bot.tileY = t.y+1
                        }
                    })
                    uiState.activeEncounter.entities.push(bot)
                    onEncounterUpdated(uiState.activeEncounter)
                break
                case UIReducerActions.ACTIVATE_ABILITY:
                    this.startTargetingAbility(engineEvent.data as Ability)
                break
            }
    }

    startTargetingAbility = (ability:Ability) => {
        if(this.targetingAbility){
            this.targetingAbility.selectedTargetIds.forEach(id=>this.entities.find(c=>c.characterId===id).setTargeted(false))
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
        this.map.createStaticLayer('ground', tiles)
        this.map.createStaticLayer('terrain', tiles)
        this.map.createStaticLayer('objects', tiles)
        this.map.createDynamicLayer('fog', tiles)
        
        let encounterData = store.getState().activeEncounter
        if(encounterData){
            //Just restore the data
            encounterData.entities.forEach(c=>{
                let t = this.map.getTileAt(c.tileX, c.tileY, false, 'ground')
                this.entities.push(new CharacterSprite(this, t.getCenterX(), t.getCenterY(), c.avatarIndex, c))
            })
            this.map.setLayer('fog').forEachTile(t=>{
                t.index = RCObjectType.Fog+1
            })
            this.map.setLayer('objects').forEachTile(t=>{
                if(t.index-1 === RCObjectType.Base)
                    this.carveFogOfWar(4, t.x, t.y)
            })
            Network.upsertMatch(encounterData)
        }
        else {
            //We are loading the prelaunch hub
            //Run the intro landing tweens
        }
        
        this.cameras.main.setZoom(2)
        // this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        
        // const base = this.entities.find(c=>c.characterId === encounterData.entities.find(e=>e.avatarIndex === RCObjectType.Base).id)
        this.map.setLayer('objects').forEachTile(t=>{
            if(t.index-1 === RCObjectType.Base)
                this.cameras.main.centerOn(t.getCenterX(), t.getCenterY())
        })
        
    }

    passableTile = (tileX:number, tileY:number, unit:RCUnit, encounter:Encounter) => {
        const tile = this.map.getTileAt(tileX, tileY, false, 'ground')
        if(tile){
            if(encounter.entities.find(c=>c.tileX === tileX && c.tileY === tileY))
                return false
            return canPassTerrainType(unit, this.map.getTileAt(tileX, tileY, false, 'terrain').index)
        }
        return false
    }

    create = () =>
    {
        this.g = this.add.graphics().setDepth(3)
        this.effects = this.add.group()
        this.initMap(Scenario.Hub)
        this.selectedTile = this.map.getTileAt(Math.round(this.map.width/2), Math.round(this.map.height/2), false, 'ground')
        this.selectIcon = this.add.image(this.selectedTile.x, this.selectedTile.y, 'selected').setDepth(3)
        
        // this.sounds = {
        //     border: this.sound.add('border'),
        //     tech: this.sound.add('tech'),
        // }
        
        //TODO: preload all ability animations
        AbilityData.forEach(a=>{
            this.anims.create({
                key: a.type.toString(),
                frames: this.anims.generateFrameNumbers('sprites', { start: a.startFrame, end: a.endFrame }),
                frameRate: 4,
                hideOnComplete: true,
            });
        })
        
        this.add.tween({
            targets: this.selectIcon,
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
            let tile = this.map.getTileAtWorldXY(this.input.activePointer.worldX, this.input.activePointer.worldY, false, undefined, 'objects')
            if(tile || gameObjects.length > 0){
                if(gameObjects.length > 0) tile = this.map.getTileAtWorldXY((gameObjects[0] as any).x, (gameObjects[0] as any).y, false, undefined, 'ground')
                setSelectIconPosition(this, tile)
            }
            else this.selectIcon.setVisible(false)
            // if(store.getState().activeAbility?.type === AbilityType.Move){
            //     let terrain = this.map.getTileAtWorldXY(this.input.activePointer.worldX, this.input.activePointer.worldY, false, undefined, 'terrain')
            //     let ground = this.map.getTileAtWorldXY(this.input.activePointer.worldX, this.input.activePointer.worldY, false, undefined, 'ground')
            //     if(gameObjects.length > 0) ground = this.map.getTileAtWorldXY((gameObjects[0] as any).x, (gameObjects[0] as any).y, false, undefined, 'ground')
            //     if(ground){
            //         if(this.selectIcon.x !== ground.getCenterX() || this.selectIcon.y !== ground.getCenterY()){
            //             const state = store.getState()
            //             let me = state.activeEncounter.entities.find(c=>c.id === state.activeEncounter.activeCharacterId)
            //             const path = new AStar(ground.x, ground.y, (tileX,tileY)=>this.passableTile(tileX, tileY, me, state.activeEncounter)).compute(me.tileX, me.tileY)
            //             if(!terrain && path.length > 0 && path.length <= me.maxMoves) this.selectIcon.setTint(0x00ff00) //TODO fix moving direct onto npc squares
            //             else this.selectIcon.setTint(0xff0000)
            //             setSelectIconPosition(this, ground)
            //         }
            //     }
            // }
            // else {
            //     let tile = this.map.getTileAtWorldXY(this.input.activePointer.worldX, this.input.activePointer.worldY, false, undefined, 'objects')
            //     if(tile || gameObjects.length > 0){
            //         if(gameObjects.length > 0) tile = this.map.getTileAtWorldXY((gameObjects[0] as any).x, (gameObjects[0] as any).y, false, undefined, 'ground')
            //         setSelectIconPosition(this, tile)
            //     }
            //     else this.selectIcon.setVisible(false)

            //     if(this.targetingAbility){
            //         const data = AbilityData.find(a=>a.type === this.targetingAbility.type)
            //         if(data.areaEffectRadius && data.range > 0){
            //             //Set center point, fill target list
            //             this.targetingAbility.selectedTargetIds.forEach(id=>{
            //                 this.entities.find(c=>c.characterId === id).setTargeted(false)
            //             })
            //             this.targetingAbility.selectedTargetIds = []
            //             let center = this.map.getTileAtWorldXY(this.input.activePointer.worldX, this.input.activePointer.worldY, false, undefined, 'ground')
            //             getCircle(center.x, center.y, data.areaEffectRadius)
            //             .forEach(tuple=>{
            //                 const char = encounter.entities.find(c=>c.tileX === tuple[0] && c.tileY === tuple[1])
            //                 if(char){
            //                     this.targetingAbility.selectedTargetIds.push(char.id)
            //                     this.entities.find(c=>c.characterId === char.id).setTargeted(true)
            //                 } 
            //             })
            //         }
            //         else if(gameObjects.length > 0){
            //             if(this.targetingAbility.validTargetIds.includes((gameObjects[0] as CharacterSprite).characterId)){
            //                 this.selectIcon.setTint(0x00ff00)
            //             }
            //         }
            //     }
            // }
        })
        this.input.on('pointerdown', (event, GameObjects:Array<Phaser.GameObjects.GameObject>) => {
            const state = store.getState()
            if(!state.activeEncounter) return
            let object = this.map.getTileAtWorldXY(this.input.activePointer.worldX, this.input.activePointer.worldY, false, undefined, 'objects')
            //Try perform active action
            // if(state.activeAbility?.type === AbilityType.Move){
            //     onClearActiveAbility()
            //     let targetTile = this.map.getTileAtWorldXY(this.input.activePointer.worldX, this.input.activePointer.worldY, false, undefined, 'ground')
            //     let me = state.activeEncounter.entities.find(c=>state.onlineAccount.characters.find(ch=>ch.id===c.id))
            //     const path = new AStar(targetTile.x, targetTile.y, (tileX,tileY)=>this.passableTile(tileX, tileY, state.activeEncounter)).compute(me.currentStatus.tileX, me.currentStatus.tileY)
            //     if(path.length > 0 && path.length <= me.maxMoves) networkExecuteCharacterMove(me.id, path)
            // }
            // else if(this.targetingAbility){
            //     const data = AbilityData.find(a=>a.type === this.targetingAbility.type)
            //     if(data.range === 0){
            //         //Self target or radius around self, targeting is pre-computed
            //         networkExecuteCharacterAbility(state.activeEncounter.activeCharacterId, this.targetingAbility)
            //         this.targetingAbility = null
            //         onClearActiveAbility()
            //     }
            //     else {
            //         //All other cases, need to determine targets or center point
            //         if(data.areaEffectRadius){
            //             //Pre-calculated on mouse move
            //             networkExecuteCharacterAbility(state.activeEncounter.activeCharacterId, this.targetingAbility)
            //             this.targetingAbility = null
            //             onClearActiveAbility()
            //         }
            //         else {
            //             const char = GameObjects[0] as CharacterSprite
            //             if(char && this.targetingAbility.validTargetIds.includes(char.characterId)){
            //                 let selected = this.targetingAbility.selectedTargetIds.findIndex(id=>id===char.characterId)
            //                 if(selected !== -1) this.targetingAbility.selectedTargetIds.slice(selected,1)
            //                 else this.targetingAbility.selectedTargetIds.push(char.characterId)
            //                 char.setTargeted(selected===-1)
            //                 if(this.targetingAbility.selectedTargetIds.length === data.targets){
            //                     networkExecuteCharacterAbility(state.activeEncounter.activeCharacterId, this.targetingAbility)
            //                     this.targetingAbility = null
            //                     onClearActiveAbility()
            //                 }
            //             }
            //         }
            //     }
            // }
            if(object){
                switch(object.index-1){
                    case Objects.Vault: onShowModal(Modal.Inventory)
                    break
                }
            }
            else if(GameObjects[0]){
                onShowModal(Modal.CharacterInfo, (GameObjects[0] as CharacterSprite).characterId)
            }
        })
        this.initCompleted = true
    }
    
    executeCharacterAbility = (targetingData:AbilityTargetingData, casterId:string) => {
        let encounter = store.getState().activeEncounter
        const caster = encounter.entities.find(p=>p.id === casterId)
        targetingData.selectedTargetIds.forEach(id=>{
            const char = this.entities.find(c=>c.characterId === id)
            this.effects.get(char.x, char.y, 'sprites').play(targetingData.type.toString())
        })
        this.time.addEvent({
            delay:1000,
            callback: () => {
                encounter = resolveAbility(encounter, AbilityData.find(a=>a.type === targetingData.type), targetingData.selectedTargetIds, this.entities, caster)
                this.nextCharacterTurn(encounter)
            }
        })
    }

    executeCharacterMove = (characterId:string, path:Array<Tuple>) => {
        const encounter = store.getState().activeEncounter
        let activeChar = encounter.entities.find(c=>c.id === characterId)
        if(activeChar.ownerId){
            this.cameras.main.startFollow(this.entities.find(c=>c.characterId === characterId))
        }
        
        const target = this.entities.find(c=>c.characterId === characterId)
        if(target.visible){
            encounter.eventLog.push(activeChar.name+' is moving...')
            this.tweens.timeline({
                targets: target.status.concat(target),    
                tweens: path.map(tuple=>{
                    let tile = this.map.getTileAt(tuple.x, tuple.y, false, 'ground')
                    return {
                        x: tile.getCenterX(),
                        y: tile.getCenterY(),
                        duration: 250
                    }
                }),
                onComplete: ()=>this.onCompleteMove(path)
            });
        }
        else {
            this.onCompleteMove(path)
        }
    }

    onCompleteMove = (path:Array<Tuple>)=> {
        // let encounter = store.getState().activeEncounter
        // encounter.entities.forEach(c=>{
        //     if(c.id === encounter.unitActionQueue.characterId){
        //         const pos = path[path.length-1]
        //         c.tileX = pos.x
        //         c.tileY = pos.y
        //         c.moves = 0
        //     } 
        //     c.turnCounter -= c.speed
        // })
        // this.nextCharacterTurn(encounter)
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

    carveFogOfWar = (radius:number, x:number, y:number) => {
        this.map.setLayer('fog')
        this.map.getTileAt(x, y).index = -1
        for(var i=radius; i>0; i--){
            getCircle(x, y, i).forEach(tuple=>{
                this.map.getTileAt(tuple[0], tuple[1]).alpha = i === radius ? 0.5 : 0
            })
        }
    }

    runBotTurn = (npc:RCUnit) => {
        const characters = store.getState().activeEncounter.entities

        const visibilityMap = getSightMap(npc.tileX, npc.tileY, npc.sight, this.map)
        
        let seenChars = this.entities.filter(c=>{
            let char = characters.find(ch=>c.characterId === ch.id)
            return char.ownerId && visibilityMap[char.tileX] && visibilityMap[char.tileX][char.tileY]
        })

        if(seenChars.length > 0){
            let targetTile = this.map.getTileAtWorldXY(seenChars[0].x, seenChars[0].y, false, undefined, 'ground')
            //2. If cowardly, move away
            if(npc.statusEffect.find(s=>s.type === StatusEffect.Fear)){
                //1. Determine escape point: calculate vector to targetTile
                //2. Invert the vector, move towards this point
            }
            const range = npc.abilities.map(a=>AbilityData.find(ab=>ab.type === a.type).range).sort((a,b)=>a > b ? 1 : -1)[0]
            const encounter = store.getState().activeEncounter
            const path = new AStar(targetTile.x, targetTile.y, (tileX,tileY)=>this.passableTile(tileX, tileY, npc, encounter)).compute(npc.tileX, npc.tileY)
            if(path.length <= range){
                //4. If in range, use an off cooldown ability
                const nextAbil = npc.abilities.find(a=>a.cooldown <= 0 && AbilityData.find(ab=>ab.type === a.type).range <= range)
                if(nextAbil){
                    //Collect target list
                    networkExecuteCharacterAbility(npc.id, {
                        validTargetIds: [],
                        selectedTargetIds: seenChars.map(c=>c.characterId),
                        type: nextAbil.type
                    })
                }
            }
            else {
                //3. Else move within range of longest range ability
                networkExecuteCharacterMove(npc.id, path.slice(0,npc.maxMoves-npc.speed))
            }
        }
        else {
            //Roam/No action
            let x = Phaser.Math.Between(0,1)
            let y = Phaser.Math.Between(0,1)
            let candidate = {x: x===1 ? npc.tileX-1 : npc.tileX+1, y: y===1 ? npc.tileY-1 : npc.tileY+1}
            let t = this.map.getTileAt(candidate.x, candidate.y, false, 'ground')
            const encounter = store.getState().activeEncounter
            if(t && this.passableTile(t.x, t.y, npc, encounter))
                networkExecuteCharacterMove(npc.id, [candidate])
            else
                networkExecuteCharacterMove(npc.id, [{x:npc.tileX, y: npc.tileY}])
        }
    }

    redrawMap = (match:Encounter) => {
        this.entities.forEach(e=>e.destroy())
        this.entities = []
        match.entities.forEach(char=>{
            let tile = this.map.getTileAt(char.tileX, char.tileY, false, 'ground')
            this.entities.push(new CharacterSprite(this, tile.getCenterX(), tile.getCenterY(), char.avatarIndex, char))
        })
        this.calcVisibleObjects(match)
        
        match.unitActionQueue.forEach(a=>{
            if(!a.completedByPlayers.includes(store.getState().onlineAccount.id)){
                if(a.type=== AbilityType.Move){
                    this.executeCharacterMove(a.characterId, a.path)
                }
                else this.executeCharacterAbility({...AbilityData.find(a=>a.type===a.type), selectedTargetIds: a.selectedTargetIds, validTargetIds: []}, a.characterId)
            }
        })
        
    }
    
    nextCharacterTurn = (match:Encounter) => {
        // match.entities.forEach(c=>{
        //     if(c.id === match.unitActionQueue.characterId) 
        //         c = resolveStatusEffects(c, this.entities.find(ch=>ch.characterId===c.id))
        // })
        // match.unitActionQueue.completedByPlayers.push(store.getState().onlineAccount.id)
        // onEncounterUpdated(match)
        // if(match.unitActionQueue.completedByPlayers.length === match.entities.filter(pc=>pc.ownerId).length){
        //     //If you are the last to ack, you will run the next game step
        //     const char = match.entities.find(c=>c.id === match.activeCharacterId)
        //     if(char.statusEffect.find(s=>s.type===StatusEffect.Stun)){
        //         return networkExecuteCharacterMove(char.id, [{x:char.currentStatus.tileX, y: char.currentStatus.tileY}])
        //     }
        //     else if(!char.ownerId){
        //         this.runNPCTurn(char)
        //     }
        // }
    }
}