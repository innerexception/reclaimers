import * as React from 'react'
import { Button, CssIcon } from '../util/SharedComponents';
import { onShowModal } from '../uiManager/Thunks';
import { Modal } from '../../constants';
import AppStyles from '../../AppStyles';

interface Props {
    player: RCPlayerState
}

export default class Actionbar extends React.Component<Props> {

    render(){
        return (
            <div style={AppStyles.dialog}>
                <div style={{display:"flex", justifyContent:'space-between'}}>
                    {Object.keys(this.props.player.resources).map(key=>
                        <div style={{display:'flex', alignItems:'center'}}>{CssIcon(+key, true)} {this.props.player.resources[key]}</div>
                    )}
                </div>
            </div>
        )
    }
}