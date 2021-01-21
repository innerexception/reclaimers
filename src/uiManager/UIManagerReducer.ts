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
            return { ...state, selectedUnit: action.unit, engineEvent: { action: UIReducerActions.SELECT_UNIT, data: action.unit } }  
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
            return { ...state, modalState: null, engineEvent: { action: UIReducerActions.SPAWN_BOT, data: getUnitFromData(action.design, state.onlineAccount.id) }}  
        case UIReducerActions.TILE_INFO:
            return { ...state, selectedTile: action.explored ? state.activeEncounter.tiles[action.tileX][action.tileY] : null}
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
        selectedTile: null
    }
}
