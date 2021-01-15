import * as React from 'react'
import AppStyles, { colors } from '../../AppStyles';
import { AbilityCard, Button } from '../util/SharedComponents';
import { Modal, NPCType, Scenario, Scenarios } from '../../constants';
import { onHideModal, onShowModal, onCreateEncounter } from '../uiManager/Thunks';
import Footer from '../components/Footer';
import Speech from '../components/Speech';
import { getNewEncounter } from '../util/Util';
import { store } from '../../App';

interface Props {
    activeEncounter:Encounter
    myId:string
}

export default class Jeeves extends React.Component<Props> {

    render(){
        const me = store.getState().onlineAccount.characters[0]//TODO: active character id
        return (
            <div style={{...AppStyles.modal, width:'700px', height:'66vh', justifyContent:'space-between'}}>
                {this.props.activeEncounter.map === Scenario.Hub ? 
                <div>
                    {Speech(NPCType.Jeeves, '<h6>Greetings denizen! How will you please your patrons today?</h6>')}
                    {Button(true, ()=>onCreateEncounter(getNewEncounter(Scenario.Tutorial, me), me.id), 'Practice Cell')}
                    {Scenarios.map(s=>Button(true, ()=>onCreateEncounter(getNewEncounter(s, me), me.id), 'Travel to '+s))}
                    {Button(true, ()=>onShowModal(Modal.EncounterLobby), 'Aid Others')}
                    {Button(true, ()=>onCreateEncounter(getNewEncounter(Scenario.Patrons, me), me.id), 'Patron Offerings')}
                    {Button(true, ()=>onShowModal(Modal.CharacterCreation), 'New Consciousness')}
                </div> : 
                <div>
                    {Speech(NPCType.Jeeves, '<h6>Greetings denizen! Shall we return to your cell? Or is there work to be done?</h6>')}
                    {Button(true, ()=>onShowModal(Modal.Jobs), 'Work Jeeves')}
                    {Button(true, ()=>onCreateEncounter(getNewEncounter(Scenario.Hub, me), me.id), 'Home Jeeves')}
                </div>
                }
                <hr/>
                {Button(true, onHideModal, 'Nevermind')}
                <Footer/>
            </div>
        )
    }
}