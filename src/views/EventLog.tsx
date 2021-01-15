import * as React from 'react'
import AppStyles, { colors } from '../../AppStyles'

interface Props {
    events: Array<string>
}

export default class EventLog extends React.Component<Props> {

    messagesEndRef = React.createRef<HTMLDivElement>()

    componentDidMount() {
        this.scrollToBottom();
    }
      
    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom = () => {
        this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

    render(){
        return <div style={{height:'100px', overflow:'auto', padding:'10px', background:'black', color: colors.lGreen, width:'400px', fontSize:'18px'}}>
                    {this.props.events.map(e=><h6>{e}</h6>)}
                    <div ref={this.messagesEndRef}/>
               </div>
    }
}
    
     