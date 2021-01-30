import { Modal, Scenario, UIReducerActions } from '../../constants';
import { getNewEncounter, getUnitFromData } from '../util/Util';

const appReducer = (state = getInitialState(), action:any):RState => {
    state.engineEvent = null
    switch (action.type) {
        case UIReducerActions.SHOW_MODAL:
            return { ...state, modalState: { modal: action.modal, data: action.data } }
        case UIReducerActions.HIDE_MODAL:
            return { ...state, modalState: null }
        case UIReducerActions.LOGOUT:
            return {...state, activeEncounter: null, modalState: { modal: Modal.Menu} }
        case UIReducerActions.UPDATE_ACCOUNT:
            return { ...state, onlineAccount: {...action.account}}
        case UIReducerActions.ACTIVATE_ABILITY:
            return { ...state, activeAbility: action.ability, engineEvent: {action: UIReducerActions.ACTIVATE_ABILITY, data: action.ability } }
        case UIReducerActions.CLEAR_ABILITY: 
            return { ...state, activeAbility: null }
        case UIReducerActions.JOIN_ENCOUNTER:
            let onlineAccount = state.onlineAccount || action.onlineAccount
            onlineAccount = {...onlineAccount, encounterId: action.match.id}
            return { ...state, activeEncounter: action.match, modalState: null, onlineAccount, engineEvent: { action: UIReducerActions.JOIN_ENCOUNTER, data: action.match }}
        case UIReducerActions.ENCOUNTER_UPDATED:
            return { ...state, activeEncounter: {...action.encounter}, engineEvent: { action: UIReducerActions.ENCOUNTER_UPDATED, data: action.encounter } }  
        case UIReducerActions.SELECT_UNIT:
            return { ...state, selectedUnit: {...action.unit}, engineEvent: { action: UIReducerActions.SELECT_UNIT, data: action.unit.id } }  
        case UIReducerActions.UPDATE_SELECT_UNIT:
            if(state.selectedUnit){
                return { ...state, selectedUnit: state.selectedUnit.id === action.unit.id ? {...action.unit} : state.selectedUnit} 
            }
            return { ...state}  
        case UIReducerActions.SELECT_DESTINATION:
            return { ...state, engineEvent: { action: UIReducerActions.SELECT_DESTINATION, data:null } }  
        case UIReducerActions.SPAWN_BOT:
            state.activeEncounter.players.forEach(p=>{
                if(p.id === state.onlineAccount.id){
                    const design = action.design as RCUnitData
                    design.requiredItems.forEach(i=>{
                        p.resources[i.type] -= i.amount
                    })
                }
            })
            return { ...state, modalState: null, engineEvent: { action: UIReducerActions.SPAWN_BOT, data: {unit: getUnitFromData(action.design, state.onlineAccount.id), building: action.building} }}  
        case UIReducerActions.TILE_INFO:
            return { ...state, selectedTile: action.explored ? {...action.tile} : null}
        case UIReducerActions.UPDATE_PLAYER:
            let i = state.activeEncounter.players.findIndex(p=>p.id===action.player.id)
            state.activeEncounter.players.splice(i,1,action.player)
            return { ...state, activeEncounter: {...state.activeEncounter} }
        case UIReducerActions.BUILD_PYLON:
            return { ...state, engineEvent: { action: UIReducerActions.BUILD_PYLON, data: null }}
        case UIReducerActions.SELECT_BUILDING:
            return { ...state, selectedBuilding: action.unit, selectedUnit: null }
        default:
            return state
    }
};

export default appReducer;

const getInitialState = ():RState => {
    return {
        modalState: { modal: Modal.Menu },
        onlineAccount: null,
        activeEncounter: null,
        engineEvent: null,
        activeAbility: null,
        selectedUnit: null,
        selectedTile: null,
        selectedBuilding: null
    }
}
