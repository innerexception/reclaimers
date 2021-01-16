import { AbilityType, EquipmentType, ItemType, StatusEffect } from "../../constants";

export const AbilityData:Array<AbilityData> = [
    {
        title: 'Boss Fang',
        description: 'GiGi is forever young, her followers are always at full health. They take damage to their maximum hp instead. (Resets on returning home)',
        type: AbilityType.BossFang,
        cooldownIncrement: 34,
        statusEffects: [],
        damage: 1,
        range: 1,
        targets: 1,
        startFrame: 3267,
        endFrame: 3272
    },
]