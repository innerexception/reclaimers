import * as React from 'react'
import { Button, CssIcon } from '../util/SharedComponents';
import { connect } from 'react-redux';
import { onGatherUnits, onUnGatherUnits } from '../uiManager/Thunks';
import { RCObjectType, RCDroneType } from '../../constants';
import FactoryInfo from './FactoryInfo';
import { colors } from '../../AppStyles';
import LabInfo from './LabInfo';

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
        const unitData =  this.props.selectedUnit
        const buildDat = this.props.selectedBuilding
        return (
            <div style={{...styles, width:'250px', minHeight:'200px', pointerEvents:'all'}}>
                {unitData &&
                <div>
                    <h2>{unitData.name}</h2>
                    <h5>hp: {unitData.hp}</h5>
                    <h5>speed: {unitData.speed}</h5>
                    <h5>carrying: {unitData.inventory.map(s=>
                        <div style={{display:'flex'}}>
                            {CssIcon(s, true)}
                        </div>)}
                    </h5>
                    <div>
                        {(unitData.unitType == RCDroneType.Defender || unitData.processesItems)
                            && Button(true, ()=>onGatherUnits(unitData.id), 'Swarm')}
                        {unitData.isSwarmLeader && Button(true, ()=>onUnGatherUnits(unitData.id), 'Release')}
                    </div>
                </div>}
                {buildDat &&
                <div>
                    {(buildDat.type === RCObjectType.Base) && 
                        <FactoryInfo selectedBuilding={buildDat}/>}
                    {(buildDat.type === RCObjectType.Lab) && 
                        <LabInfo selectedBuilding={buildDat}/>}
                </div>}
                {!buildDat && !unitData && <h4>No Selection</h4>}
            </div>
        )
    }
}

const styles = {
    border: '3px inset',
    borderColor: colors.bronze,
    background:'black',
    padding:'5px'
}