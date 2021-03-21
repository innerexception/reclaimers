import * as React from 'react'
import { Button, CssIcon } from '../util/SharedComponents';
import { connect } from 'react-redux';
import { onGatherUnits, onRecycleUnit, onUnGatherUnits } from '../uiManager/Thunks';
import { RCObjectType, RCDroneType, TechnologyType } from '../../constants';
import FactoryInfo from './FactoryInfo';
import AppStyles, { colors } from '../../AppStyles';

interface Props {
    selectedUnit?: RCUnit
    selectedBuilding?:RCBuildingState
    encounter?:MapData
    player?: RCPlayerState
}

@(connect((state: RState) => ({
    selectedUnit: state.selectedUnit,
    selectedBuilding: state.selectedBuilding,
    encounter: state.activeEncounter,
    player: state.onlineAccount
})) as any)
export default class EntityInfo extends React.Component<Props> {

    render(){
        const unitData =  this.props.selectedUnit
        const buildDat = this.props.selectedBuilding
        return (
            <div style={{...AppStyles.dialog, height:'200px'}}>
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
                        {this.props.player.technologies.find(t=>t.type === TechnologyType.Recycling && Button(true, ()=>onRecycleUnit(unitData.id), 'Reclaim'))}
                    </div>
                </div>}
                {buildDat && <FactoryInfo selectedBuilding={buildDat}/>}
                {!buildDat && !unitData && <h4 style={{textAlign:"center"}}>No Selection</h4>}
            </div>
        )
    }
}