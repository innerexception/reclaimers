import * as React from 'react'
import AppStyles, { colors } from '../../AppStyles'
import { ObjectiveList, Scenarios } from '../data/Scenarios'
import { onCreateEncounter } from '../uiManager/Thunks'
import { Button } from '../util/SharedComponents'
import { getNewEncounter } from '../util/Util'

interface Props {
    match: MapData
    player: RCPlayerState
}

interface State {
    ref: HTMLDivElement
}

export default class ObjectiveView extends React.Component<Props, State> {

    state:State = { ref: null }

    scroller = (ref:HTMLDivElement) => {
        this.setState({ref})
    }

    render(){
        const player = this.props.player
        const validObjectives = ObjectiveList.filter(e=>e.requires.every(o=>player.completedObjectives.includes(o)) || e.requires.length === 0)
        const incomplete = validObjectives.filter(e=>!player.completedObjectives.includes(e.id))
        return <div style={{...AppStyles.dialog, display:"flex", height:'250px'}}>
                    <div ref={this.scroller} style={{overflow:"hidden"}}>
                        <div>
                            {incomplete.map(e=><h5 style={{color:colors.lGreen}}>- {e.description}</h5>)}
                        </div>
                    </div>
                    <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                        {Button(true, ()=>this.state.ref.scrollBy(0,-40), '^')}
                        {Button(true, ()=>this.state.ref.scrollBy(0,40), 'V')}
                    </div>
                </div>
    }
}
    
     