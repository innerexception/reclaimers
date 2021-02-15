import { ItemType, RCUnitType } from "../../constants";

const defaultItems = [ItemType.Titanium, ItemType.Copper, ItemType.Gold]

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
        buildTime: 30000,
        requiredItems: [],
        isAI: true
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
        requiredItems: [{ type: ItemType.Lithium, amount: 2}, { type: ItemType.Titanium, amount: 1}]
    },
    [RCUnitType.Ordinater]: {
        name: 'Ordinater',
        droneType: RCUnitType.Ordinater,
        maxHp: 100,
        speed: 1,
        sight: 2,
        buildTime: 10000,
        statusEffect: [],
        inventory: [],
        maxInventory: 0,
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
        requiredItems: [{ type: ItemType.Lithium, amount: 2}, { type: ItemType.Titanium, amount: 1}]
    },
    [RCUnitType.HMProcessor]: {
        name: 'HM Processor',
        droneType: RCUnitType.HMProcessor,
        maxHp: 1,
        speed: 0.5,
        sight: 1,
        buildTime: 10000,
        statusEffect: [],
        inventory: [],
        maxInventory: 0,
        processesItems: [ItemType.Cadmium, ItemType.Lead, ItemType.Gold, ItemType.Lithium, ItemType.Mercury, ItemType.Manganese, ItemType.Palladium].concat(defaultItems),
        requiredItems: [{ type: ItemType.Lithium, amount: 2}, { type: ItemType.Titanium, amount: 1}]
    },
    [RCUnitType.RIProcessor]: {
        name: 'RI Processor',
        droneType: RCUnitType.RIProcessor,
        maxHp: 1,
        speed: 0.5,
        sight: 1,
        buildTime: 10000,
        statusEffect: [],
        inventory: [],
        maxInventory: 0,
        processesItems: [ItemType.Cobalt, ItemType.Uranium, ItemType.Plutonium].concat(defaultItems),
        requiredItems: [{ type: ItemType.Lithium, amount: 2}, { type: ItemType.Titanium, amount: 1}]
    },
    [RCUnitType.CHProcessor]: {
        name: 'Chem Processor',
        droneType: RCUnitType.CHProcessor,
        maxHp: 1,
        speed: 0.5,
        sight: 1,
        buildTime: 10000,
        statusEffect: [],
        inventory: [],
        maxInventory: 0,
        processesItems: [ItemType.Arsenic, ItemType.Asbestos, ItemType.Benzene, ItemType.Petroleum, ItemType.Pesticides, ItemType.Plastics].concat(defaultItems),
        requiredItems: [{ type: ItemType.Lithium, amount: 2}, { type: ItemType.Titanium, amount: 1}]
    }
}

export const defaultDesigns = [NPCData[RCUnitType.Scout], NPCData[RCUnitType.LightCompactor], NPCData[RCUnitType.CHProcessor], NPCData[RCUnitType.Ordinater]]