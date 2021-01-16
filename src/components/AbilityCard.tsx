import * as React from 'react'
import AppStyles from '../../AppStyles';
import { Button } from '../util/SharedComponents';
import { connect } from 'react-redux';
import { onShowModal } from '../uiManager/Thunks';
import { Modal } from '../../constants';

interface Props {
    onlineAccount?: UserAccount
}

@(connect((state: RState) => ({
    onlineAccount: state.onlineAccount,
})) as any)
export default class Jobs extends React.Component<Props> {

    render(){
        return (
            <div style={{...AppStyles.modal, justifyContent:'space-between'}}>
                <div style={{width:'85%', height:'85%'}}>
                    <h2>Job Hub</h2>
                    <h5>Copyright 2068 TechnoSerf LLC</h5>
                    <hr/>
                    <div>
                        <h5>Bronze Member Work</h5>
                        {/* {getAccountMissions(this.props.onlineAccount).map(m=><div onClick={()=>this.setState({selectedMission:m})}>{m.title}</div>)}
                        {Button(true, ()=>onCreateEncounter(this.state.selectedMission), 'Accept')} */}
                    </div>
                    {Button(true, ()=>onShowModal(Modal.BotCreation), 'Create Companion')}
                </div>
            </div>
        )
    }
}

const style = { backgroundPosition:'center', backgroundSize:'cover', border: '2px inset' }