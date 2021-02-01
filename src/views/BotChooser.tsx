import * as React from 'react'
import { Button, CssIcon } from '../util/SharedComponents';
import { connect } from 'react-redux';
import { onChangeProduction, onPauseProduction } from '../uiManager/Thunks';
import { canAffordBot } from '../util/Util';
import { defaultDesigns } from '../../constants';

interface Props {
    encounter?: MapData
    onlineAccount?: UserAccount
    selectedBuilding: RCBuildingState
}

interface State {
    selectedIndex: number
}

@(connect((state: RState) => ({
    encounter: state.activeEncounter,
    onlineAccount: state.onlineAccount,
    selectedBuilding: state.selectedBuilding
})) as any)
export default class BotChooser extends React.Component<Props, State> {

    state:State = { selectedIndex: 0 }

    componentDidMount(){
        if(this.props.selectedBuilding.design){
            let index = defaultDesigns.findIndex(d=>d.name === this.props.selectedBuilding.design.name)
            this.setState({selectedIndex: index})
        }
    }

    render(){
        const me = this.props.encounter.players.find(p=>p.id === this.props.onlineAccount.id)
        const d = defaultDesigns[this.state.selectedIndex]
        return (
                <div>
                    {this.props.selectedBuilding.design && <h5>Producing: {this.props.selectedBuilding.design.name} {Math.round(this.props.selectedBuilding.timer*100)}%</h5>}
                    <div style={{display:'flex'}}>
                        {Button(this.state.selectedIndex > 0, ()=>this.setState({selectedIndex: this.state.selectedIndex-1}), '<')}
                        <div>
                            <h2>{d.name}</h2>
                            <h5>hp: {d.maxHp}</h5>
                            <h5>range: {d.maxMoves}</h5>
                            <h5>speed: {d.speed}</h5>
                            {d.abilityTypes.map(a=><h5>{a}</h5>)}
                            {d.requiredItems.map(i=>
                                <h5>{i.amount}x {i.type}</h5>
                            )}
                        </div>
                        {Button(this.state.selectedIndex < defaultDesigns.length-1, ()=>this.setState({selectedIndex: this.state.selectedIndex+1}), '>')}
                    </div>
                    {Button(canAffordBot(me.resources, d), ()=>onChangeProduction(d), 'Change Production')}
                    {Button(true, onPauseProduction, 'Pause Production')}
                </div>
        )
    }
}