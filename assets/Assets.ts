import { Scenario } from "../constants"

export const defaults = [
    { key: 'selected', resource: require('./selected.png'), type: 'image' },
    { key: 'tiles', resource: require('./dcss_tileset_extruded.png'), type: 'image' },
    { key: 'sprites', resource: require('./dcss_tileset_extruded.png'), type: 'spritesheet', data: { frameWidth: 32, frameHeight: 32, margin: 1, spacing: 2 } },
    { key: Scenario.Hub, resource: require('./maps/cell.json'), type: 'tilemapTiledJSON'},
    { key: Scenario.Tutorial, resource: require('./maps/practice.json'), type: 'tilemapTiledJSON'},
    { key: Scenario.Vipers, resource: require('./maps/viper.json'), type: 'tilemapTiledJSON'},
]

export const Icons = {
    
}

export enum IconNames {
    
}