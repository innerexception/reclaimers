import * as React from 'react'
import AppStyles, { colors } from '../../AppStyles';
import { AbilityCard, Button } from '../util/SharedComponents';
import { connect } from 'react-redux';
import { NPCType, Patron, Patrons, StatusEffect } from '../../constants';
import { v4 } from 'uuid';
import { onHideModal, onUpdateAccount } from '../uiManager/Thunks';
import Footer from '../components/Footer';

interface Props {
    onlineAccount?: UserAccount
}

@(connect((state: RState) => ({
    onlineAccount: state.onlineAccount,
})) as any)
export default class Inventory extends React.Component<Props> {

    render(){
        return (
            <div style={{...AppStyles.modal, width:'700px', height:'66vh', justifyContent:'space-between'}}>
                <div>
                    <h2>Inventory</h2>
                    <h5>Copyright 2068 TechnoSerf LLC</h5>
                    <hr/>
                    {Button(true, onHideModal, 'Close')}
                </div>
                <Footer/>
            </div>
        )
    }
}