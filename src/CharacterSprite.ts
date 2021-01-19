import { Scene, GameObjects, Tweens, Tilemaps } from "phaser";
import { store } from "../App";
import { AbilityType, FONT_DEFAULT, RCObjectType, StatusEffectData } from '../constants'
import MapScene from "./MapScene";
import { onEncounterUpdated } from "./uiManager/Thunks";
import AStar from "./util/AStar";

export default class CharacterSprite extends GameObjects.Sprite {

    characterId: string
    reticle: GameObjects.Image
    status: Array<GameObjects.Image>
    scene: MapScene
    currentMove: Tweens.Timeline

    constructor(scene:MapScene,x:number,y:number, frame:number, character:RCUnit){
        super(scene, x,y, 'bot-sprites', frame)
        
        this.characterId = character.id
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
        const encounter = store.getState().activeEncounter
        const dat = encounter.entities.find(e=>e.id === this.characterId)
        
        dat.abilities.forEach(a=>{
            switch(a.type){
                case AbilityType.SensorMk1:
                    //Head towards the fog
                    if(dat.moves <= 0){
                        return this.executeCharacterMove(dat.id, this.scene.getBase())
                    } 
                    const fogTiles = this.scene.getVisibleTiles(dat, 'fog')
                    const nextVisible = fogTiles.find(t=>t.alpha === 1)
                    if(nextVisible){
                        this.executeCharacterMove(dat.id, nextVisible)
                    }
                    else {
                        //Roam
                        let x = Phaser.Math.Between(0,1)
                        let y = Phaser.Math.Between(0,1)
                        let candidate = {x: x===1 ? dat.tileX-1 : dat.tileX+1, y: y===1 ? dat.tileY-1 : dat.tileY+1}
                        let t = this.scene.map.getTileAt(candidate.x, candidate.y, false, 'ground')
                        if(t && this.scene.passableTile(t.x, t.y, dat, encounter))
                            this.executeCharacterMove(dat.id, t)
                    }
                break
                case AbilityType.ExtractorMk1:
                    //Head towards a revealed resource patch that you can extract:
                    //Lead or Titanium
                    //Extract from soil until full
                    //Return to base
                break
            }
        })
    }

    executeCharacterMove = (characterId:string, targetTile:Tilemaps.Tile) => {
        const encounter = store.getState().activeEncounter
        let activeChar = encounter.entities.find(c=>c.id === characterId)
        const targetSprite = this.scene.entities.find(c=>c.characterId === characterId)
        const spriteTile = this.scene.map.getTileAtWorldXY(targetSprite.x, targetSprite.y, false, undefined, 'ground')
        let path = new AStar(targetTile.x, targetTile.y, (tileX,tileY)=>this.scene.passableTile(tileX, tileY, activeChar, encounter)).compute(spriteTile.x, spriteTile.y)
        
        let base = this.scene.getBase()
        if(base.x===spriteTile.x && base.y===spriteTile.y){
            activeChar.moves = activeChar.maxMoves
            encounter.eventLog.push(activeChar.name+' is recharging...')
            onEncounterUpdated(encounter)
        } 
        if(activeChar.moves < path.length) path = new AStar(base.x, base.y, (tileX,tileY)=>this.scene.passableTile(tileX, tileY, activeChar, encounter)).compute(spriteTile.x, spriteTile.y)
                        
        encounter.eventLog.push(activeChar.name+' is moving...')
        if(this.currentMove) this.currentMove.stop()
        this.currentMove = this.scene.tweens.timeline({
            targets: targetSprite,    
            tweens: path.map(tuple=>{
                let tile = this.scene.map.getTileAt(tuple.x, tuple.y, false, 'ground')
                return {
                    x: tile.getCenterX(),
                    y: tile.getCenterY(),
                    duration: 1000,
                    onComplete: ()=>{
                        const enc = store.getState().activeEncounter
                        enc.entities.find(e=>e.id === characterId).moves--
                        onEncounterUpdated(enc)
                        this.scene.carveFogOfWar(activeChar.sight, tile.x, tile.y)
                    }
                }
            }),
            onComplete: ()=>{
                const pos = path[path.length-1]
                this.scene.carveFogOfWar(activeChar.sight, pos.x, pos.y)
                this.scene.onCompleteMove(characterId)
            }
        });
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