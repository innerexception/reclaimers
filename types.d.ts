
interface UserAccount {
    id:string
    name:string
    completedMissionIds: Array<string>
    savedMission?: Encounter
}

interface TileInfo {
    type: import('./constants').TerrainType
    toxins: Array<import('./constants').Toxins>
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
    inventory: Array<import('./constants').ItemType | import('./constants').Toxins>
    maxInventory: number
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
    players: Array<RCPlayerState>
    map: import('./constants').Scenario
    eventLog: Array<string>
}

interface RCPlayerState {
    id:string
    designs: Array<RCUnitData>
    resources: import('./constants').Resources
}

interface RCUnitCommand {
    id:string
    characterId:string
    selectedTargetIds?: Array<string>, 
    type: import('./constants').AbilityType, 
    path?: Array<Tuple>
    newUnit?: RCUnit
}

interface ModalState {
    data?: any
    modal: import('./constants').Modal
}

interface RState {
    onlineAccount: UserAccount
    modalState: ModalState
    activeEncounter: Encounter
    activeAbility: Ability
    selectedUnit: RCUnit
    selectedTile: TileInfo
    engineEvent: { action: import('./constants').UIReducerActions, data: any }
}