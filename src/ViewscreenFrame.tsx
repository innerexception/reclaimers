import * as React from 'react'
import { connect } from 'react-redux'
import { Modal } from '../constants'
import { Scenarios } from './data/Scenarios'
import Dialog from './Dialog'
import Actionbar from './views/Actionbar'
import EntityInfo from './views/CharacterInfo'
import Intro from './views/Intro'
import Menu from './views/Menu'
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
            case Modal.Dialog: return <Dialog messages={this.props.modalState.data}/>
        }
    }

    render(){
        return (
            <div style={{position:'relative', display:'flex', justifyContent:'center', borderRadius:'5px', margin:'1px', width:'100%', height:'100%'}}>
                {this.props.modalState && this.getModal()}
                <div style={{display:'flex', flexDirection:'column',alignItems:'center', width:'100%', maxWidth:'1200px'}}>
                    {this.props.match && 
                    <div style={{position:'absolute', top:0, left:0, pointerEvents:'none'}}>
                        <TilePortrait/>
                    </div>}
                    <Viewscreen/>
                    {this.props.match && 
                    <div style={{position:'absolute', bottom:0, left:0, pointerEvents:'none'}}>
                        <EntityInfo/>
                        <Actionbar player={this.props.match.player}/>
                    </div>}
                </div>
            </div>
        )
    }
}