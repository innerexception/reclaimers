import { AbilityType, NPCType, StatusEffect } from "../../constants";

export const NPCData:{[key:string]:NPCData} = {
    [NPCType.Jeeves]: {
        name: 'Jeeves',
        avatarIndex: NPCType.Jeeves,
        maxHp: 1,
        maxMoves: 0,
        speed: 0,
        sight: 1,
        abilityTypes: [],
        inventory: [],
        statusEffect: [{type:StatusEffect.Invulnerable}],
    },
    [NPCType.Timmy]: {
        name: 'Timmy',
        avatarIndex: NPCType.Timmy,
        sight: 1,
        abilityTypes: [],
        inventory: [],
        maxHp: 1,
        maxMoves: 0,
        speed: 0,
        statusEffect: [{type:StatusEffect.Invulnerable}],
    },
    [NPCType.ViperSpawn]: {
        name: 'Viper Spawn',
        avatarIndex: NPCType.ViperSpawn,
        sight: 3,
        abilityTypes: [AbilityType.PoisonFang],
        inventory: [],
        maxHp: 1,
        maxMoves: 4,
        speed: 10,
        statusEffect: [{type:StatusEffect.ColdBlooded}],
    },
    [NPCType.ViperBoss]: {
        name: 'The Viper',
        avatarIndex: NPCType.ViperBoss,
        sight: 1,
        abilityTypes: [AbilityType.BossFang],
        inventory: [],
        maxHp: 10,
        maxMoves: 4,
        speed: 15,
        statusEffect: [{type:StatusEffect.ColdBlooded}],
    }
}