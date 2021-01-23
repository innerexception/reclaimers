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
    Poke=1835,Empty=3258,SteelSkin=1955,Sort=2150,Filter=1839,Oil=1940,Decay=2086,Memories=1970,Balance=2155,Mulch=2164,Charge=1973,Fury=2012,
    Chains=1996,RightfulPlace=2152,Dilletant=2123,Masque=2022,Mirror=1946,Glitter=2037,StunningBeauty=2190,DepecheMode=2200,Fame=2074,ForeverYoung=1984,
    UncoverWeakness=2085,ChangeElements=1852,AncientKnowledge=1969,Fade=1976,Move=2187,BossFang,PoisonFang,
    Dagger=3146,Rags=2404,Destroy,Create,SensorMk1,ExtractorMk1
}

export enum EquipmentType {
    Weapon='W',Armor='A'
}

export enum ItemType {
    Lithium, Palladium, Titanium, Lead
}

export enum StatusEffect {
    Invulnerable=3544,ColdBlooded=3522,Fear=3595,Poison=3658,Stun=3654,Chains,Charm,Steelskin,Mulch
}

export enum Element {
    
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

export enum Toxins {
    Lead='Lead',Benzene='Benzene',Mercury='Mercury',Cadmium='Cadmium',Arsenic='Arsenic',Plutonium='Plutonium',Uranium='Uranium'
}

export const ExtractorToxinList = {
    [AbilityType.ExtractorMk1]: [Toxins.Lead, Toxins.Mercury]
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
    [TerrainType.Any]: [Toxins.Arsenic, Toxins.Benzene],
    [TerrainType.Dunes1]: [Toxins.Cadmium, Toxins.Lead]
}

export type Resources = {
    [ItemType.Lead]: number
    [ItemType.Lithium]: number
    [ItemType.Palladium]: number
    [ItemType.Titanium]: number
}

export const defaultResources = {
    [ItemType.Lead]: 0,
    [ItemType.Lithium]: 0,
    [ItemType.Palladium]: 0,
    [ItemType.Titanium]: 0
}

export const Scenarios = [
]

export enum UIReducerActions {
    SHOW_MODAL, HIDE_MODAL, LOGIN_SUCCESS, LOGOUT, LOGIN_PENDING, LOGIN_FAILED,
    ENCOUNTER_UPDATED, JOIN_ENCOUNTER, UPDATE_ACCOUNT, ACTIVATE_ABILITY,
    START_MOVE,CLEAR_ABILITY,SPAWN_BOT,SELECT_UNIT,SELECT_DESTINATION,TILE_INFO,
    UPDATE_SELECT_UNIT
}

export enum Objects {
    PlayerSpawnPoint=6037,PatronSpawn=4429,Vault=7,VaultOpen=8,ViperDoor=1127
}