import * as React from 'react'
import { connect } from 'react-redux'
import { Modal } from '../constants'
import { Scenarios } from './data/Scenarios'
import Dialog from './Dialog'
import { onLogoutUser, onShowModal } from './uiManager/Thunks'
import { Button } from './util/SharedComponents'
import Actionbar from './views/Actionbar'
import EntityInfo from './views/EntityInfo'
import Intro from './views/Intro'
import Menu from './views/Menu'
import ObjectiveView from './views/Objectives'
import TilePortrait from './views/TilePortrait'
import Viewscreen from './Viewscreen'

interface Props {
    modalState?:ModalState
    activeMap?:MapData
    me?:RCPlayerState
}

@(connect((state: RState) => ({
    modalState: state.modalState,
    me: state.onlineAccount,
    activeMap: state.activeEncounter
})) as any)
export default class ViewscreenFrame extends React.Component<Props> {

    getModal = () => {
        const dat = this.props.modalState.data as TileEvent
        switch(this.props.modalState.modal){
            case Modal.MainMenu: return <Intro/>
            default: return <Dialog messages={dat.messages} choices={dat.choices}/>
        }
    }

    render(){
        return (
            <div style={{position:'relative', display:'flex', justifyContent:'center', borderRadius:'5px', margin:'1px', width:'100%', height:'100%', backgroundImage:'url('+require('../assets/ui_border.png')+')', backgroundSize:'95px'}}>
                {this.props.modalState && this.getModal()}
                <div style={{display:'flex',alignItems:'center', width:'100%'}}>
                    {this.props.modalState?.modal === Modal.MainMenu ? 
                        <div style={{width:'350px', height:'100%'}}/> :
                        <div style={{width:'350px', height:'100%', display:'flex', flexDirection:"column", justifyContent:"space-between", padding:'5px'}}>
                            <TilePortrait/>
                            <ObjectiveView 
                                player={this.props.me}
                                match={this.props.activeMap} />
                            <EntityInfo/>
                            <Actionbar player={this.props.me}/>
                            {Button(true, onLogoutUser, 'Return to Orbit')}
                        </div>
                        }
                    <Viewscreen/>
                </div>
            </div>
        )
    }
}