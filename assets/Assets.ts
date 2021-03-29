import { RCAnimalType, Scenario } from "../constants"

export const defaults = [
    { key: 'selected', resource: require('./selected.png'), type: 'image' },
    { key: 'overlay', resource: require('./ui_border.png'), type: 'image' },
    { key: 'tiles', resource: require('./OverworldTileset_v03.png'), type: 'image' },
    { key: 'fog', resource: require('./FogOfWar.png'), type: 'image' },
    { key: 'sprites', resource: require('./OverworldTileset_v03.png'), type: 'spritesheet', data: { frameWidth: 16, frameHeight: 16 } },
    { key: 'resources', resource: require('./OresandRocks.png'), type: 'spritesheet', data: { frameWidth: 16, frameHeight: 16 }},
    { key: RCAnimalType.Bear, resource: require('./animals/Bear/Bear_Walk.png'), type: 'spritesheet', data: { frameWidth: 64, frameHeight: 32 }},
    { key: RCAnimalType.Deer, resource: require('./animals/Deer/Deer_Walk.png'), type: 'spritesheet', data: { frameWidth: 72, frameHeight: 50 }},
    { key: RCAnimalType.Fox, resource: require('./animals/Fox/Fox_Walk.png'), type: 'spritesheet', data: { frameWidth: 64, frameHeight: 35 }},
    { key: RCAnimalType.Rabbit, resource: require('./animals/Rabbit/Rabbit_Hop.png'), type: 'spritesheet', data: { frameWidth: 32, frameHeight: 25 }},
    { key: RCAnimalType.Wolf, resource: require('./animals/Wolf/Wolf_Walk.png'), type: 'spritesheet', data: { frameWidth: 64, frameHeight: 40 }},
    { key: RCAnimalType.Human, resource: require('./animals/humans.png'), type: 'spritesheet', data: { frameWidth: 8, frameHeight: 8 }},
    { key: 'bot-sprites', resource: require('./Robots.png'), type: 'spritesheet', data: { frameWidth: 24, frameHeight: 32,  } }, //margin: 1, spacing: 2
    { key: 'map', resource: require('./maps/map.json'), type: 'tilemapTiledJSON'},
    { key: Scenario.zone1, resource: require('./maps/tutorial.json'), type: 'tilemapTiledJSON'},
    { key: Scenario.zone2, resource: require('./maps/zone2.json'), type: 'tilemapTiledJSON'},
    { key: Scenario.zone3, resource: require('./maps/zone3.json'), type: 'tilemapTiledJSON'}
]