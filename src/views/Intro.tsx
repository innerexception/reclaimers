import * as React from 'react'
import AppStyles, { colors } from '../../AppStyles';
import { Button } from '../util/SharedComponents';
import { Scenario } from '../../constants';
import { onCreateEncounter, onLogoutUser, onUpdateAccount } from '../uiManager/Thunks';
import Footer from '../components/Footer';
import { getNewAccount, getNewEncounter } from '../util/Util';
import { v4 } from 'uuid';

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
            <div style={{...AppStyles.modal, width:'700px', height:'66vh', justifyContent:'space-between'}}>
                <div>
                    <h2>Welcome</h2>
                    <h5>Copyright 2068 TechnoSerf LLC</h5>
                    <hr/>
                    <div>
                        {Button(true, ()=>onCreateEncounter(getNewEncounter(Scenario.LightOfTheWorld)), 'Beginning')}
                        {/* {Scenarios.map(s=>Button(true, ()=>onCreateEncounter(getNewEncounter(s), this.props.onlineAccount.id), 'Mission '+s))} */}
                    </div>
                    {Button(true, onLogoutUser, 'Quit')}
                </div>
                <Footer/>
            </div>
        )
    }
}