import * as React from 'react'
import { Button, CssIcon } from '../util/SharedComponents';
import { connect } from 'react-redux';
import { colors } from '../../AppStyles';

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
                <div style={{display:'flex', alignItems:'center', flexDirection:'column'}}>
                    <div style={{display:'flex', alignItems:'center'}}>
                        <h4>Toxins:</h4>
                        {CssIcon(this.props.selectedTile.type-1)}
                    </div>
                    <div style={{display:"flex"}}>
                        {this.props.selectedTile.toxins.length > 0 ? 
                            this.props.selectedTile.toxins.map(t=>CssIcon(t,true)) :
                            <h4>None</h4>
                        }
                    </div>
                </div>
                :
                <h4 style={{textAlign:'center'}}>No scan</h4>}
            </div>
        )
    }
}

const styles = {
    border: '3px inset',
    borderColor: colors.bronze,
    padding:'5px',
    minHeight:'100px',
    background:'black'
}