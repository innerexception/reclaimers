import * as React from 'react'
import { colors } from '../../AppStyles'
import { Scenarios } from '../data/Scenarios'
import { onCreateEncounter } from '../uiManager/Thunks'
import { Button } from '../util/SharedComponents'
import { getNewEncounter } from '../util/Util'

interface Props {
    objectives: Array<Objective>
    match: MapData
    player: RCPlayerState
}

export default class ObjectiveView extends React.Component<Props> {

    render(){
        const player = this.props.player
        const completed = this.props.objectives.filter(e=>player.completedObjectives.includes(e.id))
        const incomplete = this.props.objectives.filter(e=>!player.completedObjectives.includes(e.id))
        return <div style={{overflow:'auto', padding:'10px', background:'black', color: colors.lGreen, fontSize:'18px'}}>
                    {incomplete.map(e=><h5 style={{color:colors.bronze}}>- {e.description}</h5>)}
                    {completed.map(e=><h5 style={{color:colors.lGreen}}>- {e.description}</h5>)}
                    {incomplete.length === 0 && Button(true, ()=>onCreateEncounter(getNewEncounter(Scenarios[Scenarios.findIndex(s=>s.scenario === this.props.match.map)+1].scenario)), 'Continue ->')}
               </div>
    }
}
    
     