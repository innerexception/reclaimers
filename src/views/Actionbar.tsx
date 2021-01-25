import * as React from 'react'
import { Button, CssIcon } from '../util/SharedComponents';
import { onStartBuildPylon, onShowModal } from '../uiManager/Thunks';
import { Modal } from '../../constants';

interface Props {
    player: RCPlayerState
}

export default class Actionbar extends React.Component<Props> {

    render(){
        return (
            <div style={{display:'table', background:'black', padding:'10px', pointerEvents:'all'}}>
                <div style={{display:"flex", justifyContent:'space-between'}}>
                    {Object.keys(this.props.player.resources).map(key=>
                        <div style={{display:'flex', alignItems:'center'}}>{CssIcon(+key, true)} {this.props.player.resources[key]}</div>
                    )}
                    {Button(true, onStartBuildPylon, 'Build Pylon')}
                    {Button(true, ()=>onShowModal(Modal.BotSpawn), 'Deploy Bot')}
                    {Button(true, ()=>onShowModal(Modal.Menu), 'Menu')}
                </div>
            </div>
        )
    }
}