import * as React from 'react'
import { colors } from '../../AppStyles'

interface Props {
    objectives: Array<Objective>
    match: MapData
}

export default class Objectives extends React.Component<Props> {

    render(){
        return <div style={{height:'100px', overflow:'auto', padding:'10px', background:'black', color: colors.lGreen, width:'400px', fontSize:'18px'}}>
                    {this.props.objectives.map(e=><h5>- {e.description} {this.props.match.players[0].completedObjectives.includes(e.id) ? '*': ''}</h5>)}
               </div>
    }
}
    
     