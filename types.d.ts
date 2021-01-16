interface UserAccount {
    id:string
    email:string
    name:string
    encounterId: string
    completedMissionIds: Array<string>
}

interface Tuple {
    x:number
    y:number
}

interface UnitMove {
    characterId: string
    route: Array<Tuple>
}

interface RCUnit extends BasePCData {
    id:string
    ownerId?:string
    abilities: Array<Ability>
    hp:number
    moves:number
    tileX: number
    tileY: number
}

interface RCUnitData extends BasePCData {
    abilityTypes: Array<import('./constants').AbilityType>
    requiredItems: Array<{type: import('./constants').ItemType, amount:number}>
}

interface BasePCData {
    name: string
    avatarIndex: import('./constants').RCUnitType
    maxHp: number
    maxMoves: number
    speed: number
    sight: number
    statusEffect: Array<StatusEffectState>
    inventory: Array<import('./constants').ItemType>
}

interface StatusEffectState {
    type: import('./constants').StatusEffect
    duration?: number
    casterId?: string
}

interface Ability {
    type: import('./constants').AbilityType
    cooldown: number
    uses: number
}

interface AbilityData {
    title: string
    description: string
    type: import('./constants').AbilityType
    cooldownIncrement?: number
    statusEffects: Array<import('./constants').StatusEffect>
    damage: number
    piercing?:number
    range: number
    targets: number
    areaEffectRadius?:number
    startFrame: number
    endFrame: number
    isPassive?: boolean
    slot?: import('./constants').EquipmentType
    ac?:number
    element?:import('./constants').Element
    weight?:number
    model?:import('./constants').ItemType
}

interface AbilityTargetingData {
    validTargetIds: Array<string>
    selectedTargetIds: Array<string>
    type: import('./constants').AbilityType
}

interface Encounter {
    id:string
    entities: Array<RCUnit>
    players: Array<RCPlayerState>
    map: import('./constants').Scenario
    eventLog: Array<string>
    unitActionQueue: Array<RCUnitCommand>
}

interface RCPlayerState {
    id:string
    designs: Array<RCUnitData>
}

interface RCUnitCommand {
    characterId:string
    selectedTargetIds?: Array<string>, 
    type: import('./constants').AbilityType, 
    completedByPlayers: Array<string> 
    path?: Array<Tuple>
}

interface ModalState {
    data?: any
    modal: import('./constants').Modal
}

interface RState {
    onlineAccount: UserAccount
    modalState: ModalState
    loginInProgress: boolean
    activeEncounter: Encounter
    activeAbility: Ability
    activeCharacterId: string
    engineEvent: { action: import('./constants').UIReducerActions, data: any }
}