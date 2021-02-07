
interface UserAccount {
    id:string
    name:string
    completedMissionIds: Array<string>
    savedMission?: MapData
}

interface TileInfo {
    type: import('./constants').TerrainType
    toxins: Array<import('./constants').ItemType>
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
    swarmLeaderId?:string
    abilities: Array<Ability>
    hp:number
    tileX: number
    tileY: number
}

interface RCUnitData extends BasePCData {
    discovered?:boolean
    buildTime: number
    abilityTypes: Array<import('./constants').AbilityType>
    requiredItems: Array<{type: import('./constants').ItemType, amount:number}>
}

interface BasePCData {
    name: string
    droneType: import('./constants').RCUnitType
    maxHp: number
    speed: number
    sight: number
    statusEffect: Array<StatusEffectState>
    inventory: Array<import('./constants').ItemType>
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
    ac?:number
    weight?:number
    model?:import('./constants').ItemType
}

interface AbilityTargetingData {
    validTargetIds: Array<string>
    selectedTargetIds: Array<string>
    type: import('./constants').AbilityType
}

interface MapData {
    id:string
    players: Array<RCPlayerState>
    map: import('./constants').Scenario
    eventLog: Array<string>
}

interface RCPlayerState {
    id:string
    resources: import('./constants').Resources
}

interface RCBuildingState {
    id:string
    type: import('./constants').RCObjectType
    tileX:number
    tileY:number
    timer: number
    design: RCUnitData
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
    activeEncounter: MapData
    activeAbility: Ability
    selectedUnit: RCUnit
    selectedTile: TileInfo
    selectedBuilding: RCBuildingState
    engineEvent: { action: import('./constants').UIReducerActions, data: any }
}