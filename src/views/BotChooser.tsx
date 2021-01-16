import * as React from 'react'
import AppStyles from '../../AppStyles';
import { Button, CssIcon } from '../util/SharedComponents';
import { connect } from 'react-redux';
import { onHideModal, onSpawnBot } from '../uiManager/Thunks';
import Footer from '../components/Footer';
import { canAffordBot } from '../util/Util';

interface Props {
    encounter?: Encounter
    onlineAccount?: UserAccount
}

interface State {
    selectedDesign: RCUnitData
}

@(connect((state: RState) => ({
    encounter: state.activeEncounter,
    onlineAccount: state.onlineAccount
})) as any)
export default class BotChooser extends React.Component<Props, State> {

    state:State = { selectedDesign: null }

    render(){
        const me = this.props.encounter.players.find(p=>p.id === this.props.onlineAccount.id)
        return (
            <div style={{...AppStyles.modal, justifyContent:'space-between'}}>
                <div>
                    {me.designs.map(d=>
                        <div onClick={()=>this.setState({selectedDesign: d})}>
                            <h2>{d.name}</h2>
                            <h5>hp: {d.maxHp}</h5>
                            <h5>range: {d.maxMoves}</h5>
                            <h5>speed: {d.speed}</h5>
                            {d.abilityTypes.map(a=><h5>{a}</h5>)}
                            {d.requiredItems.map(i=>
                                <h5>{i.amount}x {i.type}</h5>
                                )}
                            <hr/>
                        </div>
                    )}
                    {Button(true, onHideModal, 'Cancel')}
                    {Button(canAffordBot(this.state.selectedDesign), ()=>onSpawnBot(this.state.selectedDesign), 'Deploy')}
                </div>
                <Footer/>
            </div>
        )
    }
}