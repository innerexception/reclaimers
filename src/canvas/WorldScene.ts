import { Scene, GameObjects, Tilemaps } from "phaser";
import { defaults } from "../../assets/Assets";
import BuildingSprite from "./BuildingSprite";
import MapScene from "./MapScene";
import RegionSprite from "./RegionSprite"
import { getNewEncounter, transitionIn, transitionOut } from "../util/Util";
import { store } from "../../App";
import { Scenario } from "../../constants";
import { onCreateEncounter } from "../uiManager/Thunks";


export default class WorldScene extends Scene {

    originDragPoint: Phaser.Math.Vector2
    selectIcon: GameObjects.Image
    focusedItem: GameObjects.Sprite
    regionSprites: Array<RegionSprite>
    sounds: any

    preload = () =>
    {
        defaults.forEach(asset=>{
            (this.load[asset.type] as any)(asset.key, asset.resource, asset.data)
        })
        console.log('assets were loaded.')
    }

    create = () =>
    {
        // this.sound.volume = 0
        // this.sounds = {
        //     gameplay: this.sound.add('gameplay')
        // }
        // this.sounds.gameplay.play({loop: true, volume: 0.2})

        this.scene.add('town', new MapScene({ key: 'town'}), true)
        this.scene.sleep('town')
        this.scene.bringToTop('map')
        let regionMap = this.make.tilemap({ key: 'map'})
        let town1Tileset = regionMap.addTilesetImage('OverworldTileset_v03', 'tiles', 16,16)
        regionMap.createStaticLayer('ocean', town1Tileset)
        regionMap.createStaticLayer('ground', town1Tileset)
        
        let regionSprites = regionMap.createFromObjects('regions', 'region', { key: 'overlay', visible:true })
        this.regionSprites = regionSprites.map(r=>new RegionSprite(this, r.x,r.y,'overlay',r.displayWidth, r.displayHeight, r.data))
        regionSprites.forEach(s=>s.destroy())
        
        this.cameras.main.setZoom(2)
        this.cameras.main.setBounds(0, 0, regionMap.widthInPixels, regionMap.heightInPixels)

        let regionName = store.getState().onlineAccount.savedState[0]?.map || Scenario.LightOfTheWorld
        let reg = this.regionSprites.find(r=>r.mapName === regionName)
        this.cameras.main.centerOn(reg.x, reg.y)
       
        this.input.on('pointerover', (event, gameObjects) => {
            if(gameObjects[0]){
                this.focusedItem = gameObjects[0]
            } 
        });
        this.input.on('pointerout', (event, gameObjects) => {
            this.selectIcon && this.selectIcon.setVisible(false)
        });
        this.input.on('pointerdown', (pointer, gameObjects)=> {
            if(gameObjects[0] && !this.originDragPoint){
                this.focusedItem = gameObjects[0]
                let scenario = (this.focusedItem as any).mapName as Scenario
                const player = store.getState().onlineAccount
                const playerState = player.savedState.find(s=>s.map === scenario)
                transitionOut(this, 'town', ()=>onCreateEncounter(playerState ? playerState : getNewEncounter(scenario)))
            }
        })
        this.input.on('pointermove', ()=>{
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

        this.input.mouse.disableContextMenu()
    }

    setSelectIconPosition(tile:Tuple){
        if(!this.selectIcon){
            this.selectIcon = this.add.image(tile.x, tile.y, 'selected').setDepth(2).setScale(0.5)
            this.add.tween({
                targets: this.selectIcon,
                scale: 1,
                duration: 1000,
                repeat: -1,
                yoyo: true
            })
        }
        else if(this.selectIcon.x !== tile.x || this.selectIcon.y !== tile.y) 
            this.selectIcon.setPosition(tile.x, tile.y)
        
        this.selectIcon.setVisible(true)
    }

    update(time, delta){
        if(this.focusedItem) this.setSelectIconPosition(this.focusedItem.getCenter())
    }
}