import { v4 } from 'uuid'
import { Scene, Tilemaps } from 'phaser';
import { DIRS } from './AStar'
import MapScene from '../MapScene';
import { AbilityType, EquipmentType, Patrons, Scenario } from '../../constants';
import { AbilityData } from '../data/Abilities';
import { computeFOV } from './Fov';

enum FirebaseAuthError {
    NOT_FOUND='auth/user-not-found',
    BAD_EMAIL='auth/invalid-email',
    BAD_PASSWORD='auth/wrong-password'
}

export const findValue = (data:Phaser.Data.DataManager, searchKey:string) => {
    let val
    Object.keys(data.values).forEach(key=>{if(data.values[key].name===searchKey) val = data.values[key].value })
    return val
}

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

export const getNewEncounter = (map:Scenario, player:PlayerCharacter):Encounter => {
    if(player) player.currentStatus = null
    return {
        id:v4(),
        playerCharacters: player ? [player] : [],
        map,
        difficulty:0,
        lastCharacterAction: null,
        activeCharacterId: player ? player.id : '',
        eventLog: []
    }
}

export const getNewAccount = (email:string, id:string):UserAccount => {
    return {
        id,
        email,
        name: 'New Player',
        characters: [],
        encounterId: '',
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

export const getPatronsOfCharacter = (char:PlayerCharacter) => {
    if(char) return Patrons.filter((p,i)=>hasPatronAbility(i, char)).map(p=>p.type)
    else return []
}
    

export const hasPatronAbility = (i:number, char:PlayerCharacter) => {
    let p = Patrons[i]
    return char.abilities.find(a=>p.abilityPool.includes(a.type))
}

export const getNextChar = (characters:Array<PlayerCharacter>) => characters.sort((a,b)=>a.currentStatus.turnCounter > b.currentStatus.turnCounter ? 1 : -1)[0]

export const getNewAbilities = (abils:Array<AbilityType>):Array<Ability> => {
    return abils.map(a=>{
        return {
            type: a,
            cooldown: 0,
            uses: 0
        }
    })
}

export const getSightMap = (npc:PlayerCharacter, map:Phaser.Tilemaps.Tilemap) => {
    let sightArray = []
    for(var i=npc.sight; i>0; i--){
        sightArray = sightArray.concat(getCircle(npc.currentStatus.tileX, npc.currentStatus.tileY, i))
    }
    return computeFOV(npc.currentStatus.tileX, npc.currentStatus.tileY, npc.sight, sightArray, map)
}