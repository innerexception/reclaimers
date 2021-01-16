import * as React from 'react'
import { connect } from 'react-redux'
import { Modal } from '../constants'
import Actionbar from './views/Actionbar'
import BotChooser from './views/BotChooser'
import CharacterInfo from './views/CharacterInfo'
import EventLog from './views/EventLog'
import Intro from './views/Intro'
import Login from './views/Login'
import Viewscreen from './Viewscreen'

interface Props {
    modalState?:ModalState
    match?:Encounter
    me?:UserAccount
}

@(connect((state: RState) => ({
    modalState: state.modalState,
    me: state.onlineAccount,
    match: state.activeEncounter
})) as any)
export default class ViewscreenFrame extends React.Component<Props> {

    getModal = () => {
        let data = this.props.modalState.data
        switch(this.props.modalState.modal){
            case Modal.Login: return <Login/>
            case Modal.CharacterInfo: return <CharacterInfo characterId={data}/>
            case Modal.Menu: return <Intro/>
            case Modal.BotSpawn: return <BotChooser/>
        }
    }

    render(){
        return (
            <div style={{position:'relative', display:'flex', justifyContent:'center', borderRadius:'5px', margin:'1px', width:'100%', height:'100%'}}>
                {this.props.modalState && this.getModal()}
                <div style={{display:'flex', flexDirection:'column',alignItems:'center', width:'100%', maxWidth:'1200px'}}>
                    <Viewscreen/>
                    <div style={{position:'absolute', bottom:0, left:0}}>
                        <Actionbar/>
                        {this.props.match && <EventLog events={this.props.match.eventLog}/>}
                    </div>
                </div>
            </div>
        )
    }
}