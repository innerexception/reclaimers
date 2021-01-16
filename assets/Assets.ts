import { Scenario } from "../constants"

export const defaults = [
    { key: 'selected', resource: require('./selected.png'), type: 'image' },
    { key: 'tiles', resource: require('./OverworldTileset_v03.png'), type: 'image' },
    { key: 'sprites', resource: require('./OverworldTileset_v03.png'), type: 'spritesheet', data: { frameWidth: 16, frameHeight: 16,  } }, //margin: 1, spacing: 2
    { key: Scenario.Hub, resource: require('./maps/cell.json'), type: 'tilemapTiledJSON'},
    { key: Scenario.Tutorial, resource: require('./maps/tutorial.json'), type: 'tilemapTiledJSON'}
]