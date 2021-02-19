import * as React from 'react'
import AppStyles, { colors } from '../../AppStyles';
import { Button } from '../util/SharedComponents';
import { Scenario } from '../../constants';
import { onCreateEncounter, onLogoutUser, onUpdateAccount } from '../uiManager/Thunks';
import Footer from '../components/Footer';
import { getNewAccount, getNewEncounter } from '../util/Util';
import { v4 } from 'uuid';
import { Scenarios } from '../data/Scenarios';

export default class Intro extends React.Component {

    componentDidMount(){
        let account = JSON.parse(localStorage.getItem('rc_save')) as UserAccount
        if(account){
            onUpdateAccount(account)
        }
        else{
            account = getNewAccount('New Player', v4())
            onUpdateAccount(account)
        } 
        localStorage.setItem('rc_save', JSON.stringify(account))
    }

    render(){
        return (
            <div style={{...AppStyles.modal, transform:'none', top:'unset', left:'unset', bottom:25, right:25, width:'350px', justifyContent:'space-between'}}>
                <div>
                    <h2>Reclaimers</h2>
                    <h5>Copyright 2068 TechnoSerf LLC</h5>
                    <hr/>
                    {Button(true, onLogoutUser, 'Quit')}
                </div>
                <Footer/>
            </div>
        )
    }
}