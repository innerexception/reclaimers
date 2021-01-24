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
    Destroy,Create,SensorMk1,ExtractorMk1
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
    Base=76,Den=57,Cave1=35,Cave2=36,Town1=63,Town2=88,Town3=90,Fog=87
}

export enum RCUnitType {
    Scout=0, LightCompactor=9
}

export const RCUnitTypes = [RCUnitType.Scout, RCUnitType.LightCompactor]

export enum Modal {
    BotCreation, CharacterInfo, BotSpawn, Menu
}

export enum Scenario {
    Tutorial="Tutorial",Hub='Hub'
}

export const ExtractorToxinList = {
    [AbilityType.ExtractorMk1]: [ItemType.Lead, ItemType.Mercury, ItemType.Plastics, ItemType.Petroleum, ItemType.Pesticides]
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

export const TerrainToxins = {
    [TerrainType.Any]: [ItemType.Plastics, ItemType.Petroleum, ItemType.Pesticides],
    [TerrainType.Dunes1]: [ItemType.Cadmium, ItemType.Lead]
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
    [ItemType.Lead]: 0,
    [ItemType.Lithium]: 0,
    [ItemType.Palladium]: 0,
    [ItemType.Titanium]: 0,
    [ItemType.Copper]: 0
}

export const Scenarios = [
]

export enum UIReducerActions {
    SHOW_MODAL, HIDE_MODAL, LOGIN_SUCCESS, LOGOUT, LOGIN_PENDING, LOGIN_FAILED,
    ENCOUNTER_UPDATED, JOIN_ENCOUNTER, UPDATE_ACCOUNT, ACTIVATE_ABILITY,
    START_MOVE,CLEAR_ABILITY,SPAWN_BOT,SELECT_UNIT,SELECT_DESTINATION,TILE_INFO,
    UPDATE_SELECT_UNIT,UPDATE_PLAYER
}

export enum Objects {
    PlayerSpawnPoint=6037,PatronSpawn=4429,Vault=7,VaultOpen=8,ViperDoor=1127
}