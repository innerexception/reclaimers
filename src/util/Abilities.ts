import { store } from "../../App"
import { AbilityType, MAX_TURN_TIMER, StatusEffect, StatusEffectData } from "../../constants"
import Network from "../../firebase/Network"
import CharacterSprite from "../CharacterSprite"
import { getNextChar } from "./Util"

export const resolveAbility = (encounter:Encounter, targetingAbility:AbilityData, targetList:Array<string>, sprites:Array<CharacterSprite>, caster:PlayerCharacter) => {
    encounter.playerCharacters.forEach(c=>{
        if(targetList.includes(c.id)){
            encounter.eventLog.push(caster.name+' used '+targetingAbility.title+' on '+c.name)
            targetingAbility.statusEffects.forEach(e=>{
                c = applyStatusEffect(c, e)
                encounter.eventLog.push(c.name+' is affected by '+StatusEffectData[e].title)
            })
            c.currentStatus.hp -= targetingAbility.damage
        }
        c.currentStatus.turnCounter -= c.speed
    })
    return encounter
}

export const resolveStatusEffects = (c:PlayerCharacter, sprite:CharacterSprite) => {
    c.statusEffect.forEach(status=>{
        switch(status.type){
            case StatusEffect.Poison:
            //Higher poison levels cause more damage
            const dmg = Math.max(0, Math.round(c.statusEffect.filter(s=>s.type===StatusEffect.Poison).length * 0.5) - 2)
            c.currentStatus.hp-=dmg
            sprite.floatDamage(dmg, 'green')
            break
        }
    })
    c.statusEffect = c.statusEffect.filter(status=>{
        if(status.duration){
            status.duration--
            if(status.duration <= 0) return false
        }
        return true
    })
    return c
}

export const applyStatusEffect = (character:PlayerCharacter, effect:StatusEffect) => {
    switch(effect){
        case StatusEffect.Fear:
            //Prevented by fear immunity passives
            character.statusEffect.push({type: StatusEffect.Fear, duration: 3})
            break
        case StatusEffect.Invulnerable:
            //Cancels all damaging status
            character.statusEffect.push({type: StatusEffect.Invulnerable})
            break
        case StatusEffect.Poison:
            character.statusEffect.push({type: StatusEffect.Poison, duration: 3})
            break
        case StatusEffect.Stun:
            //Negated by Rocksteady status
            character.statusEffect.push({type: StatusEffect.Stun, duration: 2})
            break
    }
    return character
}

export const networkExecuteCharacterMove = (characterId:string, path:Array<Tuple>) => {
    let encounter = store.getState().activeEncounter
    encounter.lastCharacterAction = {
        characterId,
        path,
        type: AbilityType.Move, 
        completedByPlayers: []
    }
    const nextChar = getNextChar(encounter.playerCharacters)
    encounter.activeCharacterId = nextChar.id
    encounter.playerCharacters.forEach(c=>{if(c.id === nextChar.id) c.currentStatus.turnCounter = MAX_TURN_TIMER})
    Network.upsertMatch(encounter)
}

export const networkExecuteCharacterAbility = (characterId:string, targetingData:AbilityTargetingData) => {
    let encounter = store.getState().activeEncounter
    encounter.lastCharacterAction = {
        characterId,
        selectedTargetIds: targetingData.selectedTargetIds, 
        type: targetingData.type, 
        completedByPlayers: []
    }
    const nextChar = getNextChar(encounter.playerCharacters)
    encounter.activeCharacterId = nextChar.id
    encounter.playerCharacters.forEach(c=>{if(c.id === nextChar.id) c.currentStatus.turnCounter = MAX_TURN_TIMER})
    Network.upsertMatch(encounter)
}