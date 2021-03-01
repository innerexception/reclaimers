import * as React from 'react'
import AppStyles, { colors } from '../../AppStyles';
import { Button } from '../util/SharedComponents';
import Footer from '../components/Footer';
import { getNewAccount } from '../util/Util';
import { v4 } from 'uuid';
import { onUpdatePlayer } from '../uiManager/Thunks';

export default class Intro extends React.Component {

    componentDidMount(){
        let account = JSON.parse(localStorage.getItem('rc_save')) as RCPlayerState
        if(account){
            onUpdatePlayer(account)
        }
        else{
            account = getNewAccount('New Player', v4())
            onUpdatePlayer(account)
        } 
        localStorage.setItem('rc_save', JSON.stringify(account))
    }

    clearSave = () => {
        let account = getNewAccount('New Player', v4())
        onUpdatePlayer(account)
        localStorage.setItem('rc_save', JSON.stringify(account))
    }

    render(){
        return (
            <div style={{...AppStyles.modal, transform:'none', top:'33%', left:0, width:'350px', justifyContent:'space-between'}}>
                <div>
                    <h2>Reclaimers</h2>
                    <h5>Copyright 2068 TechnoSerf LLC</h5>
                    <hr/>
                    {Button(true, this.clearSave, 'Clear Save')}
                    <hr/>
                    {/* {Button(true, onQuit, 'Quit')} */}
                </div>
                <Footer/>
            </div>
        )
    }
}