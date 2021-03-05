export const FONT_DEFAULT = {
    fontFamily: 'Body', 
    fontSize: '8px',
    color:'white'
}

export enum TechnologyType {
    Jets, Regeneration, DefenderWeapons, DefenderArmor,
    ProcessingGroup1, ProcessingGroup2, ProcessingGroup3
}

export enum ItemType {
    Lead=1, Manganese=3, Gold=4, Arsenic=7, Titanium=8, Mercury=9, Cadmium=13, Benzene=14, 
    Copper=17, Cobalt=18,Asbestos=20,Petroleum=29,Lithium=64,Rock=62,
    Palladium=24,Plastics=89,Pesticides=15,Uranium,Plutonium
}

export const Technologies:Array<Technology> = [
    {
        type: TechnologyType.Jets,
        messages: ['Extractors and scouts can travel anywhere!'] 
    },
    {
        type: TechnologyType.Regeneration,
        messages: ['Ordinaters heal drones near them!'] 
        //TODO: Ords regenerate nearby drones
    },
    {
        type: TechnologyType.DefenderArmor,
        messages: ['The defenders become hardened...'] 
    },
    {
        type: TechnologyType.DefenderWeapons,
        messages: ['The defenders gained new weapons!']
    },
    {
        messages: ['Purifiers learn the secrets of new toxins!'],
        type: TechnologyType.ProcessingGroup1,
        extractItems: [ItemType.Manganese, ItemType.Gold, ItemType.Arsenic, ItemType.Mercury, ItemType.Cadmium]
    },
    {
        messages: ['Purifiers learn the secrets of new toxins!'],
        type: TechnologyType.ProcessingGroup2,
        extractItems: [ItemType.Benzene, ItemType.Copper, ItemType.Cobalt, ItemType.Asbestos, ItemType.Lithium]
    },
    {
        messages: ['Purifiers learn the secrets of new toxins!'],
        type: TechnologyType.ProcessingGroup3,
        extractItems: [ItemType.Palladium, ItemType.Uranium, ItemType.Plutonium]
    },
]

export const defaultProcessing = [ItemType.Titanium, ItemType.Plastics, ItemType.Pesticides, ItemType.Petroleum]

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
    Base=76,Den=57,Cave1=35,Cave2=36,Town1=63,Town2=88,Fog=87,Pylon=68,WarFactory=91,InactiveFactory=92,LeaderBadge=86,Lab=90,InactiveLab=93
}

export enum RCDroneType {
    Scout=0, ToxinExtractor=8, Ordinater=16, Defender=24, Processor=40, AncientSentry=160, RedSentry=168
}

export const RCUnitTypes = [RCDroneType.Scout, RCDroneType.ToxinExtractor, RCDroneType.Ordinater, RCDroneType.Defender, RCDroneType.Processor]

export enum RCAnimalType {
    Rabbit='rabbit',Fox='fox',Bear='bear',Deer='deer',Wolf='wolf'
}

export const RCAnimalTypes = [RCAnimalType.Bear,RCAnimalType.Deer,RCAnimalType.Fox,RCAnimalType.Rabbit,RCAnimalType.Wolf]

export enum Modal {
    BotCreation, CharacterInfo, Menu,MainMenu,Dialog
}

export enum Scenario {
    LightOfTheWorld="LightOfTheWorld",Ordinaters='Ordinaters'
}


export enum TerrainType {
    Any=-1,
    Woods=0,DenseWoods=1,SBushes=2,Dunes1=3,Dunes2=4,FrozenDunes=5,Mountain=6,Mountain2=7,
    Woods2=8,FrozenWoods=9,MBushes=10,ThickGrass=11,DesertGrass=12,FrozenGrass=13,Mountain3=14,Mountain4=15,
    DryForest=16,Barren=17,LBushes=18,SparseGrass=19,Cactus=20,FrozenRocks=21,Hill=22,FrozenHill=23,Huts=24,
    Minerals1=27,Minerals2=28,MediumGrass=29,Rocks=30,FrozenHill2=31,Cave1=35,Cave2=36,Cave3=57,
    Village1=88,Village2=90,Village3=63
}

export const TileEvents = {
    [TerrainType.Cave1]: {
        messages: ['Cave 1!']
    },
    [TerrainType.Cave2]: {
        messages: ['Cave 2!']
    },
    [TerrainType.Cave3]: {
        messages: ['Cave 3!']
    },
    [TerrainType.Village3]: {
        messages: ['Village 1!']
    }
}

export const CleanWater = [32,33,34,40,41,42,48,49,50]
export const PollutedWater = [64,65,66,72,73,74,80,81,82]

export const TerrainToxins = {
    [TerrainType.Any]: [ItemType.Pesticides, ItemType.Plastics, ItemType.Petroleum],
    [TerrainType.Dunes1]: [ItemType.Cadmium, ItemType.Lead, ItemType.Asbestos],
    [TerrainType.Dunes2]: [ItemType.Titanium, ItemType.Lead],
    [TerrainType.Rocks]: [ItemType.Asbestos, ItemType.Lithium],
    [TerrainType.DesertGrass]: [ItemType.Arsenic, ItemType.Pesticides],
    [TerrainType.DryForest]: [ItemType.Arsenic],
    [TerrainType.Minerals1]: [ItemType.Cobalt, ItemType.Lithium, ItemType.Manganese, ItemType.Copper],
    [TerrainType.Minerals2]: [ItemType.Mercury, ItemType.Palladium, ItemType.Plutonium, ItemType.Gold],
    [TerrainType.Barren]: [ItemType.Benzene, ItemType.Arsenic]
}

export const TerrainLevels:{[key:number]: Array<TerrainType>} = {
    [TerrainType.Dunes1]: [TerrainType.SparseGrass, TerrainType.Cactus, TerrainType.DesertGrass],
    [TerrainType.Dunes2]: [TerrainType.SparseGrass, TerrainType.Cactus, TerrainType.DesertGrass],
    [TerrainType.Barren]: [TerrainType.MediumGrass, TerrainType.SparseGrass,TerrainType.DesertGrass],
    [TerrainType.DryForest]: [TerrainType.DenseWoods, TerrainType.DenseWoods, TerrainType.Woods2],
    [TerrainType.Minerals1]: [TerrainType.LBushes, TerrainType.MBushes,TerrainType.SBushes],
    [TerrainType.Minerals2]: [TerrainType.LBushes,TerrainType.MBushes,TerrainType.SBushes],
    [TerrainType.Rocks]: [TerrainType.LBushes, TerrainType.MBushes, TerrainType.SBushes],
    [TerrainType.DesertGrass]: [TerrainType.ThickGrass, TerrainType.MediumGrass, TerrainType.SparseGrass]
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
    BackupDisk,DiscoveredOrdinater,FindAnOrdinater,BaseDiscovered,BaseConverted,Purify20,
    BuildExtractor,BuildProcessor,PurifyWorld,ForbiddenFactoryDiscovered,BuildDefender,
    ForbiddenFactoryConverted,UnderEarth1,UnderEarth2
}

export enum UIReducerActions {
    SHOW_MODAL, HIDE_MODAL, LOGIN_SUCCESS, LOGOUT, LOGIN_PENDING, LOGIN_FAILED,
    ENCOUNTER_UPDATED, JOIN_ENCOUNTER, UPDATE_ACCOUNT, ACTIVATE_ABILITY,
    START_MOVE,CLEAR_ABILITY,SPAWN_BOT,SELECT_UNIT,SELECT_DESTINATION,TILE_INFO,
    UPDATE_SELECT_UNIT,UPDATE_PLAYER,BUILD_PYLON,SELECT_BUILDING,UPDATE_SELECT_BUILDING,
    CHANGE_PRODUCTION,PAUSE_PRODUCTION,GATHER,UNGATHER,UNSELECT_UNIT,MAP_VIEW,RESEARCH
}
            