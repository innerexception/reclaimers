import { Scene, GameObjects } from "phaser";
import { FONT_DEFAULT, StatusEffectData } from '../constants'

export default class ObjectSprite extends GameObjects.Sprite {

    characterId: string
    reticle: GameObjects.Image
    status: Array<GameObjects.Image>

    constructor(scene:Scene,x:number,y:number, frame:number, id:string){
        super(scene, x,y, 'sprites', frame)
        this.characterId = id
        this.status = []
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