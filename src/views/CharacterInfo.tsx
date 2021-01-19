import * as React from 'react'
import AppStyles, { colors } from '../../AppStyles';
import { Button, CssIcon } from '../util/SharedComponents';
import { connect } from 'react-redux';
import { onSelectUnitDestination } from '../uiManager/Thunks';
import { RCUnitType, StatusEffectData } from '../../constants';
import Footer from '../components/Footer';

interface Props {
    encounter?: Encounter
    onlineAccount?: UserAccount
    characterId:string
}

@(connect((state: RState) => ({
    encounter: state.activeEncounter,
    onlineAccount: state.onlineAccount
})) as any)
export default class CharacterInfo extends React.Component<Props> {

    render(){
        const charDat = this.props.encounter && this.props.encounter.entities.find(c=>c.id === this.props.characterId)
        return (
            <div style={{...styles, width:'250px', minHeight:'200px'}}>
                {charDat ? 
                <div>
                    <h2>{charDat.name}</h2>
                    <h5>hp: {charDat.hp}</h5>
                    <h5>moves: {charDat.moves}</h5>
                    <h5>speed: {charDat.speed}</h5>
                    <h5>status: {Array.from(new Set(charDat.statusEffect.map(s=>s.type))).map(s=>
                        <div style={{display:'flex', alignItems:'flex-end'}}>
                            {CssIcon(s,1)}
                            <h5 style={{marginLeft:'0.5em'}}>{StatusEffectData[s].title}</h5>
                        </div>)}
                    </h5>
                    <div>
                        {Button(true, onSelectUnitDestination, 'Move')}
                    </div>
                </div>: <h4>No Selection</h4>}
            </div>
        )
    }
}

const styles = {
    border: '3px inset',
    borderColor: 'silver',
    color: colors.lGreen,
    padding:'5px'
}