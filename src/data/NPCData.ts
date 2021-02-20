import { ItemType, RCAnimalType, RCDroneType } from "../../constants";

const defaultItems = [ItemType.Titanium, ItemType.Copper, ItemType.Gold]

export const CreatureData:{[key in RCAnimalType]:RCAnimalData} = {
    [RCAnimalType.Bear]: {
        name: 'Anchient Sentry',
        animalType: RCAnimalType.Bear,
        maxHp: 2,
        speed: 0.5,
        sight: 3
    },
    [RCAnimalType.Deer]: {
        name: 'Anchient Sentry',
        animalType: RCAnimalType.Deer,
        maxHp: 2,
        speed: 0.75,
        sight: 3
    },
    [RCAnimalType.Fox]: {
        name: 'Anchient Sentry',
        animalType: RCAnimalType.Fox,
        maxHp: 2,
        speed: 1,
        sight: 3
    },
    [RCAnimalType.Rabbit]: {
        name: 'Anchient Sentry',
        animalType: RCAnimalType.Rabbit,
        maxHp: 2,
        speed: 1,
        sight: 3
    },
    [RCAnimalType.Wolf]: {
        name: 'Anchient Sentry',
        animalType: RCAnimalType.Wolf,
        maxHp: 2,
        speed: 0.8,
        sight: 3
    },
}

export const NPCData:{[key in RCDroneType]:RCUnitData} = {
    [RCDroneType.AncientSentry]: {
        name: 'Anchient Sentry',
        unitType: RCDroneType.AncientSentry,
        maxHp: 2,
        speed: 1,
        sight: 3,
        maxInventory: 1,
        buildTime: 30000,
        requiredItems: [],
        isAI: true
    },
    [RCDroneType.Scout]: {
        name: 'Scout',
        unitType: RCDroneType.Scout,
        maxHp: 1,
        speed: 2,
        sight: 5,
        buildTime: 30000,
        maxInventory: 0,
        requiredItems: [{ type: ItemType.Lithium, amount: 2}, { type: ItemType.Palladium, amount: 1}],
    },
    [RCDroneType.ToxinExtractor]: {
        name: 'Toxin Extractor',
        unitType: RCDroneType.ToxinExtractor,
        maxHp: 1,
        speed: 1,
        sight: 2,
        buildTime: 15000,
        maxInventory: 2,
        requiredItems: [{ type: ItemType.Lithium, amount: 2}, { type: ItemType.Titanium, amount: 1}]
    },
    [RCDroneType.Ordinater]: {
        name: 'Ordinater',
        unitType: RCDroneType.Ordinater,
        maxHp: 100,
        speed: 0.5,
        sight: 2,
        buildTime: 10000,
        maxInventory: 0,
        requiredItems: [{ type: ItemType.Lithium, amount: 2}, { type: ItemType.Titanium, amount: 1}]
    },
    [RCDroneType.Defender]: {
        name: 'Defender',
        unitType: RCDroneType.Defender,
        maxHp: 3,
        speed: 1,
        sight: 3,
        buildTime: 10000,
        maxInventory: 0,
        requiredItems: [{ type: ItemType.Lithium, amount: 2}, { type: ItemType.Titanium, amount: 1}]
    },
    [RCDroneType.HMProcessor]: {
        name: 'HM Processor',
        unitType: RCDroneType.HMProcessor,
        maxHp: 1,
        speed: 0.5,
        sight: 1,
        buildTime: 10000,
        maxInventory: 0,
        processesItems: [ItemType.Cadmium, ItemType.Lead, ItemType.Gold, ItemType.Lithium, ItemType.Mercury, ItemType.Manganese, ItemType.Palladium].concat(defaultItems),
        requiredItems: [{ type: ItemType.Lithium, amount: 2}, { type: ItemType.Titanium, amount: 1}]
    },
    [RCDroneType.RIProcessor]: {
        name: 'RI Processor',
        unitType: RCDroneType.RIProcessor,
        maxHp: 1,
        speed: 0.5,
        sight: 1,
        buildTime: 10000,
        maxInventory: 0,
        processesItems: [ItemType.Cobalt, ItemType.Uranium, ItemType.Plutonium].concat(defaultItems),
        requiredItems: [{ type: ItemType.Lithium, amount: 2}, { type: ItemType.Titanium, amount: 1}]
    },
    [RCDroneType.CHProcessor]: {
        name: 'Chem Processor',
        unitType: RCDroneType.CHProcessor,
        maxHp: 1,
        speed: 0.5,
        sight: 1,
        buildTime: 10000,
        maxInventory: 0,
        processesItems: [ItemType.Arsenic, ItemType.Asbestos, ItemType.Benzene, ItemType.Petroleum, ItemType.Pesticides, ItemType.Plastics].concat(defaultItems),
        requiredItems: [{ type: ItemType.Lithium, amount: 2}, { type: ItemType.Titanium, amount: 1}]
    }
}



export const defaultDesigns = [NPCData[RCDroneType.Scout], NPCData[RCDroneType.ToxinExtractor], NPCData[RCDroneType.CHProcessor], NPCData[RCDroneType.Ordinater]]