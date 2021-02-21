import * as React from 'react'
import { Button, CssIcon } from '../util/SharedComponents';
import { connect } from 'react-redux';
import { onChangeProduction, onPauseProduction } from '../uiManager/Thunks';
import { canAffordBot } from '../util/Util';
import { ItemType } from '../../constants';

interface Props {
    encounter?: MapData
    selectedBuilding?: RCBuildingState
    player?: RCPlayerState
}

interface State {
    selectedIndex: number
}

const defaultResearchCost = [
    { amount: 3 , type: ItemType.Lithium }
]

@(connect((state: RState) => ({
    encounter: state.activeEncounter,
    selectedBuilding: state.selectedBuilding,
    player: state.onlineAccount
})) as any)
export default class LabInfo extends React.Component<Props, State> {

    state:State = { selectedIndex: 0 }

    componentDidMount(){
        if(this.props.selectedBuilding.activeResearch){
            let index = this.props.selectedBuilding.availableResearch.findIndex(d=>d === this.props.selectedBuilding.activeResearch)
            this.setState({selectedIndex: index})
        }
    }

    render(){
        const me = this.props.player
        const defaultDesigns = this.props.selectedBuilding.availableResearch
        const d = defaultDesigns[this.state.selectedIndex]
        return (
                <div>
                    {this.props.selectedBuilding.activeResearch ? <h6>Decrypting Data: {this.props.selectedBuilding.activeResearch} {Math.round(this.props.selectedBuilding.timer*100)}%</h6>:<h6>No Activity</h6>}
                    <hr/>
                    <div>
                        <div>
                            <h4>{d}</h4>
                            {CssIcon(d, true)}
                            <h6>requires:</h6>
                            <div style={{display:'flex'}}>
                                {defaultResearchCost.map(i=>
                                    <h6 style={{display:'flex', alignItems:'center'}}>{i.amount}x {CssIcon(i.type, true)}</h6>
                                )}
                            </div>
                        </div>
                        <div style={{display:'flex'}}>
                            {Button(this.state.selectedIndex > 0, ()=>this.setState({selectedIndex: this.state.selectedIndex-1}), '<')}
                            {Button(this.state.selectedIndex < defaultDesigns.length-1, ()=>this.setState({selectedIndex: this.state.selectedIndex+1}), '>')}
                        </div>
                    </div>
                    {Button(canAffordBot(me.resources, defaultResearchCost), ()=>onStartResearch(d), 'Start')}
                </div>
        )
    }
}