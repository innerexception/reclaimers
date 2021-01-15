import * as React from 'react'
import AppStyles from '../../AppStyles';
import { Button } from '../util/SharedComponents';
import { connect } from 'react-redux';
import { onHideModal, onShowModal } from '../uiManager/Thunks';
import Footer from '../components/Footer';
import { Patron } from '../../constants';

interface Props {
    onlineAccount?: UserAccount
    patron:Patron
}

@(connect((state: RState) => ({
    onlineAccount: state.onlineAccount,
})) as any)
export default class Jobs extends React.Component<Props> {

    render(){
        return (
            <div style={{...AppStyles.modal, justifyContent:'space-between'}}>
                <div style={{width:'85%', height:'85%'}}>
                    <h2>Jobs</h2>
                    <hr/>
                    <div>
                        <h5>Bronze Member Work</h5>
                        {/* {getAccountZoneMissions(this.props.activeEncounter, this.props.onlineAccount).map(m=><div onClick={()=>this.setState({selectedMission:m})}>{m.title}</div>)}
                        {Button(true, ()=>onCreateEncounter(this.state.selectedMission), 'Accept')} */}
                    </div>
                    {Button(true, onHideModal, 'Cancel')}
                </div>
                <Footer/>
            </div>
        )
    }
}

const style = { backgroundPosition:'center', backgroundSize:'cover', border: '2px inset' }