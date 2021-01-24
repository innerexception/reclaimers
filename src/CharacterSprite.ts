import { GameObjects, Tweens, Tilemaps } from "phaser";
import { store } from "../App";
import { AbilityType, ExtractorToxinList, FONT_DEFAULT, TerrainLevels } from '../constants'
import MapScene from "./MapScene";
import { onUpdateSelectedUnit, onUpdatePlayer } from "./uiManager/Thunks";
import AStar from "./util/AStar";

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
        // character.statusEffect.forEach((s,i)=>{
        //     if(!this.status.find(st=>+st.frame.name === s.type) && !StatusEffectData[s.type].isPassive)
        //         this.status.push(this.scene.add.image(x+8-(i*5), y-16, 'sprites', s.type).setScale(0.5).setDepth(4))
        // })
        this.play(character.avatarIndex.toString())
        this.setInteractive()
        scene.add.existing(this)
        scene.time.addEvent({
            delay:1000,
            callback: this.runUnitTick,
        })
    }

    runUnitTick = () => {
        let dat = this.entity
        dat.abilities.forEach(a=>{
            switch(a.type){
                case AbilityType.SensorMk1:
                    //Head towards the fog
                    const fogTiles = this.scene.getVisibleTiles(dat, 'fog')
                    const nextVisible = fogTiles.find(t=>t.alpha === 1)
                    if(nextVisible){
                        this.executeCharacterMove(dat.id, nextVisible)
                    }
                    else {
                        this.roam(dat)
                    }
                break
                case AbilityType.ExtractorMk1:
                    if(dat.inventory.length > 0){
                        const base = this.scene.getBase()
                        if(base.x === this.entity.tileX && base.y === this.entity.tileY){
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
                    }
                    //Head towards a revealed resource patch that you can extract:
                    const tileDat = this.scene.tiles[dat.tileX][dat.tileY]
                    const tilei = tileDat.toxins.findIndex(x=>ExtractorToxinList[AbilityType.ExtractorMk1].includes(x))
                    if(tilei!==-1 && dat.inventory.length < dat.maxInventory){
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
                        const visibleTiles = this.scene.getVisibleTiles(dat, 'ground')
                        const nextVisibleResource = visibleTiles.find(t=>this.scene.tiles[t.x][t.y].toxins.some(x=>ExtractorToxinList[AbilityType.ExtractorMk1].includes(x)))
                        if(nextVisibleResource){
                            this.executeCharacterMove(dat.id, nextVisibleResource)
                        }
                        else {
                            this.roam(dat)
                        }
                    }
                break
            }
        })
    }

    roam = (dat:RCUnit) => {
        //Roam
        let x = Phaser.Math.Between(0,1)
        let y = Phaser.Math.Between(0,1)
        let candidate = {x: x===1 ? dat.tileX-1 : dat.tileX+1, y: y===1 ? dat.tileY-1 : dat.tileY+1}
        let t = this.scene.map.getTileAt(candidate.x, candidate.y, false, 'ground')
        if(t && this.scene.passableTile(t.x, t.y, this.entity)) this.executeCharacterMove(dat.id, t)
        else this.runUnitTick()
    }

    executeCharacterMove = (characterId:string, targetTile:Tilemaps.Tile) => {
        const encounter = store.getState().activeEncounter
        const targetSprite = this.scene.entities.find(c=>c.entity.id === characterId)
        const spriteTile = this.scene.map.getTileAtWorldXY(targetSprite.x, targetSprite.y, false, undefined, 'ground')
        let path = new AStar(targetTile.x, targetTile.y, (tileX,tileY)=>this.scene.passableTile(tileX, tileY, this.entity)).compute(spriteTile.x, spriteTile.y)
        
        let base = this.scene.getBase()
        if(base.x===spriteTile.x && base.y===spriteTile.y){
            this.entity.moves = this.entity.maxMoves
            encounter.eventLog.push(this.entity.name+' is recharging...')
            //onAddEventLog(encounter)
        }
        if(this.entity.moves < path.length) path = new AStar(base.x, base.y, (tileX,tileY)=>this.scene.passableTile(tileX, tileY, this.entity)).compute(spriteTile.x, spriteTile.y)
                        
        if(targetSprite.visible){
            encounter.eventLog.push(this.entity.name+' is moving...')
            if(this.currentMove) this.currentMove.stop()
            this.currentMove = this.scene.tweens.timeline({
                targets: targetSprite,    
                tweens: path.map((tuple,i)=>{
                    let tile = this.scene.map.getTileAt(tuple.x, tuple.y, false, 'ground')
                    return {
                        x: tile.getCenterX(),
                        y: tile.getCenterY(),
                        duration: 1000,
                        onComplete: ()=>{
                            this.entity.moves--
                            const pos = path[i]
                            this.entity.tileX = pos.x
                            this.entity.tileY = pos.y
                            onUpdateSelectedUnit(this.entity)
                            this.scene.updateFogOfWar()
                        }
                    }
                }),
                onComplete: ()=>{
                    const pos = path[path.length-1]
                    this.entity.tileX = pos.x
                    this.entity.tileY = pos.y
                    this.scene.updateFogOfWar()
                    this.scene.onCompleteMove(characterId)
                }
            });
        }
        else {
            const pos = path[path.length-1]
            this.entity.tileX = pos.x
            this.entity.tileY = pos.y
            this.scene.onCompleteMove(characterId)
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
    }

    destroy(){
        super.destroy()
        this.reticle && this.reticle.destroy()
        this.status && this.status.forEach(s=>s.destroy())
    }
}