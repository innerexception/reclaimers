export const CharAppearanceStart = 5074
export const CharAppearanceEnd = 5189
export const WeaponBackground = 1806

export const MAX_TURN_TIMER=100
export const FONT_DEFAULT = {
    fontFamily: 'Body', 
    fontSize: '8px',
    color:'white'
}

export enum AbilityType {
    Destroy,Create,SensorMk1,ExtractorMk1,Decrypter,BasicProcessor,Disruptor
}

export const Abilities = {
    [AbilityType.Decrypter]: { name: 'Decrypter', description: 'Allows activation of factories'},
    [AbilityType.ExtractorMk1]: { name: 'Mk1 Compactor', description: 'Allows extraction of level 1 toxins from soil'},
    [AbilityType.SensorMk1]: { name: 'Mk1 Sensor', description: 'Allows excellent survey speed'},
    [AbilityType.Disruptor]: { name: 'Disruptor', description: 'Stuns mechanical creatures'},
    [AbilityType.BasicProcessor]: { name: 'Basic Purifyer', description: 'Processes basic toxins'}
}

export enum ItemType {
    Lead=1, Manganese=3, Gold=4, Arsenic=7, Titanium=8, Mercury=9, Cadmium=13, Benzene=14, 
    Copper=17, Cobalt=18,Asbestos=20,Petroleum=29,Rock=32,Move=81,Mine=85,Lithium=64,
    Palladium=24,Plastics=89,Pesticides=15
}

export enum StatusEffect {
    Invulnerable=3544,ColdBlooded=3522,Fear=3595,Poison=3658,Stun=3654,Chains,Charm,Steelskin,Mulch
}

export const StatusEffectData = {
    [StatusEffect.ColdBlooded]: {
        isPassive: true,
        title: 'Cold Blooded',
        description: ''
    },
    [StatusEffect.Invulnerable]: {
        isPassive: true,
        title: 'Invulnerable'
    },
    [StatusEffect.Fear]: {
        isPassive: false,
        title: 'Fear'
    },
    [StatusEffect.Poison]: {
        isPassive: false,
        title: 'Poisoned'
    },
    [StatusEffect.Stun]: {
        isPassive: false,
        title: 'Stunned'
    }
}

export enum RCObjectType {
    Base=76,Den=57,Cave1=35,Cave2=36,Town1=63,Town2=88,Town3=90,Fog=87,Pylon=68
}

export enum RCUnitType {
    Scout=0, LightCompactor=8, Ordinater=16, Defender=24, Processor=32
}

export const RCUnitTypes = [RCUnitType.Scout, RCUnitType.LightCompactor, RCUnitType.Ordinater, RCUnitType.Defender, RCUnitType.Processor]

export enum Modal {
    BotCreation, CharacterInfo, Menu
}

export enum Scenario {
    Tutorial="Tutorial",Hub='Hub'
}

export const ExtractorToxinList = {
    [AbilityType.ExtractorMk1]: [ItemType.Lead, ItemType.Manganese, ItemType.Gold, ItemType.Arsenic, ItemType.Titanium, ItemType.Mercury, 
        ItemType.Cadmium, ItemType.Benzene, ItemType.Copper, ItemType.Cobalt,ItemType.Asbestos,ItemType.Petroleum, ItemType.Lithium,
        ItemType.Palladium,ItemType.Plastics,ItemType.Pesticides]
}

export enum TerrainType {
    Any=-1,
    Woods=0,DenseWoods=1,SBushes=2,Dunes1=3,Dunes2=4,FrozenDunes=5,Mountain=6,Mountain2=7,
    Woods2=8,FrozenWoods=9,MBushes=10,ThickGrass=11,DesertGrass=12,FrozenGrass=13,Mountain3=14,Mountain4=15,
    DryForest=16,Barren=17,LBushes=18,SparseGrass=19,Cactus=20,FrozenRocks=21,Hill=22,FrozenHill=23,Huts=24,
    Minerals1=27,Minerals2=28,MediumGrass=29,Rocks=30,FrozenHill2=31,Cave1=35,Cave2=36,Cave3=57,
    Village1=88,Village2=90,Village3=63
}

export const CleanWater = [32,33,34,40,41,42,48,49,50]
export const PollutedWater = [64,65,66,72,73,74,80,81,82]

export const defaultProcessing = [ItemType.Titanium, ItemType.Plastics, ItemType.Pesticides, ItemType.Petroleum]

export const TerrainToxins = {
    [TerrainType.Any]: [],
    [TerrainType.Dunes1]: [ItemType.Cadmium, ItemType.Lead],
    [TerrainType.Dunes2]: [ItemType.Titanium, ItemType.Lead],
    [TerrainType.Rocks]: [ItemType.Asbestos, ItemType.Lithium],
    [TerrainType.DesertGrass]: [ItemType.Arsenic, ItemType.Pesticides]
}

export const TerrainLevels:{[key:number]: Array<TerrainType>} = {
    [TerrainType.Dunes1]: [TerrainType.DesertGrass, TerrainType.Cactus, TerrainType.SparseGrass],
    [TerrainType.Dunes2]: [TerrainType.DesertGrass, TerrainType.Cactus, TerrainType.SparseGrass],
    [TerrainType.Barren]: [TerrainType.DesertGrass, TerrainType.SparseGrass, TerrainType.MediumGrass],
    [TerrainType.DryForest]: [TerrainType.Woods2, TerrainType.DenseWoods, TerrainType.DenseWoods],
    [TerrainType.Minerals1]: [TerrainType.SBushes, TerrainType.MBushes, TerrainType.LBushes],
    [TerrainType.Minerals2]: [TerrainType.SBushes, TerrainType.MBushes, TerrainType.LBushes],
    [TerrainType.Rocks]: [TerrainType.SBushes, TerrainType.MBushes, TerrainType.LBushes],
    [TerrainType.DesertGrass]: [TerrainType.SparseGrass, TerrainType.MediumGrass, TerrainType.ThickGrass]
}

export type Resources = {
    [ItemType.Lead]: number
    [ItemType.Titanium]: number
    [ItemType.Copper]: number
    [ItemType.Palladium]: number
    [ItemType.Lithium]: number
}

export const defaultResources = {
    [ItemType.Lead]: 10,
    [ItemType.Lithium]: 10,
    [ItemType.Palladium]: 10,
    [ItemType.Titanium]: 10,
    [ItemType.Copper]: 10
}

export const Scenarios = [
]

export enum UIReducerActions {
    SHOW_MODAL, HIDE_MODAL, LOGIN_SUCCESS, LOGOUT, LOGIN_PENDING, LOGIN_FAILED,
    ENCOUNTER_UPDATED, JOIN_ENCOUNTER, UPDATE_ACCOUNT, ACTIVATE_ABILITY,
    START_MOVE,CLEAR_ABILITY,SPAWN_BOT,SELECT_UNIT,SELECT_DESTINATION,TILE_INFO,
    UPDATE_SELECT_UNIT,UPDATE_PLAYER,BUILD_PYLON,SELECT_BUILDING,UPDATE_SELECT_BUILDING,
    CHANGE_PRODUCTION,PAUSE_PRODUCTION,GATHER,UNGATHER
}

export enum Objects {
    PlayerSpawnPoint=6037,PatronSpawn=4429,Vault=7,VaultOpen=8,ViperDoor=1127
}

export const defaultDesigns:Array<RCUnitData> = [
    {
        name: 'Scout',
        droneType: RCUnitType.Scout,
        maxHp: 1,
        speed: 2,
        sight: 5,
        buildTime: 30000,
        statusEffect: [],
        inventory: [],
        maxInventory: 0,
        abilityTypes: [AbilityType.SensorMk1],
        requiredItems: [{ type: ItemType.Lithium, amount: 2}, { type: ItemType.Palladium, amount: 1}],
    },
    {
        name: 'Surface Compactor mk.1',
        droneType: RCUnitType.LightCompactor,
        maxHp: 1,
        speed: 1,
        sight: 1,
        buildTime: 15000,
        statusEffect: [],
        inventory: [],
        maxInventory: 2,
        abilityTypes: [AbilityType.ExtractorMk1],
        requiredItems: [{ type: ItemType.Lithium, amount: 2}, { type: ItemType.Titanium, amount: 1}]
    },
    {
        name: 'Ordinater',
        droneType: RCUnitType.Ordinater,
        maxHp: 1,
        speed: 1,
        sight: 2,
        buildTime: 50000,
        statusEffect: [],
        inventory: [],
        maxInventory: 0,
        abilityTypes: [AbilityType.Decrypter],
        requiredItems: [{ type: ItemType.Lithium, amount: 2}, { type: ItemType.Titanium, amount: 1}]
    },
    {
        name: 'Defender',
        droneType: RCUnitType.Defender,
        maxHp: 3,
        speed: 1,
        sight: 3,
        buildTime: 10000,
        statusEffect: [],
        inventory: [],
        maxInventory: 0,
        abilityTypes: [AbilityType.Disruptor],
        requiredItems: [{ type: ItemType.Lithium, amount: 2}, { type: ItemType.Titanium, amount: 1}]
    },
    {
        name: 'Processor',
        droneType: RCUnitType.Processor,
        maxHp: 1,
        speed: 0.5,
        sight: 1,
        buildTime: 10000,
        statusEffect: [],
        inventory: [],
        maxInventory: 0,
        abilityTypes: [AbilityType.BasicProcessor],
        requiredItems: [{ type: ItemType.Lithium, amount: 2}, { type: ItemType.Titanium, amount: 1}]
    }
]