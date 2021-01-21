import { dispatch, store } from '../../App';
import { Modal, Scenario, UIReducerActions } from '../../constants';
// const { ipcRenderer } = require('electron');

export const onShowModal = (modal:Modal, data?:any) => {
    dispatch({
        type: UIReducerActions.SHOW_MODAL,
        modal,
        data
    })
}
export const onHideModal = () => {
    dispatch({
        type: UIReducerActions.HIDE_MODAL
    })
}

export const onLoginUser = (user:UserAccount) => {
    dispatch({
        type: UIReducerActions.LOGIN_SUCCESS,
        user
    })
}

export const onLogoutUser = () => {
    dispatch({
        type: UIReducerActions.LOGOUT
    })
}

export const onLoginStarted = () => {
    dispatch({
        type: UIReducerActions.LOGIN_PENDING
    })
}

export const onLoginFailed = () => {
    dispatch({
        type: UIReducerActions.LOGIN_FAILED
    })
}


export const onSpawnBot = (design:RCUnitData) => {
    dispatch({
        type: UIReducerActions.SPAWN_BOT,
        design
    })
}

// export const onLeaveMatch = () => {
//     let state = store.getState()
//     Provider.unsubscribeMatch(state.match, state.onlineAccount.uid)
//     dispatch({
//         type: UIReducerActions.LEAVE_MATCH
//     })
// }

export const onJoinEncounter = (match:Encounter, onlineAccount?:UserAccount) => {
    dispatch({
        type: UIReducerActions.JOIN_ENCOUNTER,
        match,
        onlineAccount
    })
}

export const onCreateEncounter = async (encounter:Encounter) => {
    dispatch({
        type: UIReducerActions.JOIN_ENCOUNTER,
        match:encounter
    })
}

// export const onQuit = () => {
//     ipcRenderer.send('close')
// }

export const onSelectUnitDestination = () => {
    dispatch({
        type: UIReducerActions.SELECT_DESTINATION
    })
}

export const onUpdateSelectedUnit = (unit:RCUnit) => {
    dispatch({
        type: UIReducerActions.UPDATE_SELECT_UNIT,
        unit
    })
}

export const onSelectedUnit = (unit:RCUnit) => {
    dispatch({
        type: UIReducerActions.SELECT_UNIT,
        unit
    })
}

export const onShowTileInfo = (tileX:number, tileY:number, explored:boolean) => {
    dispatch({
        type: UIReducerActions.TILE_INFO,
        tileX, tileY, explored
    })
}

export const onEncounterUpdated = (encounter:Encounter) => {
    dispatch({
        type: UIReducerActions.ENCOUNTER_UPDATED,
        encounter
    })
}

export const onActivateAbility = (ability:Ability) => {
    dispatch({
        type: UIReducerActions.ACTIVATE_ABILITY,
        ability
    })
}

export const onClearActiveAbility = () => {
    dispatch({
        type: UIReducerActions.CLEAR_ABILITY
    })
}

export const onUpdateAccount = (account:UserAccount) => {
    dispatch({
        type: UIReducerActions.UPDATE_ACCOUNT,
        account
    })
}

