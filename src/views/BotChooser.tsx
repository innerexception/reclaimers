import * as React from 'react'
import AppStyles from '../../AppStyles';
import { Button, CssIcon } from '../util/SharedComponents';
import { connect } from 'react-redux';
import { onHideModal, onSpawnBot } from '../uiManager/Thunks';
import Footer from '../components/Footer';
import { canAffordBot } from '../util/Util';
import BuildingSprite from '../BuildingSprite';

interface Props {
    encounter?: Encounter
    onlineAccount?: UserAccount
    selectedBuilding: BuildingSprite
}

interface State {
    selectedIndex: number
}

@(connect((state: RState) => ({
    encounter: state.activeEncounter,
    onlineAccount: state.onlineAccount
})) as any)
export default class BotChooser extends React.Component<Props, State> {

    state:State = { selectedIndex: 0 }

    componentDidMount(){
        if(this.props.selectedBuilding.design){
            let index = this.props.encounter.players.find(p=>p.id === this.props.onlineAccount.id).designs.findIndex(d=>d.name === this.props.selectedBuilding.design.name)
            this.setState({selectedIndex: index})
        }
    }

    render(){
        const me = this.props.encounter.players.find(p=>p.id === this.props.onlineAccount.id)
        const d = me.designs[this.state.selectedIndex]
        return (
                <div>
                    {this.props.selectedBuilding.design && <h5>Producing: {this.props.selectedBuilding.design.name} {Math.round(this.props.selectedBuilding.timer.getProgress()*100)}%</h5>}
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
                        {Button(this.state.selectedIndex < me.designs.length-1, ()=>this.setState({selectedIndex: this.state.selectedIndex+1}), '>')}
                    </div>
                    {Button(canAffordBot(d), ()=>this.props.selectedBuilding.resetProduction(d), 'Change Production')}
                </div>
        )
    }
}