import * as React from 'react'
import { connect } from 'react-redux'
import { Modal, Scenarios } from '../constants'
import Dialog from './Dialog'
import Actionbar from './views/Actionbar'
import BotChooser from './views/BotChooser'
import EntityInfo from './views/CharacterInfo'
import EventLog from './views/EventLog'
import Intro from './views/Intro'
import Menu from './views/Menu'
import Objectives from './views/Objectives'
import TilePortrait from './views/TilePortrait'
import Viewscreen from './Viewscreen'

interface Props {
    modalState?:ModalState
    match?:MapData
    me?:UserAccount
}

@(connect((state: RState) => ({
    modalState: state.modalState,
    me: state.onlineAccount,
    match: state.activeEncounter
})) as any)
export default class ViewscreenFrame extends React.Component<Props> {

    getModal = () => {
        switch(this.props.modalState.modal){
            case Modal.MainMenu: return <Intro/>
            case Modal.Menu: return <Menu/>
            case Modal.Intro: return <Dialog messages={Scenarios.find(s=>s.scenario === this.props.match.map).intro}/>
        }
    }

    render(){
        return (
            <div style={{position:'relative', display:'flex', justifyContent:'center', borderRadius:'5px', margin:'1px', width:'100%', height:'100%'}}>
                {this.props.modalState && this.getModal()}
                <div style={{display:'flex', flexDirection:'column',alignItems:'center', width:'100%', maxWidth:'1200px'}}>
                    <div style={{position:'absolute', top:0, left:0, pointerEvents:'none'}}>
                        <TilePortrait/>
                    </div>
                    <Viewscreen/>
                    <div style={{position:'absolute', bottom:0, left:0, pointerEvents:'none'}}>
                        <EntityInfo/>
                        {this.props.match && <Actionbar player={this.props.match.players[0]}/>}
                    </div>
                </div>
            </div>
        )
    }
}