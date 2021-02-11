import { AbilityType, ItemType, RCUnitType } from "../../constants";

export const NPCData:{[key in RCUnitType]:RCUnitData} = {
    [RCUnitType.AncientSentry]: {
        name: 'Anchient Sentry',
        droneType: RCUnitType.AncientSentry,
        maxHp: 2,
        speed: 1,
        sight: 3,
        statusEffect: [],
        inventory: [],
        maxInventory: 1,
        buildTime: 10000,
        abilityTypes: [AbilityType.Disruptor],
        requiredItems: []
    },
    [RCUnitType.Scout]: {
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
    [RCUnitType.LightCompactor]: {
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
    [RCUnitType.Ordinater]: {
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
    [RCUnitType.Defender]: {
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
    [RCUnitType.Processor]: {
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
}

export const defaultDesigns:Array<RCUnitData> = [
    NPCData[RCUnitType.Scout],NPCData[RCUnitType.Processor],NPCData[RCUnitType.Ordinater],NPCData[RCUnitType.LightCompactor],NPCData[RCUnitType.Defender],
]