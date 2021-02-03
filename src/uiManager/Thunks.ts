import { dispatch, store } from '../../App';
import { Modal, Scenario, UIReducerActions } from '../../constants';
import BuildingSprite from '../BuildingSprite';
import { canAffordBot } from '../util/Util';
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


export const onSpawnBot = (design:RCUnitData, building:BuildingSprite) => {
    const me = store.getState().activeEncounter.players[0]
    if(canAffordBot(me.resources, design))
        dispatch({
            type: UIReducerActions.SPAWN_BOT,
            design,
            building
        })
}

export const onChangeProduction = (design:RCUnitData) => {
    dispatch({
        type: UIReducerActions.CHANGE_PRODUCTION,
        design
    })
}

export const onPauseProduction = () => {
    dispatch({
        type: UIReducerActions.PAUSE_PRODUCTION,
    })
}

export const onStartBuildPylon = () => {
    dispatch({
        type: UIReducerActions.BUILD_PYLON
    })
}

export const onJoinEncounter = (match:MapData, onlineAccount?:UserAccount) => {
    dispatch({
        type: UIReducerActions.JOIN_ENCOUNTER,
        match,
        onlineAccount
    })
}

export const onCreateEncounter = async (encounter:MapData) => {
    dispatch({
        type: UIReducerActions.JOIN_ENCOUNTER,
        match:encounter
    })
}

// export const onQuit = () => {
//     ipcRenderer.send('close')
// }

export const onGatherUnits = () => {
    dispatch({
        type: UIReducerActions.GATHER
    })
}

export const onSelectUnitDestination = () => {
    dispatch({
        type: UIReducerActions.SELECT_DESTINATION
    })
}

export const onUpdateSelectedUnit = (unit:RCUnit) => {
    const selectedUnit = store.getState().selectedUnit
    if(selectedUnit && selectedUnit.id === unit.id){
        dispatch({
            type: UIReducerActions.UPDATE_SELECT_UNIT,
            unit
        })
    }
}

export const onUpdateSelectedBuilding = (bld:RCBuildingState) => {
    const selectedUnit = store.getState().selectedBuilding
    if(selectedUnit && selectedUnit.id === bld.id){
        dispatch({
            type: UIReducerActions.UPDATE_SELECT_BUILDING,
            bld
        })
    }
}

export const onUpdatePlayer = (player:RCPlayerState) => {
    dispatch({
        type: UIReducerActions.UPDATE_PLAYER,
        player
    })
}

export const onSelectedUnit = (unit:RCUnit) => {
    dispatch({
        type: UIReducerActions.SELECT_UNIT,
        unit
    })
}

export const onSelectedBuilding = (unit:RCBuildingState) => {
    dispatch({
        type: UIReducerActions.SELECT_BUILDING,
        unit
    })
}

export const onShowTileInfo = (tile:TileInfo, explored:boolean) => {
    dispatch({
        type: UIReducerActions.TILE_INFO,
        tile, explored
    })
}

export const onEncounterUpdated = (encounter:MapData) => {
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

