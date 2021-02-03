import * as React from 'react'
import { Button, CssIcon } from '../util/SharedComponents';
import { connect } from 'react-redux';
import { onGatherUnits } from '../uiManager/Thunks';
import { RCObjectType } from '../../constants';
import BotChooser from './BotChooser';

interface Props {
    selectedUnit?: RCUnit
    selectedBuilding?:RCBuildingState
    encounter?:MapData
}

@(connect((state: RState) => ({
    selectedUnit: state.selectedUnit,
    selectedBuilding: state.selectedBuilding,
    encounter: state.activeEncounter
})) as any)
export default class EntityInfo extends React.Component<Props> {

    render(){
        const charDat =  this.props.selectedUnit
        const buildDat = this.props.selectedBuilding
        return (
            <div style={{...styles, width:'250px', minHeight:'200px', pointerEvents:'all'}}>
                {charDat &&
                <div>
                    <h2>{charDat.name}</h2>
                    <h5>hp: {charDat.hp}</h5>
                    <h5>moves: {charDat.moves}</h5>
                    <h5>speed: {charDat.speed}</h5>
                    <h5>carrying: {charDat.inventory.map(s=>
                        <div style={{display:'flex'}}>
                            {CssIcon(s, true)} {s}
                        </div>)}
                    </h5>
                    <div>
                        {Button(true, onGatherUnits, 'Swarm')}
                    </div>
                </div>}
                {buildDat &&
                <div>
                    {buildDat.type === RCObjectType.Base && 
                        <BotChooser selectedBuilding={buildDat}/>}
                </div>}
                {!buildDat && !charDat && <h4>No Selection</h4>}
            </div>
        )
    }
}

const styles = {
    border: '3px inset',
    borderColor: 'silver',
    padding:'5px'
}