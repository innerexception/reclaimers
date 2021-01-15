import * as React from 'react'
import { AbilityCard, Button } from '../util/SharedComponents';
import { connect } from 'react-redux';
import { onActivateAbility, onHideModal } from '../uiManager/Thunks';
import { AbilityType, NPCType } from '../../constants';
import { isPassive } from '../util/Util';

interface Props {
    encounter?: Encounter
    activeAbility?:Ability
    characterId:string
}

@(connect((state: RState) => ({
    encounter: state.activeEncounter,
    activeAbility: state.activeAbility
})) as any)
export default class Actionbar extends React.Component<Props> {

    render(){
        const charDat = this.props.encounter.playerCharacters.find(c=>c.id === this.props.characterId)
        const isActive = charDat.id === this.props.encounter.activeCharacterId
        return (
            <div style={{display:'table', background:'black', padding:'10px'}}>
                <div style={{display:"flex", justifyContent:'space-between', pointerEvents: isActive ? 'all' : 'none', opacity: isActive ? 1 : 0.5}}>
                    <div style={{marginRight:'1em', border: this.props.activeAbility?.type === AbilityType.Move ? '1px solid orange' : 'none'}}>
                        {AbilityCard(AbilityType.Move, ()=>onActivateAbility({type: AbilityType.Move, cooldown: 0, uses: 0}))}
                    </div>
                    {charDat.abilities.filter(a=>a.uses > -1).map(a=>
                    <div style={{border: this.props.activeAbility?.type === a.type ? '1px solid orange' : 'none'}}>
                        {AbilityCard(a.type, isPassive(a.type) ? null : ()=>onActivateAbility(a), a)}
                    </div>)}
                </div>
            </div>
        )
    }
}