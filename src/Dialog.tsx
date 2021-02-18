import * as React from 'react'
import AppStyles from '../AppStyles';
import { Modal } from '../constants';
import { onHideModal, onShowModal } from './uiManager/Thunks';
import { Button } from './util/SharedComponents';

interface Props {
    messages:Array<string>
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
            return Button(true, ()=>onShowModal(Modal.Menu), 'Next')
        }
            
        if(this.props.messages[this.state.currentStringIndex].length === this.state.textLength)
            return Button(true, this.onNextMessage, 'Next')
        if(this.props.messages[this.state.currentStringIndex].length > this.state.textLength)
            return Button(true, ()=>this.setState({textLength: this.props.messages[this.state.currentStringIndex].length}), 'Skip')
    }

    render(){
        return <div style={{...AppStyles.modal, height:'200px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', flexDirection:'column', height:'100%'}}>
                        <div style={{width:'100%'}} dangerouslySetInnerHTML={{__html: this.props.messages[this.state.currentStringIndex].substring(0,this.state.textLength)}}></div>
                        {this.getButton()}
                    </div>
                </div>
                    
    }
}
