import { Scene, GameObjects } from "phaser";
import { FONT_DEFAULT, StatusEffectData } from '../constants'
import { AbilityData } from "./data/Abilities";
import { Items } from "./data/Items";

export default class CharacterSprite extends GameObjects.Sprite {

    characterId: string
    reticle: GameObjects.Image
    status: Array<GameObjects.Image>
    equipment: Array<GameObjects.Image>

    constructor(scene:Scene,x:number,y:number, frame:number, character:PlayerCharacter){
        super(scene, x,y, 'sprites', frame)
        this.characterId = character.id
        this.status = []
        character.statusEffect.forEach((s,i)=>{
            if(!this.status.find(st=>+st.frame.name === s.type) && !StatusEffectData[s.type].isPassive)
                this.status.push(this.scene.add.image(x+8-(i*5), y-16, 'sprites', s.type).setScale(0.5).setDepth(4))
        })
        this.equipment = []
        character.abilities.forEach(e=>{
            const dat = AbilityData.find(a=>a.type === e.type)
            if(dat.slot)
                this.equipment.push(this.scene.add.image(x,y,'sprites',dat.model).setDepth(3))
        })
        this.setInteractive()
        scene.add.existing(this)
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
        this.equipment.forEach(s=>s.setVisible(visible))
        return this
    }

    preUpdate(time, delta){
        this.anims.update(time, delta)
    }

    destroy(){
        super.destroy()
        this.reticle && this.reticle.destroy()
        this.status.forEach(s=>s.destroy())
        this.equipment.forEach(s=>s.destroy())
    }
}