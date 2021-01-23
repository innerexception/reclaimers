import * as React from 'react'
import { Button } from '../util/SharedComponents';
import { connect } from 'react-redux';
import { onActivateAbility, onShowModal } from '../uiManager/Thunks';
import { AbilityType, Modal } from '../../constants';

export default class Actionbar extends React.Component {

    render(){
        return (
            <div style={{display:'table', background:'black', padding:'10px', pointerEvents:'all'}}>
                <div style={{display:"flex", justifyContent:'space-between'}}>
                    {Button(true, ()=>onShowModal(Modal.BotCreation), 'Design Bot')}
                    {Button(true, ()=>onShowModal(Modal.BotSpawn), 'Deploy Bot')}
                    {Button(true, ()=>onShowModal(Modal.Menu), 'Menu')}
                </div>
            </div>
        )
    }
}