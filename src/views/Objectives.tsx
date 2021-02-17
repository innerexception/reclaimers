import * as React from 'react'
import { colors } from '../../AppStyles'

interface Props {
    objectives: Array<Objective>
}

export default class Objectives extends React.Component<Props> {

    render(){
        return <div style={{height:'100px', overflow:'auto', padding:'10px', background:'black', color: colors.lGreen, width:'400px', fontSize:'18px'}}>
                    {this.props.objectives.map(e=><h6>- {e.description}</h6>)}
               </div>
    }
}
    
     