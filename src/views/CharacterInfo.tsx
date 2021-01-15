import * as React from 'react'
import AppStyles from '../../AppStyles';
import { Button, CssIcon } from '../util/SharedComponents';
import { connect } from 'react-redux';
import { onHideModal } from '../uiManager/Thunks';
import { NPCType, StatusEffectData } from '../../constants';
import Crafting from './Crafting';
import Footer from '../components/Footer';
import Jeeves from './Jeeves';
import Tooltip from 'rc-tooltip';

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
        const charDat = this.props.encounter.playerCharacters.find(c=>c.id === this.props.characterId)
        if(charDat.avatarIndex === NPCType.Jeeves) return <Jeeves activeEncounter={this.props.encounter} myId={this.props.onlineAccount.id}/>
        if(charDat.avatarIndex === NPCType.MasterP) return <Crafting/>
        return (
            <div style={{...AppStyles.modal, justifyContent:'space-between'}}>
                <div style={{width:'85%', height:'85%'}}>
                    <h2>{charDat.name}</h2>
                    <h5>hp: {charDat.currentStatus.hp}</h5>
                    <h5>moves: {charDat.currentStatus.moves}</h5>
                    <h5>turn: (0=Active) {charDat.currentStatus.turnCounter}</h5>
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