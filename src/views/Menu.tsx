import * as React from 'react'
import AppStyles, { colors } from '../../AppStyles';
import { Button } from '../util/SharedComponents';
import { connect } from 'react-redux';
import { onHideModal, onLogoutUser } from '../uiManager/Thunks';
import Footer from '../components/Footer';
import ObjectiveView from './Objectives';
import { Scenarios } from '../data/Scenarios';

interface Props {
    onlineAccount?: RCPlayerState
    match?: MapData
}

@(connect((state: RState) => ({
    onlineAccount: state.onlineAccount,
    match: state.activeEncounter
})) as any)
export default class Menu extends React.Component<Props> {

    render(){
        return (
            <div style={{...AppStyles.modal, width:'400px'}}>
                <div>
                    <h3>Objectives</h3>
                    {this.props.match && 
                    <ObjectiveView 
                        player={this.props.onlineAccount}
                        match={this.props.match} />}
                    <hr/>
                    <div style={{marginBottom:'2em'}}>
                        {Button(true, onLogoutUser, 'Return to Orbit')}
                    </div>
                    {Button(true, onHideModal, 'Continue')}
                </div>
                <Footer/>
            </div>
        )
    }
}