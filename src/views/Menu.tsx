import * as React from 'react'
import AppStyles, { colors } from '../../AppStyles';
import { Button } from '../util/SharedComponents';
import { connect } from 'react-redux';
import { Modal, Scenario, Scenarios } from '../../constants';
import { onCreateEncounter, onHideModal, onLogoutUser, onUpdateAccount } from '../uiManager/Thunks';
import Footer from '../components/Footer';
import { getNewAccount, getNewEncounter } from '../util/Util';
import { v4 } from 'uuid';
import Objectives from './Objectives';

interface Props {
    onlineAccount?: UserAccount
    match?: MapData
}

@(connect((state: RState) => ({
    onlineAccount: state.onlineAccount,
    match: state.activeEncounter
})) as any)
export default class Menu extends React.Component<Props> {

    render(){
        return (
            <div style={{...AppStyles.modal, height:'66vh', justifyContent:'space-between'}}>
                <div>
                    <h3>Objectives</h3>
                    {this.props.match && <Objectives match={this.props.match} objectives={Scenarios.find(s=>s.scenario === this.props.match.map).objectives}/>}
                    <hr/>
                    <div>
                        {Button(true, onLogoutUser, 'Quit')}
                    </div>
                    {Button(true, onHideModal, 'Close')}
                </div>
                <Footer/>
            </div>
        )
    }
}