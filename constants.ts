export const CharAppearanceStart = 5074
export const CharAppearanceEnd = 5189
export const WeaponBackground = 1806

export const MAX_TURN_TIMER=100
export const FONT_DEFAULT = {
    fontFamily: 'Body', 
    fontSize: '8px',
    color:'white'
}

//TODO: much later on if we do custom drone designer
// export enum AbilityType {
//     Destroy,Create,SensorMk1,ExtractorMk1,Decrypter,Disruptor
// }

export enum ItemType {
    Lead=1, Manganese=3, Gold=4, Arsenic=7, Titanium=8, Mercury=9, Cadmium=13, Benzene=14, 
    Copper=17, Cobalt=18,Asbestos=20,Petroleum=29,Rock=32,Move=81,Mine=85,Lithium=64,
    Palladium=24,Plastics=89,Pesticides=15,Uranium,Plutonium
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
    Base=76,Den=57,Cave1=35,Cave2=36,Town1=63,Town2=88,Town3=90,Fog=87,Pylon=68,AncientFactory=91,LeaderBadge=86
}

export enum RCUnitType {
    Scout=0, LightCompactor=8, Ordinater=16, Defender=24, RIProcessor=32, CHProcessor=40, HMProcessor=48,
    AncientSentry=160
}

export const RCUnitTypes = [RCUnitType.Scout, RCUnitType.LightCompactor, RCUnitType.Ordinater, RCUnitType.Defender, RCUnitType.CHProcessor, RCUnitType.HMProcessor, RCUnitType.RIProcessor]

export enum Modal {
    BotCreation, CharacterInfo, Menu
}

export enum Scenario {
    Tutorial="Tutorial",Hub='Hub'
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

export enum Objectives {
    BackupDisk,DiscoveredOrdinater,FindAnOrdinater,BaseDiscovered,BaseConverted
}

export const Scenarios = [
    {
        scenario: Scenario.Tutorial,
        intro: [
            "Solar activity increasing. Air particulates returning to normal. Radiation levels reduced.",
            "Sensing unit power restored. Retrieving directives...",
            "Err: Directory not found. No connectivity detected. Seek backup data."
        ],
        objectives: [
            {
                description: "Construct a scout drone and find a backup data source.",
                id: Objectives.BackupDisk,
                requires: []
            },
            {
                id: Objectives.DiscoveredOrdinater,
                description: "Use the ordinater drone to deliver the secret key to another facility",
                requires: [Objectives.FindAnOrdinater]
            },
            {
                id: Objectives.FindAnOrdinater,
                description: "Find a way to discover the secret key of this facility",
                requires: [Objectives.BaseDiscovered]
            },
            {
                id: Objectives.BaseDiscovered,
                description: "This facility is locked by a secret key.",
                requires: []
            },
            {
                id: Objectives.BaseConverted,
                description: "This facility is now under our control. Downloading directives...incompatible directive format found.",
                requires: [Objectives.DiscoveredOrdinater]
            }
        ]
    }
]

export enum UIReducerActions {
    SHOW_MODAL, HIDE_MODAL, LOGIN_SUCCESS, LOGOUT, LOGIN_PENDING, LOGIN_FAILED,
    ENCOUNTER_UPDATED, JOIN_ENCOUNTER, UPDATE_ACCOUNT, ACTIVATE_ABILITY,
    START_MOVE,CLEAR_ABILITY,SPAWN_BOT,SELECT_UNIT,SELECT_DESTINATION,TILE_INFO,
    UPDATE_SELECT_UNIT,UPDATE_PLAYER,BUILD_PYLON,SELECT_BUILDING,UPDATE_SELECT_BUILDING,
    CHANGE_PRODUCTION,PAUSE_PRODUCTION,GATHER,UNGATHER,UNSELECT_UNIT
}
            