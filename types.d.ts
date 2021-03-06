interface TileInfo {
    type: import('./constants').TerrainType
    toxins: Array<import('./constants').ItemType>
    alpha: number
}

interface Tuple {
    x:number
    y:number
}

interface UnitMove {
    characterId: string
    route: Array<Tuple>
}

interface Technology {
    messages: Array<string>
    type: import('./constants').TechnologyType
    extractItems?: Array<import('./constants').ItemType>
}

interface RCUnit extends RCUnitData {
    id:string
    isAI?:boolean
    isSwarmLeader: boolean
    swarmLeaderId?:string
    hp:number
    hover?:boolean
    regenerater?:boolean
    weaponLevel:number
    tileX: number
    tileY: number
    unitType: import('./constants').RCDroneType
    inventory: Array<import('./constants').ItemType>
}

interface RCAnimal extends RCAnimalData {
    id:string
    hp:number
    tileX: number
    tileY: number
}

interface RCAnimalData {
    animalType: import('./constants').RCAnimalType
    name:string 
    speed: number
    sight: number
    maxHp: number
    hover?:boolean
}

interface RCUnitData {
    unitType: import('./constants').RCDroneType
    discovered?:boolean
    isAI?:boolean
    buildTime: number
    requiredItems: Array<{type: import('./constants').ItemType, amount:number}>
    name: string
    maxHp: number
    speed: number
    sight: number
    processesItems?: Array<import('./constants').ItemType>
    maxInventory: number
}

interface StatusEffectState {
    type: import('./constants').StatusEffect
    duration?: number
    casterId?: string
}

interface ScenarioConfig {
    scenario:import('./constants').Scenario
    intro: Array<string>
    defaultDesigns: Array<RCUnitData>
    buildings: Array<RCBuildingConfig>
}

interface MapData {
    map: import('./constants').Scenario
    tileData: Array<Array<TileInfo>>
    entities: Array<RCUnit>
    buildings: Array<RCBuildingState>
    cleanedTileCount: number
}

interface RCPlayerState {
    resources: import('./constants').Resources
    completedObjectives: Array<import('./constants').Objectives>
    cleanedTileCount: number
    technologies: Array<Technology>
    id:string
    name:string
    savedState: Array<MapData>
}

interface RCBuildingConfig {
    type: import('./constants').RCObjectType
    activeDroneDesign?: RCUnitData
    availableDroneDesigns?: Array<RCUnitData>
    maxProduction?:number
}

interface RCBuildingState extends RCBuildingConfig {
    id:string
    tileX:number
    tileY:number
    timer: number
}

interface TileEvent { 
    messages: Array<string>, 
    objective:import('./constants').Objectives, 
    enemy?: import('./constants').RCDroneType, 
    choices?:Array<import('./constants').Objectives>,
    rewards?: Array<import('./constants').RCDroneType>
}

interface ModalState {
    data?: TileEvent
    modal: import('./constants').Modal
}

interface RState {
    onlineAccount: RCPlayerState
    modalState: ModalState
    activeEncounter: MapData
    selectedUnit: RCUnit
    selectedTile: TileInfo
    selectedBuilding: RCBuildingState
    engineEvent: { action: import('./constants').UIReducerActions, data: any }
}