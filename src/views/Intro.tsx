import * as React from 'react'
import AppStyles, { colors } from '../../AppStyles';
import { AbilityCard, Button } from '../util/SharedComponents';
import { connect } from 'react-redux';
import { Modal, Scenario, Scenarios } from '../../constants';
import { onCreateEncounter, onHideModal } from '../uiManager/Thunks';
import Footer from '../components/Footer';
import { getNewEncounter } from '../util/Util';

interface Props {
    onlineAccount?: UserAccount
}

@(connect((state: RState) => ({
    onlineAccount: state.onlineAccount,
})) as any)
export default class Intro extends React.Component<Props> {

    render(){
        return (
            <div style={{...AppStyles.modal, width:'700px', height:'66vh', justifyContent:'space-between'}}>
                <div>
                    <h2>Welcome</h2>
                    <h5>Copyright 2068 TechnoSerf LLC</h5>
                    <hr/>
                    <div>
                        {Button(true, ()=>onCreateEncounter(getNewEncounter(Scenario.Tutorial), this.props.onlineAccount.id), 'Practice')}
                        {Scenarios.map(s=>Button(true, ()=>onCreateEncounter(getNewEncounter(s), this.props.onlineAccount.id), 'Mission '+s))}
                    </div>
                    {Button(true, onHideModal, 'Quit')}
                </div>
                <Footer/>
            </div>
        )
    }
}