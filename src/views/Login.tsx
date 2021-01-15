import * as React from 'react'
import AppStyles, { colors } from '../../AppStyles';
import { Button } from '../util/SharedComponents';
import { getErrorMessage } from '../util/Util';
import Netowkr from '../../firebase/Network';
import { connect } from 'react-redux';
import { onLoginFailed, onLoginStarted } from '../uiManager/Thunks';
import Footer from '../components/Footer';

interface Props {
    loginInProgress?: boolean
}

interface State {
    error:string
    email:string
    password:string
}

@(connect((state: RState) => ({
    loginInProgress: state.loginInProgress
})) as any)
export default class Login extends React.Component<Props, State> {

    state = { error: '', email:'', password:'' }

    trySignIn = async () => {
        try{
            onLoginStarted()
            await Netowkr.onTrySignIn(this.state.email, this.state.password)
        }
        catch(e){
            onLoginFailed()
            this.setState({error: getErrorMessage(e.code)})
        }
    }

    tryCreateUser = async () => {
        try{
            onLoginStarted()
            await Netowkr.onCreateUser(this.state.email, this.state.password)
        }
        catch(e){
            onLoginFailed()
            this.setState({error: getErrorMessage(e.code)})
        }
    }

    render(){
        return (
            <div style={{...AppStyles.modal, justifyContent:'space-between'}}>
                <div style={{width:'85%'}}>
                    <h2>After Life</h2>
                    <h5>Copyright 2068 TechnoSerf LLC</h5>
                    <hr/>
                    {this.state.error && <h4 style={{color:'gray'}}>{this.state.error}</h4>}
                    <div>
                        <h5 style={{color:colors.bronze}}>Bronze Member Login</h5>
                        <input style={{marginBottom:'0.5em', marginTop:'0.5em'}} placeholder="policy email" type="text" onChange={(e)=>this.setState({email: e.currentTarget.value})}/>
                        <input placeholder="password" type="password" onChange={(e)=>this.setState({password: e.currentTarget.value})}/>
                        <div style={{display:'flex', justifyContent:'space-between', marginTop:'0.5em'}}>
                            {Button(!this.props.loginInProgress, this.tryCreateUser, 'Register')}
                            <div style={{marginLeft:'1em'}}>{Button(!this.props.loginInProgress, this.trySignIn, 'Connect')}</div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

const style = { backgroundPosition:'center', backgroundSize:'cover', border: '2px inset' }