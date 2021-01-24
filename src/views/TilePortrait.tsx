import * as React from 'react'
import { Button, CssIcon } from '../util/SharedComponents';
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
                <div style={{display:'flex', alignItems:'center', flexDirection:'column'}}>
                    {CssIcon(this.props.selectedTile.type-1)}
                    <h4>Toxins Present:</h4>
                    <div style={{display:"flex"}}>
                        {this.props.selectedTile.toxins.map(t=>CssIcon(t,true))}
                    </div>
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
    padding:'5px',
    width:'200px'
}