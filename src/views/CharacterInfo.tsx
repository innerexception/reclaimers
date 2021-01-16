import * as React from 'react'
import AppStyles from '../../AppStyles';
import { Button, CssIcon } from '../util/SharedComponents';
import { connect } from 'react-redux';
import { onHideModal } from '../uiManager/Thunks';
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
        const charDat = this.props.encounter.entities.find(c=>c.id === this.props.characterId)
        return (
            <div style={{...AppStyles.modal, justifyContent:'space-between'}}>
                <div style={{width:'85%', height:'85%'}}>
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
                    <hr/>
                    {Button(true, onHideModal, 'Ok')}
                </div>
                <Footer/>
            </div>
        )
    }
}