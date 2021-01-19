import { v4 } from 'uuid'
import { Scene, Tilemaps } from 'phaser';
import { DIRS } from './AStar'
import MapScene from '../MapScene';
import { AbilityType, defaultResources, EquipmentType, ItemType, RCUnitType, Scenario } from '../../constants';
import { AbilityData } from '../data/Abilities';
import { computeFOV } from './Fov';

enum FirebaseAuthError {
    NOT_FOUND='auth/user-not-found',
    BAD_EMAIL='auth/invalid-email',
    BAD_PASSWORD='auth/wrong-password'
}

const defaultDesigns:Array<RCUnitData> = [
    {
        name: 'Scout',
        avatarIndex: RCUnitType.Scout,
        maxHp: 1,
        maxMoves: 7,
        speed: 2,
        sight: 5,
        statusEffect: [],
        inventory: [],
        abilityTypes: [AbilityType.SensorMk1],
        requiredItems: [{ type: ItemType.Lithium, amount: 2}, { type: ItemType.Palladium, amount: 1}]
    },
    {
        name: 'Surface Compactor mk.1',
        avatarIndex: RCUnitType.LightCompactor,
        maxHp: 1,
        maxMoves: 1,
        speed: 2,
        sight: 2,
        statusEffect: [],
        inventory: [],
        abilityTypes: [AbilityType.ExtractorMk1],
        requiredItems: [{ type: ItemType.Lithium, amount: 2}, { type: ItemType.Titanium, amount: 1}]
    }
]

export const getErrorMessage = (error:string) => {
    switch(error){
        case FirebaseAuthError.BAD_EMAIL: return 'Invalid email address'
        case FirebaseAuthError.BAD_PASSWORD: return 'Password was incorrect'
        case FirebaseAuthError.NOT_FOUND: return 'No account exists with that email, create one now'
        default: return 'Something happened'
    }
}

export const getAbilityDescription = (abilityType:AbilityType) => {
    const a = AbilityData.find(a=>a.type === abilityType)
    if(a) return a.description
}

export const isPassive = (abil:AbilityType) => {
    const a = AbilityData.find(a=>a.type === abil)
    if(a) return a.isPassive
}

export const isWeapon = (abil:AbilityType) => {
    const a = AbilityData.find(a=>a.type === abil)
    if(a) return a.slot===EquipmentType.Weapon
}

export const canAffordBot = (design:RCUnitData) => true

export const getNewEncounter = (map:Scenario, playerId:string):Encounter => {
    return {
        id:v4(),
        entities: [],
        map,
        eventLog: [],
        players: [{ id: playerId, designs: defaultDesigns, resources: defaultResources}]
    }
}

export const getNewAccount = (name:string, id:string):UserAccount => {
    return {
        id,
        name,
        completedMissionIds: []
    } 
}

export const transitionRoom = (scene:Scene) => {
    transitionOut(scene, ()=>transitionIn(scene))
}

const rect_dim = 16

export const transitionOut = (scene:Scene, cb:Function) => {
    let rects = []
    let rows = scene.cameras.default.width/rect_dim
    let cols = scene.cameras.default.height/rect_dim
    for(var i=0; i<=rows; i++){
        for(var j=0; j<=cols; j++){
            let rect = scene.add.image(i*rect_dim, j*rect_dim, 'rect')
            rect.setDisplaySize(rect_dim,rect_dim).setDepth(5).setVisible(false)
            rects.push(rect)
        } 
    }
    rects.forEach(r=>{
        scene.time.addEvent({
            delay: Phaser.Math.Between(250,750),
            callback: ()=>{
                r.setVisible(true)
            }
        })
    })
    scene.time.addEvent({
        delay: 800,
        callback:()=>{
            cb()
            scene.time.addEvent({
                delay:200,
                callback:()=>{
                    rects.forEach(r=>r.destroy())
                }
            })
        }
    })
}

export const transitionIn = (scene:Scene) => {
    let rects = []
    let rows = scene.cameras.default.width/rect_dim
    let cols = scene.cameras.default.height/rect_dim
    for(var i=0; i<=rows; i++){
        for(var j=0; j<=cols; j++){
            let rect = scene.add.image(i*rect_dim, j*rect_dim, 'rect')
            rect.setDisplaySize(rect_dim,rect_dim).setDepth(5)
            rects.push(rect)
        } 
    }
    rects.forEach(r=>{
        scene.time.addEvent({
            delay: Phaser.Math.Between(250,750),
            callback: ()=>{
                r.destroy()
            }
        })
    })
}

export const setSelectIconPosition = (scene:MapScene, tile:Tilemaps.Tile) => {
    if(scene.selectIcon.x !== tile.getCenterX() || scene.selectIcon.y !== tile.getCenterY()) 
        scene.selectIcon.setPosition(tile.getCenterX(), tile.getCenterY())
    scene.selectIcon.setVisible(true)
}

export const shuffle = (array:Array<any>) => {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

export const getCircle = (cx: number, cy: number, r: number, topology?:number) => {
    let result = new Array<[number, number]>()
    let dirs, countFactor, startOffset;
    if(!topology) topology = 8
    switch (topology) {
        case 4:
            countFactor = 1;
            startOffset = [0, 1];
            dirs = [
                DIRS[8][7],
                DIRS[8][1],
                DIRS[8][3],
                DIRS[8][5]
            ];
        break;

        case 6:
            dirs = DIRS[6];
            countFactor = 1;
            startOffset = [-1, 1];
        break;

        case 8:
            dirs = DIRS[4];
            countFactor = 2;
            startOffset = [-1, 1];
        break;

        default:
            throw new Error("Incorrect topology for FOV computation");
        break;
    }

    /* starting neighbor */
    let x = cx + startOffset[0]*r;
    let y = cy + startOffset[1]*r;

    /* circle */
    for (let i=0;i<dirs.length;i++) {
        for (let j=0;j<r*countFactor;j++) {
            result.push([x, y]);
            x += dirs[i][0];
            y += dirs[i][1];

        }
    }

    return result;
}

export const canPassTerrainType = (unit:RCUnit, terrainIndex:number) => true

export const getNewAbilities = (abils:Array<AbilityType>):Array<Ability> => {
    return abils.map(a=>{
        return {
            type: a,
            cooldown: 0,
            uses: 0
        }
    })
}

export const getSightMap = (x,y,radius, map:Phaser.Tilemaps.Tilemap) => {
    let sightArray = []
    for(var i=radius; i>0; i--){
        sightArray = sightArray.concat(getCircle(x, y, i))
    }
    return computeFOV(x, y, radius, sightArray, map)
}

export const getUnitFromData = (data:RCUnitData, ownerId:string):RCUnit => {
    return {
        ...data,
        id:v4(),
        ownerId,
        abilities: data.abilityTypes.map(a=>{ return { type: a, cooldown: 0, uses: 0}}),
        hp: data.maxHp,
        moves: data.maxMoves,
        tileX: 0,
        tileY: 0
    }
}