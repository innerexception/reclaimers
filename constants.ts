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
    Dagger=3146,Rags=2404
}

export enum EquipmentType {
    Weapon='W',Armor='A'
}

export enum ItemType {
    SmallFang, SnakeSkin, Dagger=5571, Rags=5201
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

export enum NPCType {
    Jeeves=4983,MasterP=4868,Timmy=3791,ViperSpawn=4006,ViperBoss=3848
}

export enum Modal {
    Login, Matchmaking, CharacterCreation, Jobs, EncounterLobby, CharacterInfo, Inventory, Intro
}

export enum Scenario {
    Tutorial="Tutorial",Hub='Hub',Vipers='Vipers',Stonevault='Stonevault',Patrons='Patrons'
}

export const Scenarios = [
    Scenario.Vipers, Scenario.Stonevault
]

export enum UIReducerActions {
    SHOW_MODAL, HIDE_MODAL, LOGIN_SUCCESS, LOGOUT, LOGIN_PENDING, LOGIN_FAILED,
    ENCOUNTER_UPDATED, JOIN_ENCOUNTER, UPDATE_ACCOUNT, ACTIVATE_ABILITY, NEW_CHARACTER,
    START_MOVE,CLEAR_ABILITY
}

export enum Objects {
    PlayerSpawnPoint=6037,PatronSpawn=4429,Vault=7,VaultOpen=8,ViperDoor=1127
}