import { Scenario } from "../constants"

export const defaults = [
    { key: 'selected', resource: require('./selected.png'), type: 'image' },
    { key: 'tiles', resource: require('./OverworldTileset_v03.png'), type: 'image' },
    { key: 'sprites', resource: require('./OverworldTileset_v03.png'), type: 'spritesheet', data: { frameWidth: 16, frameHeight: 16 } },
    { key: 'resources', resource: require('./OresandRocks.png'), type: 'spritesheet', data: { frameWidth: 16, frameHeight: 16 }},
    { key: 'bot-sprites', resource: require('./Robots.png'), type: 'spritesheet', data: { frameWidth: 24, frameHeight: 32,  } }, //margin: 1, spacing: 2
    { key: Scenario.LightOfTheWorld, resource: require('./maps/tutorial.json'), type: 'tilemapTiledJSON'},
    { key: Scenario.Ordinaters, resource: require('./maps/tutorial.json'), type: 'tilemapTiledJSON'}
]