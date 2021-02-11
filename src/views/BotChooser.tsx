import * as React from 'react'
import { Button, CssIcon } from '../util/SharedComponents';
import { connect } from 'react-redux';
import { onChangeProduction, onPauseProduction } from '../uiManager/Thunks';
import { canAffordBot } from '../util/Util';
import { Abilities } from '../../constants';
import { defaultDesigns } from '../data/NPCData';

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
                    {this.props.selectedBuilding.design ? <h6>Producing: {this.props.selectedBuilding.design.name} {Math.round(this.props.selectedBuilding.timer*100)}%</h6>:<h6>Producing nothing</h6>}
                    <hr/>
                    <div>
                        <div>
                            <h4>{d.name}</h4>
                            <h6>hp: {d.maxHp}</h6>
                            <h6>speed: {d.speed}</h6>
                            {d.abilityTypes.map(a=><h6>{Abilities[a].name}</h6>)}
                            <div style={{display:'flex'}}>
                                {d.requiredItems.map(i=>
                                    <h6 style={{display:'flex', alignItems:'center'}}>{i.amount}x {CssIcon(i.type, true)}</h6>
                                )}
                            </div>
                        </div>
                        <div style={{display:'flex'}}>
                            {Button(this.state.selectedIndex > 0, ()=>this.setState({selectedIndex: this.state.selectedIndex-1}), '<')}
                            {Button(this.state.selectedIndex < defaultDesigns.length-1, ()=>this.setState({selectedIndex: this.state.selectedIndex+1}), '>')}
                        </div>
                    </div>
                    {Button(canAffordBot(me.resources, d), ()=>onChangeProduction(d), 'Change Production')}
                    {Button(true, onPauseProduction, 'Pause Production')}
                </div>
        )
    }
}