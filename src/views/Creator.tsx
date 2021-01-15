import * as React from 'react'
import AppStyles, { colors } from '../../AppStyles';
import { AbilityCard, Button, CssIcon } from '../util/SharedComponents';
import { connect } from 'react-redux';
import { AbilityType, CharAppearanceEnd, CharAppearanceStart, ItemType, NPCType, Patron, Patrons, StatusEffect } from '../../constants';
import { v4 } from 'uuid';
import { onHideModal, onNewCharacter } from '../uiManager/Thunks';
import Footer from '../components/Footer';
import Speech from '../components/Speech';
import { hasPatronAbility } from '../util/Util';

const dialogues = {
    intro: "Your policy documents specify that you will need the support of one or more patrons. The following patrons are accepting >bronze tier< followers.",
    picked: "Click this ability again to remove it. The number of abilities you may select from a patron depends on how many patrons you serve."
}

interface Props {
    onlineAccount?: UserAccount
}

interface State {
    character: PlayerCharacter
    selectedPatronIndex:number
}

const defaultCharacter = {
    name: 'New Character',
    avatarIndex: null,
    abilities: [],
    maxHp: 1,
    maxMoves: 3,
    speed: 10,
    sight: 3,
    inventory: [],
    statusEffect: new Array<StatusEffectState>(),
    patrons: new Array<Patron>()
}

@(connect((state: RState) => ({
    onlineAccount: state.onlineAccount,
})) as any)
export default class Creator extends React.Component<Props, State> {

    state = { 
        character: {
            ...defaultCharacter,
            id:v4(),
            ownerId: this.props.onlineAccount.id,
            avatarIndex: CharAppearanceStart
        },         
        selectedPatronIndex: 0
    }

    addCharacter = () => {
        onNewCharacter({...this.state.character, abilities: this.state.character.abilities.concat([{type: AbilityType.Rags, cooldown: 0, uses: -1}, {type: AbilityType.Dagger, cooldown: 0, uses: 0}])})
        this.setState({
            character: {
                ...defaultCharacter,
                id:v4(),
                ownerId: this.props.onlineAccount.id
        }})
    }

    toggleAbility = (ability:AbilityType) => {
        let exists = this.state.character.abilities.findIndex(a=>a.type===ability)
        if(exists !== -1) this.state.character.abilities.splice(exists, 1)
        else this.state.character.abilities.push({
            type: ability, cooldown: 0, uses: 0
        })

        this.setState({
            character: {
                ...this.state.character,
                abilities: Array.from(this.state.character.abilities)
            }
        })
    }

    getBorderStyle = (i:number) => {
        if(hasPatronAbility(i, this.state.character)) return '1px solid yellow'
        if(i===this.state.selectedPatronIndex){
            return '1px solid white' ? '1px solid '+(hasPatronAbility(i, this.state.character)?'yellow':'white') : 'none'
        } 
    }

    render(){
        return (
            <div style={{...AppStyles.modal, width:'700px', height:'500px', justifyContent:'space-between'}}>
                {Speech(NPCType.Jeeves, this.state.character.abilities.length > 0 ? dialogues.picked : dialogues.intro)}
                <div style={{display:'flex', width:'100%', justifyContent:'space-between'}}>
                    {Button(this.state.selectedPatronIndex > 0, ()=>this.setState({selectedPatronIndex: this.state.selectedPatronIndex-1}), '<')}
                    {Patrons.map((p,i)=><div style={{border: this.getBorderStyle(i)}}>{CssIcon(p.type, 2)}</div>)}
                    {Button(this.state.selectedPatronIndex < Patrons.length-1, ()=>this.setState({selectedPatronIndex: this.state.selectedPatronIndex+1}), '>')}
                </div>
                <div style={{display:'flex',}}>
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center',width:'66%'}}>
                        <h4>{Patrons[this.state.selectedPatronIndex].name}</h4>
                        <div style={{display:'flex', marginBottom:'1em'}}>{Patrons[this.state.selectedPatronIndex].abilityPool.map(a=>AbilityCard(a, ()=>this.toggleAbility(a)))}</div>
                        <h6>"{Patrons[this.state.selectedPatronIndex].quote}"</h6>
                    </div>
                    <div style={{width:'34%'}}>
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                            <h4>Your Abilities</h4>
                            <div style={{display:'flex', marginBottom:'1em'}}>
                                {new Array(4).fill({}).map((slot,i)=>this.state.character.abilities[i] ? 
                                AbilityCard(this.state.character.abilities[i].type, ()=>this.toggleAbility(this.state.character.abilities[i].type)) : AbilityCard(AbilityType.Empty, null))}
                            </div>
                        </div>
                        <div style={{display:'flex', justifyContent:'space-between'}}>
                            {Button(this.state.character.avatarIndex > CharAppearanceStart, ()=>this.setState({character: {...this.state.character, avatarIndex: this.state.character.avatarIndex-1}}), '<')}
                            {CssIcon(this.state.character.avatarIndex, 2)}
                            {Button(this.state.character.avatarIndex < CharAppearanceEnd, ()=>this.setState({character: {...this.state.character, avatarIndex: this.state.character.avatarIndex+1}}), '>')}
                        </div>
                    </div>
                </div>
                <div>
                    <div style={{display:'flex', justifyContent:'flex-end', marginBottom:'0.5em'}}>
                        {Button(true, onHideModal, 'Cancel')}
                        <div style={{marginLeft:'1em'}}>{Button(this.state.character.abilities.length === 4, this.addCharacter, 'Create Avatar')}</div>
                    </div>
                    <Footer/>
                </div>
            </div>
        )
    }
}