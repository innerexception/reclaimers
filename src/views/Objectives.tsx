import * as React from 'react'
import { colors } from '../../AppStyles'

interface Props {
    objectives: Array<Objective>
    match: MapData
}

export default class ObjectiveView extends React.Component<Props> {

    render(){
        const player = this.props.match.players[0]
        return <div style={{height:'100px', overflow:'auto', padding:'10px', background:'black', color: colors.lGreen, width:'400px', fontSize:'18px'}}>
                    {this.props.objectives.filter(e=>!e.requires.find(ei=>player.completedObjectives.includes(ei)))
                        .map(e=><h5 style={{color:colors.bronze}}>- {e.description}</h5>)}
                    {this.props.objectives.filter(e=>e.requires.find(ei=>player.completedObjectives.includes(ei)))
                        .map(e=><h5 style={{color:colors.lGreen}}>- {e.description}</h5>)}
               </div>
    }
}
    
     