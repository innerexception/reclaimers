import * as React from 'react'
import AppStyles from '../AppStyles';
import { Modal, Objectives } from '../constants';
import { ObjectiveList } from './data/Scenarios';
import { onHideModal, onShowModal } from './uiManager/Thunks';
import { Button } from './util/SharedComponents';

interface Props {
    messages:Array<string>
    choices?: Array<Objectives>
}

export default class Dialog extends React.Component<Props> {

    state = { textLength: 0, currentStringIndex: 0}

    componentWillReceiveProps(props:Props){
        if(!props.messages[this.state.currentStringIndex]){
            this.setState({ currentStringIndex: 0})
        }
    }

    componentDidMount(){
        this.renderNextLetter()
    }

    renderNextLetter = ()=> {
        if(this.state.textLength < this.props.messages[this.state.currentStringIndex].length){
            this.setState({textLength: this.state.textLength+1})
            setTimeout(this.renderNextLetter, 100)
        }
    }

    onNextMessage = () => {
        this.setState({textLength: 0, currentStringIndex: this.state.currentStringIndex+1}, this.renderNextLetter)
    }

    getButton = () => {
        if(this.state.currentStringIndex === this.props.messages.length-1){
            if(this.props.choices){
                return this.props.choices.map(c=>{
                    const obj = ObjectiveList.find(o=>o.id === c)
                    const e:TileEvent = {
                        messages: [obj.description],
                        objective: obj.id
                    }
                    return Button(true, ()=>onShowModal(Modal.Dialog, e), obj.choiceLabel)
                })
            }
            return Button(true, onHideModal, 'Next')
        }
            
        if(this.props.messages[this.state.currentStringIndex].length === this.state.textLength)
            return Button(true, this.onNextMessage, 'Next')
        if(this.props.messages[this.state.currentStringIndex].length > this.state.textLength)
            return Button(true, ()=>this.setState({textLength: this.props.messages[this.state.currentStringIndex].length}), 'Skip')
    }

    render(){
        return <div style={{...AppStyles.modal, height:'200px', width:'350px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', flexDirection:'column', height:'100%'}}>
                        <div style={{width:'100%'}} dangerouslySetInnerHTML={{__html: this.props.messages[this.state.currentStringIndex].substring(0,this.state.textLength)}}></div>
                        {this.getButton()}
                    </div>
                </div>
                    
    }
}
