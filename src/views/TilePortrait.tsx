import * as React from 'react'
import AppStyles, { colors } from '../../AppStyles';
import { AbilityCard, Button, CssIcon } from '../util/SharedComponents';
import { connect } from 'react-redux';

interface Props {
    selectedTile?: TileInfo
}

@(connect((state: RState) => ({
    selectedTile: state.selectedTile,
})) as any)
export default class TilePortrait extends React.Component<Props> {
    render(){
        return (
            <div style={styles}>
                {this.props.selectedTile ?
                <div style={{display:'flex'}}>
                    <h4>Toxins Present:</h4>,
                    {CssIcon(this.props.selectedTile.type-1, 2)}
                    {this.props.selectedTile.toxins.map(t=><h5>{t}</h5>)}
                </div>
                :
                <h4>No scan</h4>}
            </div>
        )
    }
}

const styles = {
    border: '3px inset',
    borderColor: 'silver',
    padding:'5px'
}