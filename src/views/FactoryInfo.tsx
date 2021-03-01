import * as React from 'react'
import { Button, CssIcon } from '../util/SharedComponents';
import { connect } from 'react-redux';
import { onChangeProduction, onPauseProduction } from '../uiManager/Thunks';
import { canAffordBot } from '../util/Util';

interface Props {
    encounter?: MapData
    selectedBuilding?: RCBuildingState
    player?: RCPlayerState
}

interface State {
    selectedIndex: number
}

@(connect((state: RState) => ({
    encounter: state.activeEncounter,
    selectedBuilding: state.selectedBuilding,
    player: state.onlineAccount
})) as any)
export default class FactoryInfo extends React.Component<Props, State> {

    state:State = { selectedIndex: 0 }

    componentDidMount(){
        if(this.props.selectedBuilding.activeDroneDesign){
            let index = this.props.selectedBuilding.availableDroneDesigns.findIndex(d=>d.name === this.props.selectedBuilding.activeDroneDesign.name)
            this.setState({selectedIndex: index})
        }
    }

    render(){
        const me = this.props.player
        const defaultDesigns = this.props.selectedBuilding.availableDroneDesigns
        const d = defaultDesigns[this.state.selectedIndex]
        return (
                    <div style={{height:'250px', display:'flex', flexDirection:"column", justifyContent:"space-between"}}>
                        <div>
                            {this.props.selectedBuilding.activeDroneDesign ? <h6 style={{textAlign:'center'}}>Producing: {this.props.selectedBuilding.activeDroneDesign.name} {Math.round(this.props.selectedBuilding.timer*100)}%</h6>:<h6>Producing nothing</h6>}
                            <hr/>
                            <div style={{display:'flex', width:'100%', justifyContent:'space-between'}}>
                                {Button(this.state.selectedIndex > 0, ()=>this.setState({selectedIndex: this.state.selectedIndex-1}), '<')}
                                <h4>{d.name}</h4>
                                {Button(this.state.selectedIndex < defaultDesigns.length-1, ()=>this.setState({selectedIndex: this.state.selectedIndex+1}), '>')}
                            </div>
                            {d.processesItems && <h6>processes</h6>}
                            <div style={{display:'flex'}}>
                                {d.processesItems?.map(a=>CssIcon(a, true))}
                            </div>
                            <div style={{display:'flex', alignItems:'center'}}>
                                <h6>requires:</h6>
                                <div style={{display:'flex', alignItems:'center'}}>
                                    {d.requiredItems.map(i=>
                                        <h6 style={{display:'flex', alignItems:'center'}}>{i.amount}x {CssIcon(i.type, true)}</h6>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div style={{display:'flex', justifyContent:'space-evenly'}}>
                            {Button(canAffordBot(me.resources, d.requiredItems), ()=>onChangeProduction(d), 'Build')}
                            {Button(true, onPauseProduction, 'Cancel')}
                        </div>
                    </div>
        )
    }
}