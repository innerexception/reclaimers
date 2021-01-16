import { Modal, Scenario, UIReducerActions } from '../../constants';
import Network from '../../firebase/Network';
import { getNewEncounter } from '../util/Util';

const appReducer = (state = getInitialState(), action:any):RState => {
    state.engineEvent = null
    switch (action.type) {
        case UIReducerActions.LOGIN_FAILED:
            return { ...state, loginInProgress:false, modalState: {modal:Modal.Login, data:action.message}}
        case UIReducerActions.SHOW_MODAL:
            return { ...state, modalState: { modal: action.modal, data: action.data } }
        case UIReducerActions.HIDE_MODAL:
            return { ...state, modalState: null }
        case UIReducerActions.LOGIN_PENDING:
            return { ...state, loginInProgress: true }
        case UIReducerActions.LOGIN_SUCCESS:
            let account = action.user as UserAccount
            let hub = getNewEncounter(Scenario.Hub)
            return { ...state, loginInProgress:false, onlineAccount: account, modalState: { modal: Modal.Intro }, activeEncounter: hub, engineEvent: { action: UIReducerActions.JOIN_ENCOUNTER, data: hub }}
        case UIReducerActions.LOGOUT:
            return getInitialState()
        case UIReducerActions.UPDATE_ACCOUNT:
            return { ...state, onlineAccount: {...action.account}}
        case UIReducerActions.ACTIVATE_ABILITY:
            return { ...state, activeAbility: action.ability, engineEvent: {action: UIReducerActions.ACTIVATE_ABILITY, data: action.ability } }
        case UIReducerActions.CLEAR_ABILITY: 
            return { ...state, activeAbility: null }
        case UIReducerActions.JOIN_ENCOUNTER:
            Network.subscribeToEncounter(action.match.id)
            let onlineAccount = state.onlineAccount || action.onlineAccount
            onlineAccount = {...onlineAccount, encounterId: action.match.id}
            Network.upsertAccount(onlineAccount)
            return { ...state, activeEncounter: action.match, modalState: null, onlineAccount, engineEvent: { action: UIReducerActions.JOIN_ENCOUNTER, data: action.match }}
        case UIReducerActions.ENCOUNTER_UPDATED:
            return { ...state, activeEncounter: action.encounter, engineEvent: { action: UIReducerActions.ENCOUNTER_UPDATED, data: action.encounter } }    
        default:
            return state
    }
};

export default appReducer;

const getInitialState = ():RState => {
    return {
        modalState: { modal: Modal.Login },
        onlineAccount: null,
        loginInProgress: false,
        activeEncounter: null,
        engineEvent: null,
        activeAbility: null,
        activeCharacterId: ''
    }
}
