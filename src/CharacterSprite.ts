import { GameObjects, Tweens, Tilemaps } from "phaser";
import { store } from "../App";
import { AbilityType, ExtractorToxinList, FONT_DEFAULT, RCObjectType, TerrainLevels } from '../constants'
import MapScene from "./MapScene";
import { onUpdateSelectedUnit, onUpdatePlayer, onEncounterUpdated } from "./uiManager/Thunks";
import AStar from "./util/AStar";
import { shuffle } from "./util/Util";

export default class CharacterSprite extends GameObjects.Sprite {

    character: RCUnit
    reticle: GameObjects.Image
    status: Array<GameObjects.Image>
    scene: MapScene
    currentMove: Tweens.Timeline

    constructor(scene:MapScene,x:number,y:number, frame:number, character:RCUnit){
        super(scene, x,y, 'bot-sprites', frame)
        
        this.character = character
        this.status = []
        this.setDisplaySize(16,16)
        this.play(character.avatarIndex.toString())
        this.setInteractive()
        scene.add.existing(this)
        scene.time.addEvent({
            delay:1000,
            callback: this.runUnitTick,
        })
    }

    getEntity = () => 
        this.character
    

    runUnitTick = () => {
        let dat = this.getEntity()
        dat.abilities.forEach(a=>{
            switch(a.type){
                case AbilityType.SensorMk1:
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
                case AbilityType.ExtractorMk1:
                    if(dat.inventory.length > 0){
                        //TODO: Head towards drop off point
                        const base = this.scene.getObjects(RCObjectType.Base).find(base=>base.x === dat.tileX && base.y === dat.tileY)
                        if(base){
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
        })
    }

    roam = () => {
        const dat = this.getEntity()
        //Roam
        let x = Phaser.Math.Between(0,1)
        let y = Phaser.Math.Between(0,1)
        let candidate = {x: x===1 ?dat.tileX-1 : dat.tileX+1, y: y===1 ? dat.tileY-1 : dat.tileY+1}
        let t = this.scene.map.getTileAt(candidate.x, candidate.y, false, 'ground')
        if(t && this.scene.passableTile(t.x, t.y, dat)) this.executeCharacterMove(t)
        else this.runUnitTick()
    }

    executeCharacterMove = (targetTile:Tilemaps.Tile) => {
        const dat = this.getEntity()
        const targetSprite = this.scene.entities.find(c=>c.character.id === dat.id)
        const spriteTile = this.scene.map.getTileAtWorldXY(targetSprite.x, targetSprite.y, false, undefined, 'ground')
        let path = new AStar(targetTile.x, targetTile.y, (tileX,tileY)=>this.scene.passableTile(tileX, tileY, dat)).compute(spriteTile.x, spriteTile.y)
        
        let base = this.getNearestBase(this.scene.getObjects(RCObjectType.Base), dat)
        if(base.x===spriteTile.x && base.y===spriteTile.y){
            dat.moves = dat.maxMoves
        }
        if(dat.moves < path.length) path = new AStar(base.x, base.y, (tileX,tileY)=>this.scene.passableTile(tileX, tileY, dat)).compute(spriteTile.x, spriteTile.y)
                     
        if(path.length === 0){
            //This unit is currently blocked and has no valid movement path, so we wait one and see if we are unblocked
            this.scene.time.addEvent({
                delay: 1000,
                callback: this.roam
            })
            return 
        } 

        if(targetSprite.visible){
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
                            let dat = this.getEntity()
                            dat.moves--
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
                    let dat = this.getEntity()
                    dat.tileX = pos.x
                    dat.tileY = pos.y
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

    getNearestBase = (pylons:Array<Tilemaps.Tile>, dat:RCUnit) => {
        let closest = 1000
        let pylon = pylons[0]
        pylons.forEach(p=>{
            const dist = Phaser.Math.Distance.Between(p.x, p.y, dat.tileX, dat.tileY)
            if(dist < closest){
                pylon = p
                closest = dist
            } 
        })
        return pylon
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