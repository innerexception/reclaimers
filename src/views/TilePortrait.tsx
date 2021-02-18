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
                    <div style={{display:'flex', alignItems:'center'}}>
                        {CssIcon(this.props.selectedTile.type-1)}
                        <h6>Toxins Present:</h6>
                    </div>
                    <div style={{display:"flex"}}>
                        {this.props.selectedTile.toxins.length > 0 ? 
                            this.props.selectedTile.toxins.map(t=>CssIcon(t,true)) :
                            <h5>None</h5>
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
    borderColor: 'silver',
    padding:'5px',
    minWidth:'200px',
    background:'black'
}