import * as React from 'react'
import AppStyles, { colors } from '../../AppStyles';
import { Button, CssIcon } from '../util/SharedComponents';
import { connect } from 'react-redux';
import { onSelectUnitDestination } from '../uiManager/Thunks';
import { StatusEffectData } from '../../constants';

interface Props {
    selectedUnit?: RCUnit
}

@(connect((state: RState) => ({
    selectedUnit: state.selectedUnit
})) as any)
export default class CharacterInfo extends React.Component<Props> {

    render(){
        const charDat = this.props.selectedUnit
        return (
            <div style={{...styles, width:'250px', minHeight:'200px', pointerEvents:'all'}}>
                {charDat ? 
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
                        {Button(true, onSelectUnitDestination, 'Move')}
                    </div>
                </div>: <h4>No Selection</h4>}
            </div>
        )
    }
}

const styles = {
    border: '3px inset',
    borderColor: 'silver',
    padding:'5px'
}