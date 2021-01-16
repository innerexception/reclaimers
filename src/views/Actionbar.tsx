import * as React from 'react'
import { AbilityCard, Button } from '../util/SharedComponents';
import { connect } from 'react-redux';
import { onActivateAbility, onShowModal } from '../uiManager/Thunks';
import { AbilityType, Modal } from '../../constants';
import { isPassive } from '../util/Util';

interface Props {
    encounter?: Encounter
}

@(connect((state: RState) => ({
    encounter: state.activeEncounter
})) as any)
export default class Actionbar extends React.Component<Props> {

    render(){
        return (
            <div style={{display:'table', background:'black', padding:'10px'}}>
                <div style={{display:"flex", justifyContent:'space-between'}}>
                    {Button(true, ()=>onShowModal(Modal.BotCreation), 'Design Bot')}
                    {Button(true, ()=>onShowModal(Modal.BotSpawn), 'Deploy Bot')}
                    {Button(true, ()=>onShowModal(Modal.Menu), 'Menu')}
                </div>
            </div>
        )
    }
}