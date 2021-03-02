import { Modal, UIReducerActions } from '../../constants';
import { Scenarios } from '../data/Scenarios';
import { getUnitFromData } from '../util/Util';

const appReducer = (state = getInitialState(), action:any):RState => {
    state.engineEvent = null
    switch (action.type) {
        case UIReducerActions.SHOW_MODAL:
            return { ...state, modalState: { modal: action.modal, data: action.data } }
        case UIReducerActions.HIDE_MODAL:
            return { ...state, modalState: null }
        case UIReducerActions.LOGOUT:
            return { ...state, modalState: {modal: Modal.MainMenu}, engineEvent: {action: UIReducerActions.LOGOUT, data: null }}
        case UIReducerActions.UPDATE_ACCOUNT:
            return { ...state, onlineAccount: {...action.account}}
        case UIReducerActions.JOIN_ENCOUNTER:
            let onlineAccount = state.onlineAccount
            let modalState = { modal: Modal.Menu }
            if(!onlineAccount.savedState.find(s=>s.map)){
                onlineAccount.savedState.push(action.match)
                modalState = { modal: Modal.Dialog, data: Scenarios.find(s=>s.scenario === action.match.map).intro } as any
            }
            return { ...state, activeEncounter: action.match, modalState, onlineAccount, engineEvent: { action: UIReducerActions.JOIN_ENCOUNTER, data: action.match }}
        case UIReducerActions.ENCOUNTER_UPDATED:
            return { ...state, activeEncounter: {...action.encounter}, engineEvent: { action: UIReducerActions.ENCOUNTER_UPDATED, data: action.encounter } }  
        case UIReducerActions.SELECT_UNIT:
            return { ...state, selectedBuilding: null, selectedUnit: action.unit }  
        case UIReducerActions.UNSELECT_UNIT:
            return { ...state, selectedUnit: null }
        case UIReducerActions.UPDATE_SELECT_UNIT:
            return { ...state, selectedUnit: action.unit } 
        case UIReducerActions.UPDATE_SELECT_BUILDING:
            return { ...state, selectedBuilding: action.bld} 
        case UIReducerActions.SELECT_DESTINATION:
            return { ...state, engineEvent: { action: UIReducerActions.SELECT_DESTINATION, data:null } }  
        case UIReducerActions.SPAWN_BOT:
            const design = action.design as RCUnitData
            design.requiredItems.forEach(i=>{
                state.onlineAccount.resources[i.type] -= i.amount
            })
            return { ...state, activeEncounter: {...state.activeEncounter}, engineEvent: { action: UIReducerActions.SPAWN_BOT, data: {unit: getUnitFromData(action.design), building: action.building} }}  
        case UIReducerActions.TILE_INFO:
            return { ...state, selectedTile: action.explored ? {...action.tile} : null}
        case UIReducerActions.UPDATE_PLAYER:
            return { ...state, onlineAccount: action.player}
        case UIReducerActions.BUILD_PYLON:
            return { ...state, engineEvent: { action: UIReducerActions.BUILD_PYLON, data: null }}
        case UIReducerActions.SELECT_BUILDING:
            return { ...state, selectedBuilding: action.unit, selectedUnit: null }
        case UIReducerActions.CHANGE_PRODUCTION:
            return { ...state, engineEvent: { action: UIReducerActions.CHANGE_PRODUCTION, data: action.design }}
        case UIReducerActions.PAUSE_PRODUCTION:
            return { ...state, engineEvent: { action: UIReducerActions.PAUSE_PRODUCTION, data: action.unitId }}
        case UIReducerActions.GATHER:
            return { ...state, engineEvent: { action: UIReducerActions.GATHER, data: action.unitId }}
        case UIReducerActions.UNGATHER:
            return { ...state, engineEvent: { action: UIReducerActions.UNGATHER, data: action.unitId }}
        case UIReducerActions.RESEARCH:
            state.onlineAccount.technologies.push(action.tech)
            return { ...state, modalState: { modal: Modal.Dialog, data: action.tech.messages }, onlineAccount: {...state.onlineAccount}}
        default:
            return state
    }
};

export default appReducer;

const getInitialState = ():RState => {
    return {
        modalState: { modal: Modal.MainMenu },
        onlineAccount: null,
        activeEncounter: null,
        engineEvent: null,
        selectedUnit: null,
        selectedTile: null,
        selectedBuilding: null
    }
}
